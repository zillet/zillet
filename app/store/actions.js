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
    if (node) {
      commit('SELECT_NODE', node);
    }
    if (localTxn) {
      commit('LOAD_LOCAL_TXN', localTxn);
    }
    await dispatch('getMinimumGasPrice');
    await dispatch('getPrice', app.env.cryptocompare);
  } catch (error) {}
}
export function selectNode({ commit }, node) {
  this.$zilliqa.setProvider(new HTTPProvider(node.url));
  console.log(this.$zilliqa);
  commit('SELECT_NODE', node);
}
export function getPrice({ commit }, { url, token }) {
  return new Promise((resolve, reject) => {
    this.$axios
      .$get(url, {
        params: {
          fsym: 'ZIL',
          tsyms: 'BTC,ETH,USD,EUR,INR,',
          api_key: token
        }
      })
      .then(resData => {
        commit('FETCHED_PRICE', resData);
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
      .$get(`${config.VIEWBLOCK_URL}0x${address}`, {
        params: {
          network: network,
          page: page,
          type: type
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
export function importAccount({ commit, dispatch }, pk) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    try {
      const {
        getAddressFromPrivateKey,
        getPubKeyFromPrivateKey
      } = this.$zil.crypto;
      let wallet = {
        privateKey: pk,
        address: getAddressFromPrivateKey(pk),
        publicKey: getPubKeyFromPrivateKey(pk)
      };
      commit('IMPORT_ACCOUNT', wallet);
      commit('SUCCESS');
      dispatch('getBalance', wallet.address);
      resolve(wallet);
    } catch (error) {
      commit('ERROR');
      reject(error);
    }
  });
}
export function getBalance({ commit }, address) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    let data = JSON.stringify(setData('GetBalance', [address]));
    this.$axios
      .$post('', data)
      .then(res => {
        const result = res.result ? res.result : { balance: 0, nonce: 0 };
        commit('BALANCE', result);
        commit('SUCCESS');
        resolve(res);
      })
      .catch(err => {
        commit('ERROR');
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
        commit('SUCCESS');
        tx.res = res;
        commit('SAVE_TXN', tx);
        dispatch('getBalance', state.wallet.address);
        resolve(res);
      })
      .catch(err => {
        commit('ERROR');
        reject(err);
      });
  });
}
export function getMinimumGasPrice({ commit }) {
  return new Promise((resolve, reject) => {
    commit('LOADING');
    const data = JSON.stringify(setData('GetMinimumGasPrice', ['']));
    this.$axios
      .$post('', data)
      .then(res => {
        commit('SUCCESS');
        commit('MIN_GAS_PRICE', res.result);
        resolve(res);
      })
      .catch(err => {
        commit('ERROR');
        reject(err);
      });
  });
}
export function clearWallet({ commit }) {
  return new Promise(resolve => {
    commit('EMPTY_WALLET');
    resolve();
  });
}
export function saveEncryptedWallet({ commit, state }, eW) {
  return new Promise(resolve => {
    let wallet = {};
    if (!eW.label) {
      wallet.keystore = eW;
      wallet.label = `Account ${state.encryptedWallets.length + 1}`;
    } else {
      wallet = eW;
    }
    commit('SAVE_ENCRYPTED_WALLET', wallet);
    resolve();
  });
}
