<template>
  <div class="private-key">
    <div 
      class="private-key__head-actions" 
      @click="$emit('exit')">
      <i class="eva eva-arrow-back-outline" />  &nbsp;Other Methods
    </div>
    <p class="private-key__title">
      Paste Your Private Key
    </p>
    <div class="private-key__body">
      <span>
        If you must, please double-check the URL & SSL cert. It should say <code>https://zillet.io</code> in your URL bar.
        <!-- If you must, please  <u>double-check the URL & SSL cert</u>. 
        For additional security, <b>turn off your internet connection</b> prior to accessing/ creating a wallet. -->
      </span>
      <div 
        class="max-w-2xl mx-auto mt-4">
        <z-input
          v-model="privateKey"
          placeholder="Enter your private key here"
          label="Private Key"
        />
        <z-alert 
          type="warning" 
          class="my-4">
          This is Zilliqa wallet. Do not send any 
          ERC-20 ZIL tokens to this wallet.
        </z-alert>
        <z-button 
          rounded 
          class="w-full"
          @click="validateKey()">
          Load wallet
        </z-button>
        <div class="flex flex-row mt-8 justify-center">
          <i 
            class="eva eva-shield text-xl mr-2 relative text-gray-700" 
            style="top:2px;"/>
          We do not store your private key on our servers or transmit it over the network at any time.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: 'PrivateKey',
  data() {
    return {
      loading: false,
      privateKey: ''
    };
  },
  methods: {
    ...mapActions(['importAccount']),
    validateKey() {
      if (!this.$zil.util.validation.isPrivateKey(this.privateKey)) {
        return this.$notify({
          message: `Invalid private key`,
          type: 'danger'
        });
      } else {
        this.importKey(this.privateKey);
      }
    },
    importKey(pk) {
      this.importAccount(pk);
      this.$router.push({
        name: this.$route.query.redirect || 'send'
      });
      return this.$notify({
        message: `Wallet loaded successfully.`,
        type: 'success'
      });
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.private-key {
  &__head-actions {
    @apply flex items-center justify-start cursor-pointer;
    @apply text-base font-semibold text-gray-600;
    &:hover {
      @apply text-gray-700;
    }
    i {
      @apply font-bold;
    }
  }
  &__title {
    @apply text-gray-800 my-4 text-2xl font-semibold;
  }
  &__body {
    @apply max-w-2xl;
    margin: auto;
  }
}
</style>
