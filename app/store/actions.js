function setData(method, params) {
  return {
    id: '1',
    jsonrpc: '2.0',
    method: method,
    params: params
  };
}
export async function nuxtClientInit({ dispatch }, app) {
  await dispatch('getPrice', app.env.price);
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
export function checkNetworkStatus({}, url) {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify(setData('GetNetworkId', ['']));
    this.$axios
      .$post(url, data)
      .then(resData => {
        resolve(resData);
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
      .then(resData => {
        commit('BALANCE', resData.result);
        commit('SUCCESS');
        resolve(resData);
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
      .then(resData => {
        commit('SUCCESS');
        dispatch('getBalance', state.wallet.address);
        resolve(resData);
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
