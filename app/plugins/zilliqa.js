import * as util from '@zilliqa-js/util';
import * as crypto from '@zilliqa-js/crypto';
import * as account from '@zilliqa-js/account';

// const zilliqa = new Zilliqa('http://127.0.0.1:4200/');
export default ({}, inject) => {
  inject('zil', {
    util,
    crypto,
    account
  });
};
