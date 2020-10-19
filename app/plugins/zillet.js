const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { Network } = require('@zilliqa-js/blockchain');
const { TransactionFactory } = require('@zilliqa-js/account');
const { Blockchain } = require('@zilliqa-js/blockchain');
const { Contracts } = require('@zilliqa-js/contract');
import Viewblock from '@zilliqa-js/viewblock';
const viewblock = Viewblock({
  apiKey: '74da2e513cb0ce63ad6733f0d09a074b614ca9752a9e8201ab28678814fbc39a'
});
Zilliqa.prototype.setProvider = function(provider) {
  this.blockchain.provider = provider;
  this.wallet.provider = this.blockchain.provider;
  this.blockchain = new Blockchain(this.wallet.provider, this.wallet);
  this.network = new Network(this.wallet.provider, this.wallet);
  this.contracts = new Contracts(this.wallet.provider, this.wallet);
  this.transactions = new TransactionFactory(this.wallet.provider, this.wallet);
};
Zilliqa.prototype.clearAccount = function() {
  this.wallet.accounts = {};
  this.wallet.defaultAccount = undefined;
};
export default ({}, inject) => {
  let zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
  inject('zillet', zilliqa);
  inject('viewblock', viewblock);
};
