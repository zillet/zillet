<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <!-- eslint-disable vue/valid-v-on  -->
  <div class="input">
    <label
      v-if="label"
      class="input__label"
      for="address">
      {{ label }}
    </label>
    <div class="input__wrapper">
      <input
        :value="value"
        :type="`${number ? 'number': isVisible || !hide ? 'text': 'password'}`"
        v-bind="$attrs"
        :disabled="disabled"
        :style="customStyle"
        :class="[customClass, {'rounded-r-none': hide, 'focus:border-red-500': !valid, 'focus:border-green-500': valid && value, 'cursor-not-allowed bg-gray-200': disabled}]"
        class="input__field"
        v-on="{...$listeners,input: event => $emit('input', event.target.value)}">
      <div
        v-if="hide"
        class="flex -mr-px">
        <button
          class="input__side-btn"
          @click="isVisible=!isVisible">
          <i
            :class="isVisible ? 'eva-eye-off-outline' : 'eva-eye-outline'"
            class="eva" />
        </button>
      </div>
      <slot />
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
    number: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: [String, Object, Array],
      default: ''
    },
    customStyle: {
      type: [String, Object, Array],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisible: false
    };
  }
};
</script>
<style lang="scss" scoped>
i.eva {
  font-size: 1.6rem;
  @apply text-gray-800;
}
.input {
  @apply w-full my-auto text-left;

  &__label {
    @apply block mb-4;
    @apply uppercase tracking-wide text-gray-700 font-bold;
  }

  &__wrapper {
    @apply flex flex-wrap items-stretch w-full relative;
    input {
      @apply w-full;
    }
  }

  &__field {
    @apply flex-1 h-12 relative py-3 px-4 mb-3 bg-gray-100;
    @apply border border-gray-400 rounded;
    @apply appearance-none leading-normal font-semibold text-gray-800;

    &:focus {
      @apply outline-none bg-white border-gray-400;
    }
  }

  &__side-btn {
    @apply flex items-center bg-white h-12 px-3;
    @apply border border-gray-400 border-l-0 rounded rounded-l-none;
    @apply leading-normal text-gray-500;
  }
}
</style>
