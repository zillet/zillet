import { formatTransaction, formatLocalTransaction } from '@/utils';
import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto';
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
export const UPDATE_ZRC2_LIST = (state, zrc2) => {
  let lzrc2;
  try {
    lzrc2 = JSON.parse(localStorage.getItem('_zrc2_tokens'));
    if (lzrc2 == null) {
      lzrc2 = [];
    }
  } catch (error) {
    lzrc2 = [];
  }
  state.zrc2 = [...zrc2, ...lzrc2];
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
  if (prices.symbol == 'SGD') prices.symbol = 'XSGD';
  state.prices[prices.symbol] = prices.data;
};
export const SAVE_TRANSACTIONS = (state, data) => {
  state.viewblockAccount.txs = data;
  const nodeId = state.selectedNode.id == 1 ? 'address' : 'testnetAddress';
  const zrc2 = state.zrc2;
  for (let index = 0; index < state.viewblockAccount.txs.length; index++) {
    let tx = state.viewblockAccount.txs[index];
    tx = formatTransaction(tx, zrc2, nodeId);
    const hash = tx.hash;
    state.localTxns = state.localTxns.filter(function(obj) {
      return obj.hash !== hash;
    });
  }
  localStorage.setItem('_local_txn', JSON.stringify(state.localTxns));
};
export const saveTxn = (state, data) => {
  console.log(data);
  let txn = {
    ...data,
    direction: data.toAddr == state.wallet.address ? 'self' : 'out',
    timestamp: new Date(),
    hash: '0x' + data.TranID,
    from: state.wallet.address,
    to: data.toAddr,
    value: data.amount.toString(),
    fee: data.gasLimit * data.gasPrice,
    extra: {},
    status: 'pending',
    version: data.version,
    data: JSON.stringify(data.data)
  };

  //
  if (data.via === 'zillet') {
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
export const saveAccessType = (state, id) => {
  state.accessType = id;
};
