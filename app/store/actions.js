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
      console.log(node);
      commit('SELECT_NODE', node);
    }
    if (localTxn) {
      commit('LOAD_LOCAL_TXN', localTxn);
    }
    await dispatch('getPrice', app.env.cryptocompare);
  } catch (error) {}
}
export function selectNode({ commit }, node) {
  this.$zilliqa.setProvider(new HTTPProvider(node.url));
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
      .$get(`${config.VIEWBLOCK_URL}${address}`, {
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
        commit('SUCCESS');
        tx.res = res;
        commit('SAVE_TXN', tx);
        resolve(res);
      })
      .catch(err => {
        commit('ERROR');
        reject(err);
      });
  });
}
