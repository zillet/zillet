<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    @close="$emit('close')">
    <div class="card">
      <h3 class="font-semibold text-xl mb-8 text-gray-700">
        Download Your Wallet
      </h3>
      <z-textarea
        :value="pk"
        type="password"
        readonly />
      <div class="flex -mx-2 mb-4">
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
      <p class="text-gray-700 mb-2">
        <b>Do not lose it!</b> It cannot be recovered if you lose it.
      </p>
      <p class=" text-gray-700 mb-2">
        <b>Do not share it!</b> Your funds will be stolen if you use this file on a phishing site.
      </p>
      <p class="text-gray-700 mb-2">
        <b>Make a backup!</b> Secure it like the millions of dollars it may one day be worth.
      </p>
      <z-alert
        type="danger"
        class="mt-8">
        This is Zilliqa wallet. Do not send any
        ERC-20 ZIL tokens to this wallet.
      </z-alert>
      <z-button
        :disabled="!keySaved"
        class="w-full mt-8"
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
