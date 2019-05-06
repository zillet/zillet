<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <!-- eslint-disable vue/valid-v-on  -->
  <div class="flex flex-wrap mb-1 justify-center">
    <div class="w-full my-auto text-left">
      <label
        v-if="label"
        class="block uppercase tracking-wide text-gray-700 font-bold mb-4"
        for="address">
        {{ label }}
      </label>
      <div class="flex flex-wrap items-stretch w-full relative">
        <textarea
          :value="value"
          v-bind="$attrs"
          :class="{'focus:border-red-500': !valid, 'focus:border-green-500': valid && value}"
          class="appearance-none leading-normal w-px flex-1
            relative bg-gray-200 font-semibold
            text-gray-800 border border-gray-400
            rounded py-3 px-4 mb-3 leading-tight
            focus:outline-none focus:bg-white focus:border-gray-400"
          v-on="{...$listeners,input: event => $emit('input', event.target.value)}"
        />
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZTextarea',
  props: {
    label: {
      type: String,
      default: ''
    },
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: ''
    },
    valid: {
      default: true,
      type: Boolean
    },
    number: {
      type: Boolean,
      default: false
    }
  }
};
</script>
