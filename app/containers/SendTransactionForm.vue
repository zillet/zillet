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
    <z-input
      v-model="transaction.amount"
      :hide="false"
      :valid="validateAmount"
      class="mb-4"
      label="Amount to Send"
      placeholder="Enter amount here"/>
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
          label="Gas Price"
          placeholder="1"/>
      </div>
    </div>
    <z-button 
      v-show="!isSigned" 
      class="w-full"
      @click="sign">
      Generate Transaction
    </z-button>
    <div v-show="isSigned">
      <z-text-area
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
      v-if="isBroadcast" >
      <z-icon type="success" />
      <span class="text-base text-grey-darkest">
        {{ `0x${tranxId}` }}
      </span>
      <z-button 
        class="mt-8"
        @click="isBroadcast=false;">
        Okay, Got it.
      </z-button>
    </z-modal>   
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
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
        gasLimit: 10,
        gasPrice: 1
      },
      signedTx: {},
      isSigned: false,
      isBroadcast: false,
      tranxId: ''
    };
  },
  computed: {
    ...mapGetters(['getAccount']),
    stringifySignedTx() {
      return JSON.stringify(this.signedTx);
    },
    validateAmount() {
      return (
        this.$validation.isNumber(this.transaction.amount) &&
        parseFloat(this.transaction.amount) <
          parseFloat(this.getAccount.balance)
      );
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
    }
  },
  methods: {
    ...mapActions(['getBalance', 'sendTransaction']),
    async sign() {
      const { BN, Long, validation } = this.$zil.util;
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
            this.$validation.isNumber(this.transaction[key]))
        ) {
          return this.$notify({
            message: lookupMap.get(key),
            type: 'danger'
          });
        }
      }
      await this.getBalance(this.getAccount.address);
      if (this.transaction.amount > this.getAccount.balance) {
        return this.$notify({
          message: `Amount can not be greater than your balance`,
          type: 'danger'
        });
      }
      let address;
      if (this.transaction.address && this.transaction.address.length === 42) {
        address = this.transaction.address.substring(2);
      } else {
        address = this.transaction.address;
      }
      const tx = {
        version: 0,
        nonce: this.getAccount.nonce + 1,
        pubKey: this.getAccount.publicKey,
        toAddr: address,
        amount: new BN(this.transaction.amount),
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
          address: '',
          amount: '',
          gasLimit: 10,
          gasPrice: 1
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
    }
  }
};
</script>
<style scoped>
.header {
  @apply mb-6;
}
</style>
