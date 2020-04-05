export const LOADING = state => {
  state.loading = true;
};
export const SUCCESS = state => {
  state.loading = false;
  state.errorMsg = '';
};
export const ERROR = (state, msg) => {
  state.loading = false;
  state.errorMsg = msg;
};
export const importAccount = (state, result) => {
  state.wallet = { ...state.wallet, ...result };
};
export const updateBalance = (state, result) => {
  state.wallet = { ...state.wallet, ...result };
};
export const CLEAR_WALLET = (state, result) => {
  state.wallet = {
    address: '',
    privateKey: '',
    publicKey: '',
    balance: '',
    nonce: ''
  };
};
export const SELECT_NODE = (state, node) => {
  state.selectedNode = { ...state.selectedNode, ...node };
  if (node.refresh) {
    state.wallet = {
      address: '',
      privateKey: '',
      publicKey: '',
      balance: '',
      nonce: ''
    };
  }
};
export const UPDATE_BALANCE = (state, result) => {
  state.tokenBalances = result;
};
export const FETCHED_PRICE = (state, prices) => {
  if (prices.symbol == 'SGD') prices.symbol = 'SXGD';
  state.prices[prices.symbol] = prices.data;
};
export const SAVE_TRANSACTIONS = (state, data) => {
  state.viewblockAccount.txs = data;
  for (let index = 0; index < state.viewblockAccount.txs.length; index++) {
    const hash = state.viewblockAccount.txs[index].hash;
    state.localTxns = state.localTxns.filter(function(obj) {
      return obj.hash !== hash;
    });
  }
  localStorage.setItem('_local_txn', JSON.stringify(state.localTxns));
};
export const saveTxn = (state, data) => {
  var txn;
  if (data.type === 'zillet') {
    state.wallet.nonce = data.nonce;
    let localNonces;
    try {
      localNonces = JSON.parse(localStorage.getItem('_local_nonces')) || {};
    } catch (error) {
      localNonces = {};
    }
    localNonces[state.wallet.address] = {
      nonce: state.wallet.nonce,
      lastUpdated: +new Date()
    };
    localStorage.setItem('_local_nonces', JSON.stringify(localNonces));
  }
  txn = {
    direction: data.toAddr == state.wallet.address ? 'self' : 'out',
    timestamp: new Date(),
    hash: '0x' + data.TranID,
    from: state.wallet.address,
    to: data.toAddr,
    value: data.amount,
    fee: data.gasLimit * data.gasPrice,
    extra: {},
    status: 'pending',
    type: 'transfer',
    version: data.version
  };
  state.localTxns.push(txn);
  localStorage.setItem('_local_txn', JSON.stringify(state.localTxns));
};
export const LOAD_LOCAL_TXN = (state, data) => {
  const fourHour = 4 * 60 * 60 * 1000;
  state.localTxns = data.filter(function(item) {
    return new Date() - new Date(item.timestamp) < fourHour;
  });
  localStorage.setItem('_local_txn', JSON.stringify(state.localTxns));
};
export const LOAD_ENCRYPTED_WALLETS = (state, jsonData) => {
  state.encryptedWallets = jsonData;
};
export const SAVE_ENCRYPTED_WALLET = (state, wallet) => {
  const found = state.encryptedWallets.some(
    el => el.keystore.address === wallet.keystore.address
  );
  if (!found) state.encryptedWallets.push(wallet);
  localStorage.setItem(
    '_encrypted_wallets',
    JSON.stringify(state.encryptedWallets)
  );
};
export const saveAccessType = (state, id) => {
  state.accessType = id;
};
