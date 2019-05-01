<template>
  <div
    class="flex flex-row px-4 items-center">
    <input
      v-bind="$attrs"
      type="radio"
      v-on="$listeners">
    {{ $listeners }}
    <label
      :for="$attrs.id"
      class="block text-gray-700 ml-2"
    >
      <slot />
    </label>
  </div>
</template>
<script>
export default {
  name: 'ZRadioButton'
};
</script>
