import * as util from '@zilliqa-js/util';
import * as crypto from '@zilliqa-js/crypto';
import * as account from '@zilliqa-js/account';
import * as validation from '@/utils/validation';

// const zilliqa = new Zilliqa('http://127.0.0.1:4200/');
export default ({ env }, inject) => {
  inject('zil', {
    util,
    crypto,
    account
  });
  inject('validation', validation);
};
