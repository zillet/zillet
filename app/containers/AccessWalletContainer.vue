<template>
  <div>
    <div
      class="flex items-center justify-start cursor-pointer font-sm
      text-base font-semibold text-gray-600 hover:text-gray-800"
      @click="$emit('exit')">
      <i class="eva eva-arrow-back-outline font-bold" />  &nbsp;Other Methods
    </div>
    <div class="text-gray-800 my-4 text-2xl font-semibold">
      <slot name="title" />
    </div>
    <div class="max-w-2xl m-auto">
      <p class="mb-8">
        If you must, please double-check the URL. It should say
        <code>https://zillet.io</code> in your URL bar.
      </p>
      <slot />
      <z-alert
        type="danger"
        class="my-2">
        This is Zilliqa wallet. Do not send any
        ERC-20 ZIL tokens to this wallet.
      </z-alert>
    </div>
    <div class="flex flex-row mt-8 mb-2 justify-center">
      <i
        class="eva eva-shield text-xl mr-2 relative text-gray-700"
        style="top:2px;" />
      We do not store your private key on our servers or transmit it over the network at any time.
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccessWalletContainer'
};
</script>
