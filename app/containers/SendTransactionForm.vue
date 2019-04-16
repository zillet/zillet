<template>
  <div 
    class="card p-12">
    <h3 class="header"> 
      Send Zilliqa
    </h3>
    <z-input
      v-model="transaction.address"
      :hide="false"
      :valid="$zil.util.validation.isAddress(transaction.address)"
      class="mb-4"
      label="To address"
      placeholder="Enter address here"/>
    <!-- <z-alert 
      type="danger" 
      class="mb-6">
      Do not send funds to ERC-20 ZIL address.
    </z-alert> -->
    <z-input
      v-model="transaction.amount"
      :hide="false"
      :valid="validateAmount"
      label="Amount to Send (ZIL)"
      placeholder="Enter amount here">
      <div 
        v-if="isOnline" 
        class="flex -mr-px">
        <button 
          class="flex items-center leading-normal 
                bg-white rounded rounded-l-none h-12 px-3
                font-semibold
                border border-grey-lighter text-grey-darker text-sm"
          @click="fullAmount">
          <p>Entire Amount</p>
        </button>
      </div>
    </z-input>
    <div class="flex items-center justify-between">
      <div class="mb-4" >
        <div
          class="text-sm text-left inline-block
          align-middle text-grey-darker font-normal 
          cursor-pointer hover:text-teal font-semibold">
          Fee: 
          <span class="text-md font-bold">
            {{ transactionFee }}
          </span> 
          ZIL
        </div>
      </div>
      <div 
        class="mb-4" 
        @click="isAdvance=!isAdvance">
        <span
          class="text-sm italic text-left inline-block 
        align-middle text-grey-darker font-normal 
        cursor-pointer hover:text-teal font-semibold"
          @click="getBalance(getAccount.address)">
          {{ isAdvance ? '-': '+' }} Advance
        </span>
      </div>
    </div>
    <div v-if="isAdvance">
      <div class="flex -mx-2">
        <div class="w-1/2 px-2">
          <z-input
            v-model="transaction.gasLimit"
            :hide="false"
            :valid="$validation.isNumber(transaction.gasLimit)"
            class="mb-4"
            label="Gas Limit"
            placeholder="10"/>
        </div>
        <div class="w-1/2 px-2">
          <z-input
            v-model="transaction.gasPrice"
            :valid="$validation.isNumber(transaction.gasPrice)"
            :hide="false"
            class="mb-4"
            label="Gas Price (QA)"
            placeholder="1"/>
        </div>
      </div>
    </div>
    <div v-if="!isOnline">
      <z-input
        v-model="transaction.nonce"
        :hide="false"
        :valid="$validation.isNumber(transaction.nonce)"
        class="mb-4"
        label="Nonce"
        placeholder="Enter nonce here"/>
    </div>
    <z-button 
      v-show="!isSigned" 
      class="w-full"
      @click="sign">
      Generate Transaction
    </z-button>
    <div v-show="isSigned">
      <z-textarea
        v-show="isSigned"
        :value="stringifySignedTx"
        readonly
        rows="5"
        class="mb-4"
        label="Signed Transaction"/>
      <z-button 
        class="w-full"
        @click="send">
        Send Transaction
      </z-button>
    </div>
    <z-modal 
      v-if="isBroadcast" 
      title="Transaction Sent">
      <z-icon type="success" />
      <span class="text-base text-grey-darkest">
        {{ `0x${tranxId}` }}
      </span>
      <a 
        :href="`${selectedNode.explorer}/transactions/${tranxId}`" 
        target="_blank">
        <z-button 
          class="mt-8">
          Check on Explorer
        </z-button>
      </a>
      <z-button 
        class="mt-8"
        @click="isBroadcast=false;">
        Okay, Got it.
      </z-button>
    </z-modal>   
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import config from '@/config';
const lookupMap = new Map([
  ['amount', 'Amount should be a number'],
  ['gasLimit', 'Gas Limit should be a number'],
  ['gasPrice', 'Gas Price should be a number']
]);
export default {
  name: 'SendTransactionForm',
  data() {
    return {
      transaction: {
        address: '',
        amount: '',
        gasLimit: 1,
        gasPrice: 100,
        nonce: ''
      },
      multiplier: config.MULTIPLIER,
      isAdvance: false,
      signedTx: {},
      isSigned: false,
      isBroadcast: false,
      tranxId: ''
    };
  },
  computed: {
    ...mapGetters(['getAccount', 'isOnline']),
    ...mapState({
      gasPrice: state => state.minimumGasPrice,
      selectedNode: state => state.selectedNode
    }),
    stringifySignedTx() {
      return JSON.stringify(this.signedTx);
    },
    validateAmount() {
      return (
        this.$validation.isNumber(this.transaction.amount) &&
        parseFloat(this.transaction.amount) <
          parseFloat(this.getAccount.balance)
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
    gasPrice: {
      handler(value) {
        this.transaction.gasPrice = value;
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getBalance', 'sendTransaction']),
    async sign() {
      const { BN, Long, validation, units } = this.$zil.util;
      const amount = this.transaction.amount * Math.pow(10, this.multiplier);
      if (!validation.isAddress(this.transaction.address)) {
        return this.$notify({
          message: `Reciever's address is invalid`,
          type: 'danger'
        });
      }
      for (const key in this.transaction) {
        if (
          lookupMap.has(key) &&
          (this.transaction[key] == '' ||
            !this.$validation.isNumber(this.transaction[key]))
        ) {
          return this.$notify({
            message: lookupMap.get(key),
            type: 'danger'
          });
        }
      }
      if (this.isOnline) {
        await this.getBalance(this.getAccount.address);
        if (
          Number(amount) + Number(this.transactionFee) >
          Number(this.getAccount.balance)
        ) {
          return this.$notify({
            message: `Amount+Fee can not be greater than your balance`,
            type: 'danger'
          });
        }
      } else {
        this.$notify({
          message: `You are offline, Manual enter nonce else connect to network`,
          type: 'warning'
        });
      }
      const tx = {
        version: this.selectedNode.version,
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
      const msg = this.$zil.account.util.encodeTransactionProto(tx);
      const signature = this.$zil.crypto.sign(
        msg,
        this.getAccount.privateKey,
        this.getAccount.publicKey
      );
      this.signedTx = {
        ...tx,
        amount: tx.amount.toString(),
        gasPrice: tx.gasPrice.toString(),
        gasLimit: tx.gasLimit.toString(),
        data: '',
        code: '',
        signature
      };
      this.isSigned = true;
    },
    async send() {
      try {
        const { result } = await this.sendTransaction(this.signedTx);
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
      } catch (error) {
        return this.$notify({
          message: `Something went wrong${JSON.stringify(error)}`,
          type: 'danger'
        });
      }
    },
    fullAmount() {
      const { units } = this.$zil.util;
      this.transaction.amount =
        this.getAccount.balance * Math.pow(10, -this.multiplier);
    }
  }
};
</script>
<style scoped>
.header {
  @apply mb-6;
}
</style>
