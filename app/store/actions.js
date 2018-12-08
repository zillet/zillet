function setData(method, params) {
  return {
    id: '1',
    jsonrpc: '2.0',
    method: method,
    params: params
  };
}

export function checkNetworkStatus({}, url) {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify(setData('GetNetworkId', ['']));
    this.$fetch(url, {
      method: 'POST',
      body: data
    })
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
    this.$fetch('', {
      method: 'POST',
      body: data
    })
      .then(res => {
        commit('BALANCE', res.result);
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
    this.$fetch('', {
      method: 'POST',
      body: data
    })
      .then(res => {
        commit('SUCCESS');
        dispatch('getBalance', state.wallet.address);
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
