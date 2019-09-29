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

export const FETCHED_PRICE = (state, prices) => {
  state.prices = prices;
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
    txn = {
      direction: data.toAddr == state.wallet.address ? 'self' : 'out',
      timestamp: new Date(),
      hash: '0x' + (data.res && data.res.result && data.res.result.TranID),
      from: state.wallet.address,
      to: data.toAddr,
      value: data.amount,
      fee: data.gasLimit * data.gasPrice,
      extra: {},
      status: 'pending',
      type: 'transfer',
      version: state.selectedNode.version
    };
  } else if (data.type === 'zilpay' || data.type === 'moonlet') {
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
  }
  state.localTxns.push(txn);
  localStorage.setItem('_local_txn', JSON.stringify(state.localTxns));
};
export const LOAD_LOCAL_TXN = (state, data) => {
  state.localTxns = data;
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
