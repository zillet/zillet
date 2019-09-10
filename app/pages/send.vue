<template>
  <div>
    <h3 class="font-semibold text-2xl mb-4 text-center w-full">
      Send Zilliqa
    </h3>
    <div class="max-w-2xl m-auto text-left">
      <div class="tracking-wide text-sm font-semibold mb-2">
        Recipient Address
      </div>
      <z-input
        v-model="transaction.address"
        :hide="false"
        class="mb-2"
        placeholder="Enter Zilliqa Mainnet address here" />
      <z-alert
        type="danger"
        class="mb-6">
        Do not send funds to ERC-20 ZIL address.
      </z-alert>
      <div class="amount-wrapper">
        <div class="label">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Amount
          </div>
          <div
            class="label__btn"
            @click="fullAmount">
            Send All
          </div>
        </div>
        <div class="amount-form">
          <div class="amount__crypto">
            <z-input
              v-model.number="transaction.amount"
              :hide="false"
              :valid="validateCryptoAmount"
              number
              placeholder="Enter amount here"
              @focus="cryptoAmountFocus" />
            <span>ZIL</span>
          </div>
          <div class="amount__approx">
            <i class="eva eva-swap-outline" />
          </div>
          <div class="amount__fiat">
            <z-input
              v-model.number="usdAmount"
              :hide="false"
              :valid="validateFiatAmount"
              number
              placeholder="Enter amount here"
              @focus="fiatAmountFocus" />
            <span>USD</span>
          </div>
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
      <z-alert
        v-if="accessType===1006"
        type="info"
        class="my-4">
        You will be prompted to confirm and Sign the tranasction in Ledger.
      </z-alert>
      <z-button
        :loading="loading"
        class="w-full"
        rounded
        @click="createTxn">
        {{ 'Send Transaction' }}
      </z-button>
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
              :href="explorerLink(`0x${tranxId}`)"
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
import { BN, Long, validation, units } from '@zilliqa-js/util';
import {
  fromBech32Address,
  isValidChecksumAddress,
  toChecksumAddress,
  sign
} from '@zilliqa-js/crypto';
import { util, Transaction } from '@zilliqa-js/account';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import ZilliqaHW from '@/utils/ledger';
import { isNumber, moonletZilliqa } from '@/utils/validation';
import config from '@/config';
const lookupMap = new Map([
  ['amount', 'Amount should be a number'],
  ['gasLimit', 'Gas Limit should be a number'],
  ['gasPrice', 'Gas Price should be a number']
]);
export default {
  name: 'SendTransactionForm',
  middleware: 'ifKeyExists',
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
      isFiatAmountFocus: false
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance']),
    ...mapState({
      selectedNode: state => state.selectedNode,
      accessType: state => state.accessType
    }),
    validateCryptoAmount() {
      return (
        this.isNumber(this.transaction.amount) &&
        parseFloat(this.transaction.amount) < this.Balance.zil
      );
    },
    validateFiatAmount() {
      return (
        this.isNumber(this.usdAmount) &&
        parseFloat(this.usdAmount) < this.Balance.usd
      );
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
          this.transaction.amount = (value / this.Prices.USD).toFixed(4);
        }
      }
    },
    'transaction.amount': {
      handler(value) {
        if (this.isCryptoAmountFocus) {
          this.usdAmount = (value * this.Prices.USD).toFixed(2);
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
    ...mapActions(['sendTransaction']),
    ...mapMutations(['updateBalance', 'saveTxn']),
    isNumber: isNumber,
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
    async createTxn() {
      if (this.normaliseAddress(this.transaction.address)) {
        const VERSION = this.selectedNode.version;
        const amount = units.toQa(this.transaction.amount, units.Units.Zil);
        const fee = units.toQa(this.transactionFee, units.Units.Zil);
        const balance = new BN(this.Account.balance);
        const total = amount.add(fee);
        if (total.gt(balance)) {
          this.$notify({
            message: `Amount+Fee can not be greater than your balance`,
            type: 'danger'
          });
        } else {
          this.loading = true;
          // Update nonce and balance
          const balance = await this.$zillet.blockchain.getBalance(
            this.Account.address
          );
          this.updateBalance(balance.result);
          // transaction object
          const gasPrice = units.toQa(
            this.transaction.gasPrice,
            units.Units.Li
          ); // in QA
          if (this.accessType === 1004) {
            const zilliqa = window.zilPay;
            try {
              const tx = await zilliqa.blockchain.createTransaction(
                zilliqa.transactions.new({
                  toAddr: this.transaction.base16address,
                  amount: new BN(amount),
                  gasPrice: new BN(gasPrice),
                  gasLimit: Long.fromNumber(this.transaction.gasLimit)
                })
              );
              this.txnDone(tx);
              tx.type = 'zilpay';
              this.saveTxn(tx);
            } catch (error) {
              this.loading = false;
              return this.$notify({
                message: error,
                type: 'danger'
              });
            }
          } else if (this.accessType === 1005) {
            /// Moonlet me
            const zilliqa = new Zilliqa('', window.moonlet.providers.zilliqa);
            // apply a hack to disable internal ZilliqaJS autosigning feature
            zilliqa.blockchain.signer = zilliqa.contracts.signer = {
              sign: m => m
            };
            if (zilliqa) {
              try {
                const tx = new Transaction(
                  {
                    toAddr: this.transaction.base16address,
                    amount: new BN(amount),
                    gasPrice: new BN(gasPrice),
                    gasLimit: Long.fromNumber(this.transaction.gasLimit)
                  },
                  moonlet.providers.zilliqa
                );
                tx.observed().on('track', trackInfo => {
                  if (trackInfo.attempt === 0) {
                    tx.type = 'moonlet';
                    tx.TranID = trackInfo.txHash;
                    tx.amount = tx.amount.toString(10);
                    tx.gasLimit = tx.gasLimit.toString(10);
                    tx.gasPrice = tx.gasPrice.toString(10);
                    tx.Info = 'Transaction broadcasted';
                    this.txnDone(tx);
                    this.saveTxn(tx);
                  }
                });
                const broadcastedTx = await zilliqa.blockchain.createTransaction(
                  tx
                );
              } catch (err) {
                this.loading = false;
                return this.$notify({
                  message: err.message,
                  type: 'danger'
                });
              }
            }
          } else if (this.accessType === 1006) {
            const transport = await ZilliqaHW.create();
            const ledgerZil = new ZilliqaHW(transport);
            const hwIndex = this.Account.index;
            const type = 'CreateTransaction';
            const txParams = {
              version: VERSION,
              nonce: this.Account.nonce + 1,
              pubKey: this.Account.publicKey,
              toAddr: this.transaction.base16address,
              amount: new BN(amount),
              gasPrice: new BN(gasPrice),
              gasLimit: Long.fromNumber(this.transaction.gasLimit),
              data: '',
              code: ''
            };
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
            this.loading = false;
          } else {
            const tx = {
              version: VERSION,
              nonce: this.transaction.nonce
                ? this.transaction.nonce
                : this.Account.nonce + 1,
              pubKey: this.Account.publicKey,
              toAddr: toChecksumAddress(this.transaction.base16address).slice(
                2
              ),
              amount: new BN(amount),
              gasPrice: new BN(gasPrice),
              gasLimit: Long.fromNumber(this.transaction.gasLimit)
            };
            // encoding transaction
            const msg = await util.encodeTransactionProto(tx);
            // signing transasction
            const signature = await sign(
              msg,
              this.Account.privateKey,
              this.Account.publicKey
            );
            // signed transaction object
            this.signedTx = {
              ...tx,
              amount: tx.amount.toString(),
              gasPrice: tx.gasPrice.toString(),
              gasLimit: tx.gasLimit.toString(),
              data: '',
              code: '',
              signature
            };
            this.loading = false;
            this.sendTxn();
          }
        }
      } else {
        this.$notify({
          message: `Address format is invalid`,
          type: 'danger'
        });
      }
    },
    async sendTxn() {
      try {
        this.loading = true;
        const { result } = await this.sendTransaction(this.signedTx);
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
    explorerLink(tx) {
      return this.selectedNode.id === 333
        ? `${this.selectedNode.explorer}${tx}?network=testnet`
        : `${this.selectedNode.explorer}${tx}`;
    },
    fullAmount() {
      const balance = this.Balance.zil;
      const fee = this.transactionFee;
      const amount = parseFloat((balance - fee).toPrecision(12));
      if (amount > 0) {
        this.transaction.amount = amount;
        this.usdAmount = (this.transaction.amount * this.Prices.USD).toFixed(2);
      } else {
        this.transaction.amount = 0;
        this.usdAmount = 0;
        this.$notify({
          message: 'Your balance seems low',
          type: 'danger'
        });
      }
    },
    cryptoAmountFocus(test) {
      this.isCryptoAmountFocus = true;
      this.isFiatAmountFocus = false;
    },
    fiatAmountFocus() {
      this.isCryptoAmountFocus = false;
      this.isFiatAmountFocus = true;
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
      margin-left: 13.3rem;
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
</style>
