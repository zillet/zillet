<template>
  <div class="main-container">
    <div class="mb-8 font-bold text-2xl mt-4">
      <slot name="title" />
    </div>
    <div
      class="flex items-center justify-center
        flex-wrap flex-row max-w-2xl m-auto"
      :class="{'max-w-full' : fullWidth}">
      <slot />
    </div>
    <div class="max-w-2xl m-auto">
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
      <slot name="warning" />
      <div class="text-gray-700 mt-8">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainContainer',
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss">
.main-container {
  a:not(:last-child) {
    @apply pr-2;
  }
}
</style>
