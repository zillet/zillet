import * as util from '@zilliqa-js/util';
import * as crypto from '@zilliqa-js/crypto';
import * as account from '@zilliqa-js/account';
import * as validation from '@/utils/validation';

export default ({}, inject) => {
  inject('zil', {
    util,
    crypto,
    account
  });
  inject('validation', validation);
};
