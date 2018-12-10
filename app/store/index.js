import Vuex from 'vuex';

import * as actions from '@/store/actions';
import * as mutations from '@/store/mutations';
import * as getters from '@/store/getters';

const createStore = () =>
  new Vuex.Store({
    state: {
      loading: false,
      wallet: {
        address: '',
        privateKey: '',
        publicKey: '',
        balance: '',
        nonce: ''
      },
      errorMsg: '',
      prices: {}
    },
    actions,
    mutations,
    getters,
    strict: false,
    preserveState: true
  });

export default createStore;
