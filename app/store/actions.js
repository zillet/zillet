function setData(method, params) {
  return {
    id: '1',
    jsonrpc: '2.0',
    method: method,
    params: params
  };
}

export function nuxtClientInit({ commit, dispatch, state }) {
  dispatch('getMinimumGasPrice');
  try {
    const node = JSON.parse(localStorage.getItem('_selected_node'));
    const encryptedWallet = JSON.parse(
      localStorage.getItem('_encrypted_wallets')
    );
    const selectedAccount = JSON.parse(
      localStorage.getItem('_selected_account')
    );
    if (node) {
      commit('SELECT_NODE', node);
    }
    if (encryptedWallet) {
      commit('LOAD_ENCRYPTED_WALLETS', encryptedWallet);
    }
    if (state.encryptedWallets.length) {
      var account;
      if (selectedAccount) {
        account = state.encryptedWallets.find(
          el => el.label == selectedAccount
        );
        account = { address: account.keystore.address };
      } else {
        account = state.encryptedWallets[0];
        account = { address: account.keystore.address };
      }
      commit('IMPORT_ACCOUNT', account);
      dispatch('getBalance', account.address);
    }
  } catch (error) {
    console.log(error);
  }
}
export function selectNode({ commit }, node) {
  commit('SELECT_NODE', node);
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
        commit('MIN_GAS_PRICE', res.result);
        resolve(res);
      })
      .catch(err => {
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
