import { HTTPProvider } from '@zilliqa-js/core';

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
    if (node && node.url) {
      commit('SELECT_NODE', node);
    }
    await dispatch('getPrice', { ...app.env.cryptocompare, symbol: 'ZIL' });
    await dispatch('getPrice', { ...app.env.cryptocompare, symbol: 'SGD' });
    await dispatch('getZrc2List');
    commit('updateLocalTxn');
  } catch (error) {}
}
export function selectNode({ commit, getters, dispatch, state }, node) {
  this.$zillet.setProvider(new HTTPProvider(node.url));
  commit('SELECT_NODE', node);
  if (getters.LoggedIn) {
    dispatch('fetchTokenBalance');
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
      .get('/zrc2/zrc2.json')
      .then(resData => {
        commit('UPDATE_ZRC2_LIST', resData.data);
        resolve(resData);
      })
      .catch(err => {
        commit('ERROR');
        commit('UPDATE_ZRC2_LIST', []);
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

export function sendTransaction({ commit, state }, tx) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    let data = JSON.stringify(setData('CreateTransaction', [tx]));
    this.$axios
      .$post(state.selectedNode.url, data)
      .then(res => {
        console.info(res);
        commit('SUCCESS');
        resolve(res);
      })
      .catch(err => {
        console.error(err);
        commit('ERROR');
        reject(err);
      });
  });
}

export function fetchTokenBalance({ commit, state, getters }) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    const t = this;
    let balances = [];
    try {
      const networkType = state.selectedNode.id == 1 ? 'mainet' : 'testnet';
      const address =
        getters.Account.address && getters.Account.address.toLowerCase();
      if (state.zrc2.length == 0) {
        commit('SUCCESS');
        resolve(balances);
      } else {
        state.zrc2.forEach(async (element, index) => {
          let deployedContract;
          if (networkType == 'mainet') {
            deployedContract = t.$zillet.contracts.at(element.address);
          } else {
            deployedContract = t.$zillet.contracts.at(element.testnetAddress);
          }
          let bal = await deployedContract.getSubState('balances', [address]);
          let tokenBal = 0;
          if (bal && bal.balances) {
            tokenBal = bal.balances[address];
          }
          balances.push({
            ...element,
            balance: tokenBal
          });
          if (index == state.zrc2.length - 1) {
            commit('UPDATE_BALANCE', balances);
            commit('SUCCESS');
            resolve(balances);
          }
        });
      }
    } catch (error) {
      commit('ERROR');
      reject(error);
    }
  });
}
