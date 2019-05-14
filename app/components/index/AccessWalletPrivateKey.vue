<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Paste Your Private Key
    </template>
    <z-input
      v-model="privateKey"
      :valid="$zil.util.validation.isPrivateKey(privateKey)"
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
export default {
  name: 'PrivateKey',
  data() {
    return {
      loading: false,
      privateKey: ''
    };
  },
  methods: {
    ...mapMutations(['importAccount']),
    validateKey() {
      if (!this.$zil.util.validation.isPrivateKey(this.privateKey)) {
        return this.$notify({
          message: `Invalid private key`,
          type: 'danger'
        });
      } else {
        this.$zilliqa.wallet.addByPrivateKey(this.privateKey);
        this.importAccount(this.$zilliqa.wallet.defaultAccount);
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
