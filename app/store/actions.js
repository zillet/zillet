import { HTTPProvider } from '@zilliqa-js/core';

import config from './../config';
function setData(method, params) {
  return {
    id: '1',
    jsonrpc: '2.0',
    method: method,
    params: params
  };
}

export async function nuxtClientInit({ commit, dispatch }, app) {
  try {
    const node = JSON.parse(localStorage.getItem('_selected_node'));
    const localTxn = JSON.parse(localStorage.getItem('_local_txn'));
    if (node && node.url) {
      commit('SELECT_NODE', node);
    }
    if (localTxn) {
      commit('LOAD_LOCAL_TXN', localTxn);
    }
    await dispatch('getPrice', { ...app.env.cryptocompare, symbol: 'ZIL' });
    await dispatch('getPrice', { ...app.env.cryptocompare, symbol: 'SGD' });
    await dispatch('getZrc2List');
  } catch (error) {}
}
export function selectNode({ commit, getters, dispatch }, node) {
  this.$zillet.setProvider(new HTTPProvider(node.url));
  commit('SELECT_NODE', node);
  if (getters.LoggedIn) {
    dispatch('fetchBalance');
  }
}
export function clearWallet({ commit }) {
  this.$zillet.clearAccount();
  commit('CLEAR_WALLET');
}
export function getContract({ commit }, contractAddress) {
  return new Promise(async (resolve, reject) => {
    let details = {};
    try {
      const contract = await this.$zillet.contracts.at(contractAddress);
      const contractInit = await contract.getInit();
      if (contractInit) {
        contractInit.forEach(el => {
          if (['decimals', 'name', 'symbol'].includes(el.vname)) {
            details[el.vname] = el.value;
          }
        });
        resolve(details);
      } else {
        reject(Error('Not a contract address'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getZrc2List({ commit }) {
  return new Promise((resolve, reject) => {
    this.$axios
      .$get(
        'https://raw.githubusercontent.com/zillet/zrc2-tokens/master/zrc2.json'
      )
      .then(resData => {
        commit('UPDATE_ZRC2_LIST', resData);
        resolve(resData);
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function getPrice({ commit }, { url, token, symbol }) {
  return new Promise((resolve, reject) => {
    this.$axios
      .$get(url, {
        params: {
          fsym: symbol,
          tsyms: 'BTC,ETH,USD,EUR,INR,',
          api_key: token
        }
      })
      .then(resData => {
        commit('FETCHED_PRICE', { symbol: symbol, data: resData });
        resolve(resData);
      })
      .catch(err => {
        reject(err);
      });
  });
}
export function getTransactions({ commit }, data) {
  return new Promise((resolve, reject) => {
    var address = data.address;
    var network = data.network || 'mainnet';
    var page = data.page || 1;
    var type = data.type || 'all';
    commit('LOADING');
    this.$axios
      .$get(`${config.VIEWBLOCK_URL}${address}/txs`, {
        params: {
          network: network,
          page: page,
          type: type
        },
        headers: {
          'X-APIKEY':
            '74da2e513cb0ce63ad6733f0d09a074b614ca9752a9e8201ab28678814fbc39a'
        }
      })
      .then(resData => {
        resolve(resData);
        commit('SUCCESS');
        commit('SAVE_TRANSACTIONS', resData);
      })
      .catch(err => {
        commit('ERROR');
        reject(err);
      });
  });
}
export function checkNetworkStatus({}, url) {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify(setData('GetNetworkId', ['']));
    this.$axios
      .$post(url, data)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function sendTransaction({ commit, dispatch, state }, tx) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    let data = JSON.stringify(setData('CreateTransaction', [tx]));
    this.$axios
      .$post('', data)
      .then(res => {
        console.info(res);
        commit('SUCCESS');
        tx.res = res;
        tx.type = 'zillet';
        commit('saveTxn', tx);
        resolve(res);
      })
      .catch(err => {
        console.error(err);
        commit('ERROR');
        reject(err);
      });
  });
}

export function fetchBalance({ commit, state, getters }) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    const t = this;
    let balances = [];
    try {
      const networkType = state.selectedNode.id == 1 ? 'mainet' : 'testnet';
      const address =
        getters.Account.address && getters.Account.address.toLowerCase();
      state.zrc2.forEach(async (element, index) => {
        let deployedContract;
        if (networkType == 'mainet') {
          deployedContract = t.$zillet.contracts.at(element.address);
        } else {
          deployedContract = t.$zillet.contracts.at(element.testnetAddress);
        }
        let bal;
        if (element.symbol == 'XSGD') {
          bal = await deployedContract.getSubState('balances', [address]);
          if (bal && bal.balances) {
            balances.push({
              ...element,
              balance: bal.balances[address]
            });
          }
        } else {
          bal = await deployedContract.getSubState('balances_map', [address]);
          if (bal && bal.balances_map) {
            balances.push({
              ...element,
              balance: bal.balances_map[address]
            });
          }
        }
        if (index == state.zrc2.length - 1) {
          commit('UPDATE_BALANCE', balances);
          commit('SUCCESS');
          resolve(balances);
        }
      });
    } catch (error) {
      commit('ERROR');
      reject(error);
    }
  });
}
