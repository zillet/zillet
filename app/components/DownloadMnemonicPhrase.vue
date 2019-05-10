<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    @close="$emit('close')">
    <div class="mnemonic card">
      <h3 class="font-bold text-2xl mb-8">
        Write Down Mnemonic Phrase Key
      </h3>
      <p class="mb-8">
        We <strong>CAN NOT</strong> change your password. Please
        <strong>DO NOT FORGET</strong> to save your password, and it is your
        private key. You will need this
        <strong>Password + Mnemonic Phrase</strong> to access your wallet.
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

      <div class="flex flex-col mt-0">
        <z-button
          rounded
          class="w-full mb-6"
          @click="$emit('print')">
          <p>Print Wallet</p>
        </z-button>
        <div class="text-left flex justify-center">
          <h3 class="font-semibold mr-4">
            Helpful articles:
          </h3>
          <a
            class="link post"
            href="https://support.zillet.io/security/avoid-phishing-and-scams"
            target="_blank">
            Avoid Phishing And Scams
          </a>
          &nbsp;
          and
          &nbsp;
          <a
            class="link post"
            href="//support.zillet.io/getting-started/how-to-access-your-wallet"
            target="_blank">
            How to Access Your Wallet
          </a>
        </div>
        <z-button
          rounded
          :disabled="!keySaved"
          class="w-full m-0 mt-6"
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
    @apply w-1/3 px-2 flex items-center;
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
