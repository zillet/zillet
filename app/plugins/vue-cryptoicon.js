import Vue from 'vue';
import Cryptoicon from 'vue-cryptoicon';
import { Btc, Eth, Zil } from 'vue-cryptoicon/src/icons';
Cryptoicon.add([Btc, Eth, Zil]);
Vue.use(Cryptoicon);
