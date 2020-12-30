const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { Network } = require('@zilliqa-js/blockchain');
const { TransactionFactory } = require('@zilliqa-js/account');
const { Blockchain } = require('@zilliqa-js/blockchain');
const { Contracts } = require('@zilliqa-js/contract');
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
};
