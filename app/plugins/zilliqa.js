import * as util from '@zilliqa-js/util';
import * as crypto from '@zilliqa-js/crypto';
import * as account from '@zilliqa-js/account';
export default ({}, inject) => {
  inject('zil', {
    util,
    crypto,
    account
  });
};
