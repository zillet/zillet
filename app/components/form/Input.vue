<template>
  <div class="flex flex-wrap mb-1 justify-center">
    <div class="w-full my-auto text-left">
      <label
        v-if="label"
        class="block uppercase tracking-wide text-grey-darker text-sm font-bold mb-4"
        for="address">
        {{ label }}
      </label>
      <div class="flex flex-wrap items-stretch w-full relative">
        <input
          :value="value"
          :type="`${isVisible || !hide ? 'text': 'password'}`"
          v-bind="$attrs"
          :class="{'rounded-r-none': hide, 'focus:border-red': !valid, 'focus:border-green': valid && value}"
          class="appearance-none flex-shrink flex-grow flex-auto
            leading-normal w-px flex-1 h-12
            relative bg-grey-lighter
            text-grey-darkest border border-grey-lighter
            rounded py-3 px-4 mb-3 leading-tight
            focus:outline-none focus:bg-white focus:border-grey"
          @input="$emit('input', $event.target.value)"
        >
        <div
          v-if="hide"
          class="flex -mr-px">
          <button
            class="flex items-center leading-normal
            bg-white rounded rounded-l-none h-12 px-3
            border border-grey-lighter text-grey-dark text-sm"
            @click="isVisible=!isVisible">
            <img
              v-if="!isVisible"
              src="@/assets/icons/visible.svg"
              height="24"
              width="24" >
            <img
              v-else
              src="@/assets/icons/invisible.svg"
              height="24"
              width="24" >
          </button>
        </div>
        <slot/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZInput',
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
    hide: {
      type: Boolean,
      default: true
    },
    notification: {
      type: Object,
      default() {
        return {
          error: false,
          text: ''
        };
      }
    }
  },
  data() {
    return {
      isVisible: false
    };
  }
};
</script>
