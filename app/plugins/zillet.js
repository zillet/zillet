const { Zilliqa } = require('@zilliqa-js/zilliqa');

Zilliqa.prototype.setProvider = function(provider) {
  this.wallet.provider = provider;
  this.provider = provider;
  this.blockchain.provider = provider;
  this.network.provider = provider;
  this.transactions.provider = provider;
  this.contracts.provider = provider;
};
Zilliqa.prototype.clearAccount = function() {
  this.wallet.accounts = {};
  this.wallet.defaultAccount = undefined;
};
export default ({}, inject) => {
  let zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
  inject('zillet', zilliqa);
};
