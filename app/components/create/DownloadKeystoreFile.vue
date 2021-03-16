<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    @close="$emit('close')">
    <DownloadWalletContainer>
      <template v-slot:title>
        Download Your Wallet
      </template>
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
      <template v-slot:articles>
        <ZLink
          to="/security/avoid-phishing-and-scams"
          external>
          Simple tips to avoid phishing and scams
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
          I Saved My Key
        </z-button>
      </template>
    </DownloadWalletContainer>
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
