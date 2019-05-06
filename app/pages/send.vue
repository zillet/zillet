<template>
  <div class="w-full card">
    <h3 class="font-semibold text-2xl mb-4 text-gray-700 text-center w-full">
      Send Zilliqa
    </h3>
    <div class="max-w-2xl m-auto text-left">
      <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
        Recipient Address
      </div>
      <z-input
        v-model="transaction.address"
        :hide="false"
        :valid="$zil.util.validation.isAddress(transaction.address)"
        class="mb-2"
        placeholder="Enter Zilliqa Mainnet address here" />
      <z-alert
        type="danger"
        class="mb-6">
        Do not send funds to ERC-20 ZIL address.
      </z-alert>
      <div class="amount-wrapper">
        <div class="label">
          <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
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
          <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
            Gas Limit
          </div>
          <z-input
            v-model="transaction.gasLimit"
            :hide="false"
            :valid="$validation.isNumber(transaction.gasLimit) && transaction.gasLimit > 0"
            number
            placeholder="10" />
        </div>
        <div class="gas__space" />
        <div class="gas__price">
          <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
            Gas Price (Li)
          </div>
          <z-input
            v-model="transaction.gasPrice"
            :valid="$validation.isNumber(transaction.gasPrice) && transaction.gasPrice > 0"
            :hide="false"
            number
            placeholder="1" />
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <div
            class="text-sm text-left inline-block
          align-middle text-gray-700 font-normal  font-semibold">
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
        align-middle text-gray-700 font-normal
        cursor-pointer hover:text-teal-500 font-semibold">
            {{ isAdvance ? '-': '+' }} Advance
          </span>
        </div>
      </div>
      <div v-if="!isOnline">
        <z-input
          v-model="transaction.nonce"
          :hide="false"
          :valid="$validation.isNumber(transaction.nonce)"
          class="mb-4"
          label="Nonce"
          placeholder="Enter nonce here" />
      </div>
      <z-button
        :loading="loading"
        class="w-full"
        rounded
        @click="createTxn">
        {{ 'Send Transaction' }}
      </z-button>
      <!-- <div
        v-show="isSigned && isAdvance"
        class="mt-4">
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
          Signed Transaction
        </div>
        <z-textarea
          v-show="isSigned"
          :value="stringifySignedTx"
          readonly
          rows="5"
          class="mb-2"/>
        <z-button
          class="w-full"
          rounded
          @click="send">
          Send Transaction
        </z-button>
      </div> -->
    </div>
    <z-modal
      :visible="isBroadcast"
      @close="isBroadcast=false">
      <div class="card">
        <h3 class="font-bold text-xl mb-8 text-gray-700">
          Transaction Sent
        </h3>
        <div class="flex flex-col">
          <z-icon type="success" />
          <span class="text-base text-gray-800 leading-normal font-semibold">
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
      </div>
    </z-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
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
    ...mapGetters(['getAccount', 'isOnline', 'getPrices']),
    ...mapState({
      selectedNode: state => state.selectedNode
    }),
    validateCryptoAmount() {
      return (
        this.$validation.isNumber(this.transaction.amount) &&
        parseFloat(this.transaction.amount) <
          parseFloat(this.getAccount.balance) * Math.pow(10, -this.multiplier)
      );
    },
    validateFiatAmount() {
      return (
        this.$validation.isNumber(this.usdAmount) &&
        parseFloat(this.usdAmount) <
          parseFloat(this.getAccount.balance) *
            Math.pow(10, -this.multiplier) *
            this.getPrices.USD
      );
    },
    transactionFee() {
      return +(
        this.transaction.gasLimit *
        this.transaction.gasPrice *
        Math.pow(10, -12)
      ).toFixed(12);
    }
  },
  watch: {
    transaction: {
      handler() {
        if (this.isSigned) {
          this.signedTx = {};
          this.isSigned = false;
        }
      },
      deep: true
    },
    usdAmount: {
      handler(value) {
        if (this.isFiatAmountFocus) {
          this.transaction.amount = (value / this.getPrices.USD).toFixed(4);
        }
      }
    },
    'transaction.amount': {
      handler(value) {
        if (this.isCryptoAmountFocus) {
          this.usdAmount = (value * this.getPrices.USD).toFixed(2);
        }
      }
    }
  },
  async beforeMount() {
    try {
      const minGasPrice = await this.$zilliqa.blockchain.getMinimumGasPrice();
      this.transaction.gasPrice = minGasPrice.result;
    } catch (error) {
      this.$notify({
        message: `Something went wrong ${error}`,
        type: 'danger'
      });
    }
  },
  methods: {
    ...mapActions(['sendTransaction']),
    ...mapMutations(['updateBalance']),
    async createTxn() {
      const { BN, Long, validation, units } = this.$zil.util;
      const VERSION = this.selectedNode.version;
      const amount = units.toQa(
        String(this.transaction.amount),
        units.Units.Zil
      );
      const fee = new BN(
        String(this.transaction.gasLimit * this.transaction.gasPrice)
      );
      const balance = new BN(String(this.getAccount.balance));
      const total = amount.add(fee);
      if (!validation.isAddress(this.transaction.address)) {
        this.$notify({
          message: `Reciever's address is invalid`,
          type: 'danger'
        });
      } else if (total.gt(balance)) {
        this.$notify({
          message: `Amount+Fee can not be greater than your balance`,
          type: 'danger'
        });
      } else {
        this.loading = true;
        // Update nonce and balance
        const balance = await this.$zilliqa.blockchain.getBalance(
          this.getAccount.address
        );
        this.updateBalance(balance.result);
        // transaction object
        const tx = {
          version: VERSION,
          nonce: this.transaction.nonce
            ? this.transaction.nonce
            : this.getAccount.nonce + 1,
          pubKey: this.getAccount.publicKey,
          toAddr: this.$zil.crypto
            .toChecksumAddress(this.transaction.address)
            .slice(2),
          amount: new BN(amount),
          gasPrice: new BN(this.transaction.gasPrice),
          gasLimit: Long.fromNumber(this.transaction.gasLimit)
        };
        // encoding transaction
        const msg = await this.$zil.account.util.encodeTransactionProto(tx);
        // signing transasction
        const signature = await this.$zil.crypto.sign(
          msg,
          this.getAccount.privateKey,
          this.getAccount.publicKey
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
    },
    async sendTxn() {
      try {
        this.loading = true;
        const { result } = await this.sendTransaction(this.signedTx);
        this.transaction = {
          ...this.transaction,
          ...{
            address: '',
            amount: '',
            nonce: ''
          }
        };
        this.loading = false;
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
      } catch (error) {
        this.loading = false;
        return this.$notify({
          message: `Something went wrong${JSON.stringify(error)}`,
          type: 'danger'
        });
      }
    },
    explorerLink(tx) {
      return this.selectedNode.id === 1002
        ? `${this.selectedNode.explorer}${tx}?network=testnet`
        : `${this.selectedNode.explorer}${tx}`;
    },
    fullAmount() {
      const { units } = this.$zil.util;
      this.transaction.amount =
        this.getAccount.balance * Math.pow(10, -this.multiplier);
      this.usdAmount = (
        this.getAccount.balance *
        Math.pow(10, -this.multiplier) *
        this.getPrices.USD
      ).toFixed(2);
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
@import './../assets/css/_variables';
@import './../assets/css/_mixins';
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
