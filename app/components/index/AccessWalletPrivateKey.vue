<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Paste Your Private Key
    </template>
    <z-input
      v-model="privateKey"
      :valid="isPrivateKey(privateKey)"
      placeholder="Enter your private key here"
      label="Private Key"
    />
    <z-button
      id="private-key"
      rounded
      class="w-full"
      @click="validateKey()">
      Load wallet
    </z-button>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { validation } from '@zilliqa-js/util';
const CP = require('@zilliqa-js/crypto');
export default {
  name: 'PrivateKey',
  props: {
    uid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      privateKey: ''
    };
  },
  methods: {
    ...mapMutations(['importAccount', 'saveAccessType']),
    isPrivateKey: validation.isPrivateKey,
    validateKey() {
      if (!this.isPrivateKey(this.privateKey)) {
        return this.$notify({
          message: `Invalid private key`,
          type: 'danger'
        });
      } else {
        const account = CP.getAccountFrom0xPrivateKey(this.privateKey);
        this.$zillet.wallet.addByPrivateKey(account.changed.prv);
        this.importAccount(this.$zillet.wallet.defaultAccount);
        this.saveAccessType(this.uid);
        this.$router.push({
          name: this.$route.query.redirect || 'send'
        });
        return this.$notify({
          message: `Wallet loaded successfully.`,
          type: 'success'
        });
      }
    }
  }
};
</script>
