<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    @close="$emit('close')">
    <DownloadWalletContainer>
      <template v-slot:title>
        Write Down Mnemonic Phrase Key
      </template>
      <div class="phrase-element flex flex-row flex-wrap">
        <div
          v-for="(word, index) in seed"
          :key="index"
          class="w-1/3 px-2 flex items-center">
          <span class="mb-3 pr-4 w-8">
            {{ index+1 }}
          </span>
          <z-input
            type="text"
            :hide="false"
            disabled
            class="phrase-element__input font-thin"
            :value="word" />
        </div>
      </div>
      <p class="my-4">
        We <strong>CAN NOT</strong> change your password. Please
        <strong>DO NOT FORGET</strong> to save your password, and it is your
        private key. You will need this
        <strong>Password + Mnemonic Phrase</strong> to access your wallet.
      </p>
      <z-button
        rounded
        class="w-full mb-6"
        @click="$emit('print')">
        <p>Print Wallet</p>
      </z-button>
      <template v-slot:articles>
        <ZLink
          to="/security/avoid-phishing-and-scams"
          external>
          Simple tips to avoid Phishing and Scams
        </ZLink>
        and
        <ZLink
          to="/getting-started/how-to-access-your-wallet"
          external>
          How to access your Wallet
        </ZLink>
      </template>
      <template v-slot:close-btn>
        <z-button
          :disabled="!keySaved"
          class="w-full mt-6"
          type="default"
          rounded
          @click="$emit('close')">
          I Wrote Down My Mnemonic Phrase
        </z-button>
      </template>
    </DownloadWalletContainer>
  </z-modal>
</template>
<script>
export default {
  name: 'DownloadMnemonicPhrase',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    phrase: {
      type: String,
      default: ''
    },
    keySaved: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    seed() {
      return this.phrase && this.phrase.split(' ');
    }
  }
};
</script>
