<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Enter Your Mnemonic Phrase
    </template>
    <z-textarea
      v-model="mnemonicPhrase"
      :valid="$validation.isMnemonicValid(mnemonicPhrase)"
      placeholder="Enter your Mnemonic phrase here"
      class="mnemonic-textarea"
      label="Mnemonic Phrase"
    />
    <p
      v-if="!expandPasswordOption"
      class="text-left text-teal-600 cursor-pointer
      -mt-2 text-sm italic font-semibold"
      @click="expandPasswordOption=!expandPasswordOption">
      {{ expandPasswordOption ? 'Add password -' :'Add password + (Optional)' }}
    </p>
    <div v-if="expandPasswordOption">
      <z-input
        v-model="passphrase"
        placeholder="Type your password (Optional)"
        label="Type your password (Optional)"
      />
      <z-alert
        type="warning"
        class="my-2">
        This is not the password you set in the Moonlet or ZilPay wallet
      </z-alert>
    </div>
    <z-button
      id="private-key"
      rounded
      class="w-full"
      @click="loadWallet()">
      Load wallet
    </z-button>
  </AccessWalletContainer>
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
      index: 0,
      expandPasswordOption: false
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
.mnemonic-textarea textarea {
  font-family: Menlo, Monaco, Consolas, Courier New, monospace !important;
  letter-spacing: 0.02em;
  &::placeholder {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
  }
}
</style>
