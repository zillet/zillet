import Vuex from 'vuex';

import * as actions from '@/store/actions';
import * as mutations from '@/store/mutations';
import * as getters from '@/store/getters';
import config from '@/config.json';
const createStore = () =>
  new Vuex.Store({
    state: {
      loading: false,
      nodes: config.NODES,
      zrc2: [],
      tokenBalances: [],
      selectedNode: config.NODES[0],
      selectedAccount: 'Account 1',
      wallet: {
        address: '',
        privateKey: '',
        publicKey: '',
        balance: '',
        nonce: ''
      },
      errorMsg: '',
      encryptedWallets: [],
      prices: {
        ZIL: {
          USD: 0.02
        },
        XSGD: { USD: 0.75 }
      },
      viewblockAccount: {
        txs: []
      },
      localTxns: [],
      accessType: ''
    },
    actions,
    mutations,
    getters,
    strict: false,
    preserveState: true
  });

export default createStore;
