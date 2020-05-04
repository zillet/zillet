<template>
  <div class="flex flex-row w-full mobile:flex-col">
    <div class="card w-full overflow-visible">
      <div class="max-w-2xl m-auto text-left">
        <h3 class="font-semibold text-xl mb-4 text-left">
          Send Zilliqa and Tokens
        </h3>
        <div>
          <div class="tracking-wide text-sm font-semibold mb-2">
            Recipient Address
          </div>
          <z-input
            v-model="transaction.address"
            :hide="false"
            class="mb-2"
            :placeholder="`Enter Zilliqa ${selectedNode.id==1? 'Mainnet':'Testnet'} address here`" />
        </div>
        <div class="flex flex-row amount-wrapper items-end">
          <div class="flex flex-col w-3/5">
            <div class="flex flex-row items-center justify-between">
              <div class="tracking-wide text-sm font-semibold mb-2">
                Amount
              </div>
              <div
                class="text-teal-600 text-sm cursor-pointer"
                @click="fullAmount">
                Send All
              </div>
            </div>
            <div class="flex flex-row">
              <div class="relative w-1/3">
                <div
                  v-if="fromTokenDropDown"
                  class="fixed inset-0"
                  @click="fromTokenDropDown = false" />
                <span
                  v-if="!fromTokenDropDown"
                  class="flex flex-row items-center justify-between focus:outline-none bg-white text-gray-900 
                  h-12 border-r-0 bg-gray-100
                  px-4 py-3 rounded rounded-r-none border border-gray-400 w-full drop-down-select"
                  @click="showTokenDropDown">
                  <span
                    class="inline-block mt-0 hover:text-teal-500
                      block text uppercase tracking-wide cursor-pointer
                      font-semibold text-gray-900">
                    <div class="flex flex-column items-center space-between w-16">
                      <img 
                        :src="getImages(fromToken.symbol)" 
                        height="18px" 
                        :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
                        class="rounded"
                        width="18px">
                      <span
                        class="text-gray-800 font-bold pl-2 relative">
                        {{ fromToken.symbol }}
                      </span>
                    </div>
                  </span>
                  <i
                    v-if="!fromTokenDropDown"
                    class="eva eva-arrow-ios-downward-outline ml-1 text-gray-600 text-lg relative right-6" />
                  <i
                    v-else
                    class="eva eva-arrow-ios-upward-outline ml-1 text-gray-600 text-lg relative right-6" />

                </span>
                <z-input
                  v-else
                  ref="typeBox"
                  v-model="tokenSearch"
                  :hide="false"
                  placeholder="Search ..."
                  custom-class="rounded-r-none border-r-0" />
                <transition
                  enter-active-class="transition-all transition-fastest ease-out-quad"
                  leave-active-class="transition-all transition-faster ease-in-quad"
                  enter-class="opacity-0 scale-70"
                  enter-to-class="opacity-100 scale-100"
                  leave-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-70">
                  <div
                    v-if="fromTokenDropDown"
                    class="origin-top-right absolute left-0 w-48 bg-white rounded border shadow-md z-50 overflow-hidden">
                    <div
                      v-for="n in orderBy(tokens,'name')"
                      :key="n.symbol"
                      :class="{'bg-gray-200':fromToken.symbol === n.symbol}"
                      class="flex items-start text-left px-4 py-3 cursor-pointer hover:bg-grey-lightest"
                      @click="fromTokenChange(n, false)">
                      <div class="text-sm flex flex-column justify-between items-cetenr w-full">
                        <div class="flex flex-column items-center">
                          <img 
                            :src="getImages(n.symbol)" 
                            :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
                            height="18px" 
                            class="rounded"
                            width="18px">
                          <p class="text-gray-800 font-bold pl-2">
                            {{ n.symbol }}
                          </p>
                        </div>
                      <!-- <p class="text-gray-700 text-xs font-semibold">
                        {{ n.balance* Math.pow(10, -1*n.decimals) | currency('', 2) }}
                      </p> -->
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
              <div class="w-2/3">
                <z-input
                  v-model.number="transaction.amount"
                  :hide="false"
                  custom-class="rounded-l-none"
                  :valid="validateCryptoAmount"
                  number
                  placeholder="Enter amount here"
                  @focus="cryptoAmountFocus" />
              </div>
            </div>
          </div>
          <div class="amount__approx">
            <i class="eva eva-swap-outline" />
          </div>
          <div class="amount__fiat">
            <z-input
              v-model.number="usdAmount"
              :hide="false"
              :disabled="!(Prices[fromToken.symbol] && Prices[fromToken.symbol].USD)"
              :valid="validateFiatAmount"
              number
              placeholder="Enter amount here"
              @focus="fiatAmountFocus" />
            <span>USD</span>
          </div>
        </div>
        
        <div
          v-if="isAdvance"
          class="gas-form">
          <div class="gas__limit">
            <div class="tracking-wide text-sm font-semibold mb-2">
              Gas Limit
            </div>
            <z-input
              v-model="transaction.gasLimit"
              :hide="false"
              :valid="isNumber(transaction.gasLimit) && transaction.gasLimit > 0"
              number
              placeholder="10" />
          </div>
          <div class="gas__space" />
          <div class="gas__price">
            <div class="tracking-wide text-sm font-semibold mb-2">
              Gas Price (Li)
            </div>
            <z-input
              v-model="transaction.gasPrice"
              :valid="isNumber(transaction.gasPrice) && transaction.gasPrice > 0"
              :hide="false"
              number
              placeholder="1" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <div
              class="text-sm text-left inline-block
          align-middle font-normal  font-semibold">
              Fee:
              <span class="text-md font-bold">
                {{ transactionFee }}
              </span>
              ZIL
            </div>
          </div>
          <div
            @click="isAdvance=!isAdvance">
            <span
              class="text-sm italic text-left inline-block
              align-middle font-normal
              cursor-pointer hover:text-teal-500 font-semibold">
              {{ isAdvance ? '-': '+' }} Advance
            </span>
          </div>
        </div>
        <z-button
          :loading="loading"
          class="w-full"
          rounded
          @click="createTxn">
          {{ 'Send Transaction' }}
        </z-button>
        <p
          v-if="accessType===1006 && loading"
          type="info"
          class="flex items-center justify-center font-semibold text-gray-800">
          <i class="eva eva-loader-outline rotating font-bold mr-2" />
          Confirm transaction on hardware wallet
        </p>
        <div
          v-show="isSigned && isAdvance"
          class="mt-4">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Signed Transaction
          </div>
          <z-textarea
            v-show="isSigned"
            :value="stringifySignedTx"
            readonly
            rows="5"
            class="mb-2" />
          <z-button
            class="w-full"
            rounded>
            Send Transaction
          </z-button>
        </div>
      </div>
    </div>
    <div
      class="flex card w-full ml-4 px-6 mobile:mt-4 mobile:w-full mobile:mb-8 max-w-sm mobile:max-w-full mobile:mx-0"
      style="">
      <TokenBalance @tokenClicked="tokenClicked" />
    </div>
    <z-modal
      :visible="isBroadcast"
      @close="isBroadcast=false">
      <h3 class="font-bold text-xl mb-8 mt-4">
        Transaction Sent
      </h3>
      <div class="flex flex-col px-8">
        <z-icon type="success" />
        <span class="text-base leading-normal font-semibold">
          {{ `0x${tranxId}` }}
        </span>
        <div class="flex flex-row -mx-2">
          <div class="w-1/2 px-2">
            <z-button
              class="w-full mt-8"
              type="default"
              rounded
              @click="isBroadcast=false;">
              Okay, Got it.
            </z-button>
          </div>
          <div class="w-1/2 px-2">
            <a
              :href="openTxOnVb(selectedNode, `0x${tranxId}`)"
              target="_blank"
              rounded
              class="w-full flex-1">
              <z-button
                rounded
                class="mt-8 w-full">
                Check on Explorer
              </z-button>
            </a>
          </div>
        </div>
      </div>
    </z-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import Vue2Filters from 'vue2-filters';
import { BN, Long, validation, units } from '@zilliqa-js/util';
import { getImages, tokenTransfer, openTxOnVb } from '@/utils';

import {
  fromBech32Address,
  isValidChecksumAddress,
  toChecksumAddress,
  sign
} from '@zilliqa-js/crypto';
import { util, Transaction } from '@zilliqa-js/account';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import ZilliqaHW from '@/utils/ledger';
import { isNumber } from '@/utils/validation';
import TokenBalance from '@/components/TokenBalance';
import config from '@/config';
const lookupMap = new Map([
  ['amount', 'Amount should be a number'],
  ['gasLimit', 'Gas Limit should be a number'],
  ['gasPrice', 'Gas Price should be a number']
]);
export default {
  name: 'SendTransactionForm',
  middleware: 'ifKeyExists',
  components: {
    TokenBalance
  },
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      transaction: {
        address: '',
        amount: 0,
        gasLimit: 1,
        gasPrice: config.MINIMUM_GAS_PRICE,
        nonce: ''
      },
      usdAmount: 0,
      multiplier: config.MULTIPLIER,
      isAdvance: false,
      signedTx: {},
      isSigned: false,
      isBroadcast: false,
      tranxId: '',
      loading: false,
      isCryptoAmountFocus: false,
      isFiatAmountFocus: false,
      fromTokenDropDown: false,
      tokenSearch: '',
      fromToken: {
        name: 'Zilliqa',
        symbol: 'ZIL'
      }
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance']),
    ...mapState({
      selectedNode: state => state.selectedNode,
      accessType: state => state.accessType,
      zrc2: state => state.tokenBalances
    }),
    tokens() {
      const tok = [
        {
          name: 'Zilliqa',
          symbol: 'ZIL'
        },
        ...this.zrc2
      ];
      return this.filterBy(tok, this.tokenSearch, 'name', 'symbol');
    },
    validateCryptoAmount() {
      if (!this.isNumber(this.transaction.amount)) {
        return false;
      }
      if (this.fromToken.symbol == 'ZIL') {
        return parseFloat(this.transaction.amount) < this.Balance.zil;
      } else {
        return (
          parseFloat(this.transaction.amount) <
          this.fromToken.balance * Math.pow(10, -1 * this.fromToken.decimals)
        );
      }
    },
    validateFiatAmount() {
      try {
        if (!this.isNumber(this.usdAmount)) {
          return false;
        }
        if (this.fromToken.symbol == 'ZIL') {
          return parseFloat(this.usdAmount) < this.Balance.usd;
        } else {
          try {
            return (
              parseFloat(this.usdAmount) <
              (this.fromToken.balance *
                Math.pow(10, -1 * this.fromToken.decimals)) /
                this.Prices[this.fromToken.symbol].USD
            );
          } catch (error) {
            console.error(`No USD price avl for ${this.fromToken.symbol}`);
            console.log(error);
            return true;
          }
        }
      } catch (error) {
        console.error(error);
        return true;
      }
    },
    transactionFee() {
      const fee =
        this.transaction.gasLimit *
        this.transaction.gasPrice *
        Math.pow(10, -6); // in Li
      return parseFloat(fee.toFixed(4));
    },
    stringifySignedTx() {
      return JSON.stringify(this.signedTx);
    }
  },
  watch: {
    usdAmount: {
      handler(value) {
        if (this.isFiatAmountFocus) {
          try {
            this.transaction.amount = (
              value / this.Prices[this.fromToken.symbol].USD
            ).toFixed(4);
          } catch (error) {}
        }
      }
    },
    'transaction.amount': {
      handler(value) {
        if (this.isCryptoAmountFocus) {
          try {
            this.usdAmount = (
              value * this.Prices[this.fromToken.symbol].USD
            ).toFixed(2);
          } catch (error) {
            this.usdAmount = 0;
          }
        }
      }
    }
  },
  async beforeMount() {
    try {
      const minGasPrice = await this.$zillet.blockchain.getMinimumGasPrice();
      this.transaction.gasPrice = units.fromQa(
        new BN(minGasPrice.result),
        'li'
      );
    } catch (error) {
      this.$notify({
        message: `Something went wrong ${error}`,
        type: 'danger'
      });
    }
  },
  methods: {
    ...mapActions(['sendTransaction', 'fetchBalance']),
    ...mapMutations(['updateBalance', 'saveTxn']),
    isNumber: isNumber,
    getImages,
    openTxOnVb,
    normaliseAddress(address) {
      if (validation.isBech32(address)) {
        this.transaction.base16address = fromBech32Address(address);
        return true;
      }
      if (isValidChecksumAddress(address)) {
        return true;
      }
      return false;
    },
    async updateWallet() {
      let balance = await this.$zillet.blockchain.getBalance(
        this.Account.address
      );
      let localNonce = 0;
      try {
        let accountNonce = JSON.parse(localStorage.getItem('_local_nonces'));
        if (accountNonce[this.Account.address]) {
          if (
            (+new Date() - accountNonce[this.Account.address]['lastUpdated']) /
              (1000 * 60) <
            10
          ) {
            localNonce = accountNonce[this.Account.address]['nonce'];
          }
        }
      } catch (error) {
        console.warn(error);
      }
      if (localNonce > balance.result.nonce) {
        balance.result.nonce = localNonce;
      }
      this.updateBalance(balance.result);
    },
    async txnViaZilPay(tx) {
      try {
        const zilliqa = window.zilPay;
        let {
          type,
          gasPrice,
          VERSION,
          nonce,
          base16address,
          gasLimit,
          amount,
          tokenAmount,
          token,
          contractMethod
        } = tx;
        let via = 'zilpay';
        let sentTx;
        if (type == 'normal') {
          const raw_tx = await zilliqa.transactions.new({
            toAddr: base16address,
            amount: new BN(amount),
            gasPrice,
            gasLimit: Long.fromNumber(gasLimit)
          });
          sentTx = await zilliqa.blockchain.createTransaction(raw_tx);
        } else {
          let { contractAddress } = tx;
          const contract = zilliqa.contracts.at(contractAddress);
          let contractParams = tokenTransfer(
            toChecksumAddress(base16address),
            tokenAmount
          );
          console.log(contractMethod, contractParams);

          if (token.symbol == 'XSGD') {
            contractParams[1].vname = 'value';
          }
          sentTx = await contract.call(contractMethod, contractParams, {
            gasPrice,
            amount: new BN(0),
            gasLimit: Long.fromNumber(gasLimit)
          });
        }
        this.txnDone(sentTx);
        sentTx.type = type;
        sentTx.rawTx = tx;
        sentTx.via = via;
        this.saveTxn(sentTx);
      } catch (error) {
        this.$notify({
          message: error,
          type: 'danger'
        });
      }
    },
    async txnViaMoonlet(tx) {
      const zilliqa = new Zilliqa('', window.moonlet.providers.zilliqa);
      // apply a hack to disable internal ZilliqaJS autosigning feature
      zilliqa.blockchain.signer = zilliqa.contracts.signer = {
        sign: m => m
      };
      let { type, gasPrice, amount, base16address, gasLimit } = tx;
      let sentTx;
      let via = 'moonlet';
      if (type == 'normal') {
        const raw_tx = new Transaction(
          {
            toAddr: base16address,
            amount: new BN(amount),
            gasPrice: new BN(gasPrice),
            gasLimit: Long.fromNumber(gasLimit)
          },
          moonlet.providers.zilliqa
        );
        this.txObserver(raw_tx, via, type);
        await zilliqa.blockchain.createTransaction(raw_tx);
      } else {
        let { contractAddress } = tx;
        const contract = zilliqa.contracts.at(contractAddress);
        let contractParams = tokenTransfer(
          toChecksumAddress(tx.base16address),
          tx.tokenAmount
        );
        if (tx.token.symbol == 'XSGD') {
          contractParams[1].vname = 'value';
        }
        sentTx = await contract.callWithoutConfirm(
          tx.contractMethod,
          contractParams,
          {
            gasPrice,
            amount: new BN(0),
            gasLimit: Long.fromNumber(gasLimit)
          },
          false
        );
        sentTx.TranID = sentTx.id;
        sentTx.Info = 'Transaction broadcasted';
        this.txnDone(sentTx);
        sentTx.via = via;
        sentTx.type = type;
        sentTx.rawTx = tx;
        this.saveTxn(sentTx);
      }
    },
    async txnViaLedger(tx) {
      const transport = await ZilliqaHW.create();
      const ledgerZil = new ZilliqaHW(transport);
      const hwIndex = this.Account.index;
      let {
        type,
        gasPrice,
        VERSION,
        nonce,
        base16address,
        gasLimit,
        amount,
        tokenAmount,
        token,
        contractMethod
      } = tx;
      let txParams = {
        version: VERSION,
        nonce: nonce,
        pubKey: this.Account.publicKey,
        toAddr: base16address,
        amount: new BN(amount),
        gasPrice: new BN(gasPrice),
        gasLimit: Long.fromNumber(gasLimit)
      };
      if (type == 'normal') {
        txParams['data'] = '';
        txParams['code'] = '';
      } else {
        let { contractAddress } = tx;
        tx['toAddr'] = contractAddress;
        const contractParams = {
          _tag: contractMethod,
          params: tokenTransfer(toChecksumAddress(base16address), tokenAmount)
        };
        raw_tx = new Transaction(
          {
            ...txParams,
            toAddr: contractAddress,
            data: JSON.stringify(contractParams)
          },
          false
        );
        const { data, code } = raw_tx;
        txParams[data] = data;
        txParams[code] = code;
        console.log(raw_tx, tx);
      }
      try {
        const signature = await ledgerZil.signTxn(hwIndex, txParams);
        this.signedTx = {
          ...txParams,
          amount: txParams.amount.toString(),
          gasPrice: txParams.gasPrice.toString(),
          gasLimit: txParams.gasLimit.toString(),
          data: '',
          code: '',
          signature
        };
        this.sendTxn();
      } catch (err) {
        this.$notify({
          message: err.message,
          type: 'danger'
        });
        // Add will some notify about user denied transaction.
      }
    },
    async txnViaZillet(tx) {
      try {
        const zilliqa = this.$zillet;
        let {
          type,
          gasPrice,
          VERSION,
          nonce,
          base16address,
          gasLimit,
          amount,
          tokenAmount,
          token,
          contractMethod
        } = tx;
        let via = 'zillet';
        let sentTx;
        if (type == 'normal') {
          const raw_tx = await zilliqa.transactions.new({
            version: VERSION,
            toAddr: base16address,
            nonce: nonce,
            amount: new BN(amount),
            gasPrice,
            gasLimit: Long.fromNumber(gasLimit)
          });
          this.txObserver(raw_tx, via, type);
          await zilliqa.blockchain.createTransaction(raw_tx);
        } else {
          let { contractAddress } = tx;
          const contract = zilliqa.contracts.at(contractAddress);
          let contractParams = tokenTransfer(
            toChecksumAddress(base16address),
            tokenAmount
          );
          if (token.symbol == 'XSGD') {
            contractParams[1].vname = 'value';
          }
          sentTx = await contract.callWithoutConfirm(
            contractMethod,
            contractParams,
            {
              version: VERSION,
              nonce: nonce,
              gasPrice,
              amount: new BN(0),
              gasLimit: Long.fromNumber(gasLimit)
            },
            false
          );
          sentTx.TranID = sentTx.id;
          sentTx.Info = 'Transaction broadcasted';
          this.txnDone(sentTx);
          sentTx.via = via;
          sentTx.type = type;
          sentTx.rawTx = tx;
          this.saveTxn(sentTx);
        }
      } catch (error) {
        this.$notify({
          message: error.message,
          type: 'danger'
        });
      }
    },
    async createTxn() {
      // Applying checks
      if (!this.normaliseAddress(this.transaction.address)) {
        return this.$notify({
          message: `Address format is invalid`,
          type: 'danger'
        });
      }
      this.loading = true;
      const VERSION = this.selectedNode.version;
      let tokenAmount = 0;
      let amount = units.toQa(this.transaction.amount, units.Units.Zil);
      if (this.fromToken.symbol != 'ZIL') {
        tokenAmount = new BN(
          parseInt(
            this.transaction.amount * Math.pow(10, this.fromToken.decimals)
          )
        ).toString();
        amount = new BN(0);
      }
      await this.updateWallet();
      const fee = units.toQa(this.transactionFee, units.Units.Zil);
      const balance = new BN(this.Account.balance);
      const total = amount.add(fee);
      if (total.gt(balance)) {
        return this.$notify({
          message: `Amount+Fee can not be greater than your balance`,
          type: 'danger'
        });
      }
      const gasPrice = units.toQa(this.transaction.gasPrice, units.Units.Li);
      const minGasPrice = await this.$zillet.blockchain.getMinimumGasPrice();
      const isGasSufficient = gasPrice.gte(new BN(minGasPrice.result)); // Checks if your gas price is less than the minimum gas price
      if (!isGasSufficient) {
        return this.$notify({
          message: `Gas price is not sufficient`,
          type: 'danger'
        });
      }
      const nonce = this.transaction.nonce
        ? this.transaction.nonce
        : this.Account.nonce + 1;

      let tx = {
        ...this.transaction,
        amount,
        nonce,
        tokenAmount,
        gasPrice,
        VERSION,
        token: this.fromToken
      };
      if (this.fromToken.symbol.toLowerCase() == 'zil') {
        tx.type = 'normal';
      } else {
        tx.type = 'contract';
        tx.contractAddress = this.getContractAddress(this.fromToken);
        if (this.fromToken.symbol.toLowerCase() == 'xsgd') {
          tx.contractMethod = 'proxyTransfer';
        } else {
          tx.contractMethod = 'Transfer';
        }
      }
      // Making transactions
      if (this.accessType === 1004) {
        await this.txnViaZilPay(tx);
      } else if (this.accessType === 1005) {
        await this.txnViaMoonlet(tx);
      } else if (this.accessType === 1006) {
        await this.txnViaLedger(tx);
      } else {
        await this.txnViaZillet(tx);
      }
      if (tx.type === 'contract') {
        await this.fetchBalance();
      }
      this.loading = false;
    },
    async sendTxn() {
      try {
        this.loading = true;
        const { result } = await this.sendTransaction(this.signedTx);
        console.log(result);
        this.txnDone(result);
      } catch (error) {
        this.loading = false;
        return this.$notify({
          message: `Something went wrong${JSON.stringify(error)}`,
          type: 'danger'
        });
      }
    },
    txnDone(result) {
      this.loading = false;
      this.transaction = {
        ...this.transaction,
        ...{
          address: '',
          amount: '',
          nonce: ''
        }
      };
      if ('Error' in result) {
        return this.$notify({
          message: result.Error,
          type: 'danger'
        });
      } else {
        this.isSigned = false;
        this.signedTx = {};
        this.isBroadcast = true;
        this.tranxId = result.TranID;
        return this.$notify({
          message: result.Info,
          type: 'success'
        });
      }
    },
    txObserver(raw_tx, via, type) {
      raw_tx.observed().on('track', trackInfo => {
        if (trackInfo.attempt === 0) {
          raw_tx.via = via;
          raw_tx.TranID = trackInfo.txHash;
          raw_tx.amount = raw_tx.amount.toString(10);
          raw_tx.gasLimit = raw_tx.gasLimit.toString(10);
          raw_tx.gasPrice = raw_tx.gasPrice.toString(10);
          raw_tx.Info = 'Transaction broadcasted';
          this.txnDone(raw_tx);
          this.saveTxn(raw_tx);
        }
      });
    },
    fullAmount() {
      if (this.fromToken.symbol == 'ZIL') {
        const balance = this.Balance.zil;
        const fee = this.transactionFee;
        const amount = parseFloat((balance - fee).toPrecision(4));
        if (amount > 0) {
          this.transaction.amount = Number(amount);
        } else {
          this.transaction.amount = 0;
          this.usdAmount = 0;
          this.$notify({
            message: 'Your balance seems low',
            type: 'danger'
          });
        }
      } else {
        const balance = parseFloat(
          this.fromToken.balance * Math.pow(10, -1 * this.fromToken.decimals)
        ).toPrecision(4);
        this.transaction.amount = Number(balance);
      }
      try {
        this.usdAmount = (
          this.transaction.amount * this.Prices[this.fromToken.symbol].USD
        ).toFixed(2);
      } catch (error) {
        this.usdAmount = 0;
      }
    },
    cryptoAmountFocus(test) {
      this.isCryptoAmountFocus = true;
      this.isFiatAmountFocus = false;
    },
    fiatAmountFocus() {
      this.isCryptoAmountFocus = false;
      this.isFiatAmountFocus = true;
    },
    fromTokenChange(token) {
      this.fromToken = token;
      if (this.fromToken.symbol != 'ZIL') {
        this.transaction.gasLimit = 10000;
      }
      this.fromTokenDropDown = false;
    },
    contractBySymbol(symbol) {
      return this.tokens.find(element => {
        return element.symbol == symbol;
      });
    },
    getContractAddress(token) {
      let contractAddress;
      const networkType = this.selectedNode.id == 1 ? 'mainet' : 'testnet';
      if (networkType == 'mainet') {
        contractAddress = token.address;
      } else {
        contractAddress = token.testnetAddress;
      }
      return contractAddress;
    },
    tokenClicked(token) {
      this.fromTokenChange(token);
      this.fullAmount();
    },
    showTokenDropDown() {
      this.fromTokenDropDown = true;
      // const t = this;
      // setTimeout(() => {
      //   console.log(t.$refs.typeBox);
      // }, 10);
    }
  }
};
</script>
<style lang="scss" scoped>
.amount-wrapper {
  @apply flex flex-col w-full;
  .label {
    @apply flex flex-row;
    @include mobile {
      @apply justify-between;
    }
    &__btn {
      @apply text-teal-600 text-sm cursor-pointer;
      margin-left: 15.3rem;
    }
  }
  .amount-form {
    @apply flex flex-row w-full;
  }
  .amount__crypto,
  .amount__fiat {
    @apply flex-1 relative;
    span {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      @apply leading-normal font-semibold text-gray-600;
    }
  }
  .amount__approx {
    width: 3rem;
    height: 3rem;
    @apply flex items-center justify-center mb-3 text-lg font-semibold;
  }
}
.gas-form {
  @apply flex flex-row w-full;
}
.gas__price,
.gas__limit {
  @apply flex-1 relative;
}
.gas__space {
  width: 3rem;
}
.drop-down-select {
  @include no-select;
}
</style>
