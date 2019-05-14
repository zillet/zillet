<template>
  <div class="p-8 pb-0 mobile:p-4">
    <div class="font-bold text-2xl mb-8">
      <slot name="title" />
    </div>
    <p class="mb-2">
      <b>Do not lose it!</b> It cannot be recovered if you lose it.
    </p>
    <p class="mb-2">
      <b>Do not share it!</b> Your funds will be stolen if you use this file on a phishing site.
    </p>
    <p class="mb-8">
      <b>Make a backup!</b> Secure it like the millions of dollars it may one day be worth.
    </p>
    <div class="mt-8">
      <slot />
    </div>
    <div
      class="flex justify-center mb-6 text-sm mobile:flex-col">
      <span class="font-semibold mx-2 mobile:mb-2">
        Helpful articles
        <i
          class="eva eva-arrow-forward-outline relative"
          style="top:3px" />
      </span>
      <slot name="articles" />
    </div>
    <slot name="close-btn" />
  </div>
</template>
<script>
export default {
  name: 'DownloadWalletContainer'
};
</script>
