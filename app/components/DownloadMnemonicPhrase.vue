<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    @close="$emit('close')">
    <div class="mnemonic card">
      <h3 class="font-semibold text-xl mb-8 text-gray-700">
        Write Down Mnemonic Phrase Key
      </h3>
      <p class="text-gray-700 mb-6">
        Write these world down. Do not copy them to your clipboard, or save them anywhere online.
      </p>
      <div class="phrase-element">
        <div
          v-for="(word, index) in seed"
          :key="index"
          class="phrase-element__wrapper">
          <span class="phrase-element__index">
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
      <p class="mt-4 text-gray-700">
        We <strong>CAN NOT</strong> change your password. Please
        <strong>DO NOT FORGET</strong> to save your password, and it is your
        private key. You will need this
        <strong>Password + Mnemonic Phrase</strong> to access your wallet.
      </p>
      <z-alert
        type="danger"
        class="mt-3">
        This is Zilliqa wallet. Do not send any
        ERC-20 ZIL tokens to this wallet.
      </z-alert>
      <div class="flex flex-col mt-0">
        <z-button
          rounded
          class="w-full"
          @click="$emit('print')">
          <p>Print Wallet</p>
        </z-button>
        <z-button
          rounded
          :disabled="!keySaved"
          class="w-full m-0"
          type="default"
          @click="$emit('close')">
          <p>
            I Wrote Down My Mnemonic Phrase
          </p>
        </z-button>
      </div>
    </div>
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
<style lang="scss">
.mnemonic {
  @apply h-full overflow-auto;
  max-height: calc(100vh - 2.5rem);
}
.phrase-element {
  @apply flex flex-row flex-wrap;
  &__wrapper {
    @apply w-1/2 px-2 flex items-center;
  }
  &__index {
    @apply mb-3 pr-4;
    width: 2rem;
  }
  &__input {
    font-family: Menlo, Monaco, Consolas, Courier New, monospace !important;
    font-weight: 500 !important;
    letter-spacing: 0.02em;
  }
}
</style>
