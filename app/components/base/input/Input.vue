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
      <div
        v-if="loading"
        style="right:10px"
        class="absolute flex  mt-3">
        <i
          style="height:1em"
          class="eva eva-loader-outline rotating" />
      </div>
      <div
        v-if="success"
        style="right:10px"
        class="absolute flex mt-3">
        <i
          style="height:1em"
          class="eva eva-checkmark-circle-2-outline text-green-600" />
      </div>
      <div
        v-if="error"
        style="right:10px"
        class="absolute flex  mt-3">
        <i
          style="height:1em"
          class="eva eva-alert-triangle-outline text-red-600" />
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
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    success: {
      type: Boolean,
      default: false
    },
    error: {
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
@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 1.5s linear infinite;
  -moz-animation: rotating 1.5s linear infinite;
  -ms-animation: rotating 1.5s linear infinite;
  -o-animation: rotating 1.5s linear infinite;
  animation: rotating 1.5s linear infinite;
}
</style>
