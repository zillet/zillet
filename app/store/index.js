import Vuex from 'vuex';

import * as actions from '@/store/actions';
import * as mutations from '@/store/mutations';
import * as getters from '@/store/getters';
import config from '@/config';
const createStore = () =>
  new Vuex.Store({
    state: {
      loading: false,
      nodes: config.NODES,
      selectedNode: config.NODES[0],
      minimumGasPrice: config.MINIMUM_GAS_PRICE,
      wallet: {
        address: '',
        privateKey: '',
        publicKey: '',
        balance: '',
        nonce: ''
      },
      errorMsg: ''
    },
    actions,
    mutations,
    getters,
    strict: false,
    preserveState: true
  });

export default createStore;
