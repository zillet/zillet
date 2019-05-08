<template>
  <div class="mnemonic">
    <div
      class="mnemonic__head-actions"
      @click="$emit('exit')">
      <i class="eva eva-arrow-back-outline" />  &nbsp;Other Methods
    </div>
    <p class="mnemonic__title">
      Enter Your Mnemonic Phrase
    </p>
    <div class="mnemonic__body">
      <span>
        If you must, please double-check the URL & SSL cert. It should say
        <code>https://zillet.io</code> in your URL bar.
      </span>
      <div
        class="max-w-2xl mx-auto mt-4">
        <z-textarea
          v-model="mnemonicPhrase"
          :valid="$validation.isMnemonicValid(mnemonicPhrase)"
          placeholder="Enter your Mnemonic phrase here"
          class="textarea"
          label="Mnemonic Phrase"
        />
        <z-input
          v-model="passphrase"
          placeholder="Type your password (Optional)"
          label="Type your password (Optional)"
        />
        <z-alert
          type="warning"
          class="my-4">
          This is Zilliqa wallet. Do not send any
          ERC-20 ZIL tokens to this wallet.
        </z-alert>
        <z-button
          id="private-key"
          rounded
          class="w-full"
          @click="loadWallet()">
          Load wallet
        </z-button>
        <div class="flex flex-row mt-8 justify-center">
          <i
            class="eva eva-shield text-xl mr-2 relative text-gray-700"
            style="top:2px;" />
          We do not store your private key on our servers or transmit it over the network at any time.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
const bip39 = require('bip39');
const hdkey = require('hdkey');

export default {
  name: 'PrivateKey',
  data() {
    return {
      loading: false,
      mnemonicPhrase: '',
      passphrase: '',
      index: 0
    };
  },
  methods: {
    ...mapMutations(['importAccount']),
    async loadWallet() {
      if (!this.$validation.isMnemonicValid(this.mnemonicPhrase)) {
        return this.$notify({
          message: `Invalid Mnemonic Phrase`,
          type: 'danger'
        });
      } else {
        if (this.passphrase) {
          const seed = await bip39.mnemonicToSeedSync(
            this.mnemonicPhrase,
            this.passphrase
          );
          const hdKey = hdkey.fromMasterSeed(seed);
          const childKey = hdKey.derive(`m/44'/313'/0'/0/${this.index}`);
          const privateKey = childKey.privateKey.toString('hex');
          this.$zilliqa.wallet.addByPrivateKey(privateKey);
          this.importAccount(this.$zilliqa.wallet.defaultAccount);
          this.$router.push({
            name: this.$route.query.redirect || 'send'
          });
          return this.$notify({
            message: `Wallet loaded successfully.`,
            type: 'success'
          });
        }
        this.$zilliqa.wallet.addByMnemonic(this.mnemonicPhrase, this.index);
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
<style lang="scss">
.mnemonic {
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
  .textarea textarea {
    font-family: Menlo, Monaco, Consolas, Courier New, monospace !important;
    font-weight: 500 !important;
    letter-spacing: 0.02em;
    &::placeholder {
      font-family: 'Source Sans Pro', sans-serif;
      font-weight: 600;
    }
  }
}
</style>
