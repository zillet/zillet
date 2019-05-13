<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    @close="$emit('close')">
    <div class="card">
      <h3 class="font-bold text-2xl mb-8">
        Download Your Wallet
      </h3>
      <p class="mb-2">
        <b>Do not lose it!</b> It cannot be recovered if you lose it.
      </p>
      <p class=" mb-2">
        <b>Do not share it!</b> Your funds will be stolen if you use this file on a phishing site.
      </p>
      <p class="mb-8">
        <b>Make a backup!</b> Secure it like the millions of dollars it may one day be worth.
      </p>
      <z-textarea
        :value="pk"
        type="password"
        readonly />
      <div class="flex -mx-2 mb-2">
        <div class="w-1/2 px-2">
          <z-button
            rounded
            class="w-full"
            @click="$emit('download')">
            <p>Download Keystore</p>
          </z-button>
        </div>
        <div class="w-1/2 px-2">
          <z-button
            rounded
            class="w-full"
            @click="$emit('print')">
            <p>Print Wallet</p>
          </z-button>
        </div>
      </div>
      <div class="flex justify-center helpful-articles">
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
        :disabled="!keySaved"
        class="w-full mt-6"
        type="default"
        rounded
        @click="$emit('close')">
        Okay, I've succesfully saved my key.
      </z-button>
    </div>
  </z-modal>
</template>
<script>
export default {
  name: 'DownloadKeystoreFile',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pk: {
      type: String,
      default: ''
    },
    keySaved: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss">
.helpful-articles {
  @apply flex justify-center mb-6 text-sm;
  @include mobile {
    @apply flex-col;
  }
}
</style>
