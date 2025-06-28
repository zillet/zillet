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
      <p
        v-if="!hideTop"
        class="mb-8">
        If you must, please double-check the URL. It should say
        <code>https://app.zillet.io</code> in your URL bar.
      </p>
      <slot />
      <div
        v-if="$slots.articles"
        class="flex justify-center mb-6 text-sm mobile:flex-col">
        <span class="font-semibold mx-2 mobile:mb-2">
          Helpful articles
          <i
            class="eva eva-arrow-forward-outline relative"
            style="top:3px" />
        </span>
        <slot name="articles" />
      </div>
    </div>
    <div class="flex flex-row mt-8 mb-2 justify-center text-base text-gray-700">
      <i
        class="eva eva-shield text-base mr-2 relative "
        style="top:2px;" />
      We do not store your private key on our servers or transmit it over the network at any time.
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccessWalletContainer',
  props: {
    hideTop: {
      type: Boolean,
      default: false
    }
  }
};
</script>
