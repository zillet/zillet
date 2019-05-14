<template>
  <button
    :class="[{
      'button--loading': loading || $attrs.disabled,
      'button--rounded': rounded,
    }, `button--${type}`, `button--${size}`]"
    v-bind="$attrs"
    :disabled="loading"
    class="button"
    type="button"
    v-on="$listeners">
    <i
      v-if="loading"
      class="eva eva-loader-outline rotating text-2xl" />
    <slot v-else />
  </button>
</template>
<script>
export default {
  name: 'ZButton',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'medium'
    },
    rounded: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss">
.button {
  @apply font-semibold text-white flex items-center justify-center m-auto;
  @include transition;

  &:hover {
    @apply shadow-md;
    @include transition;
  }

  &--small {
    @apply px-8 py-2 my-0;
    @apply text-sm font-semibold;
  }

  &--medium {
    @apply px-12 py-3 my-4;
  }

  &--large {
    @apply px-20 py-6 my-4;
  }

  &--default {
    @apply border text-gray-800;

    &:hover {
      box-shadow: none;
    }
  }

  &--rounded {
    @apply rounded;
  }

  &--loading {
    @apply cursor-not-allowed opacity-75;
  }

  &--primary {
    @apply bg-primary;

    &:hover {
      @apply bg-teal-500;
    }
  }

  &--danger {
    @apply bg-red-600 text-white;
    @include transition;

    &:hover {
      @include transition;
      @apply bg-red-700;
    }
  }

  &--danger {
    @apply bg-green-600 text-white;
    @include transition;

    &:hover {
      @apply bg-green-700;
      @include transition;
    }
  }

  &--warning {
    @apply bg-yellow-600 text-white;
    @include transition;

    &:hover {
      @apply bg-yellow-700;
      @include transition;
    }
  }

  &[type='button']:disabled {
    cursor: not-allowed;

    &:hover {
      box-shadow: none;
    }
  }
}
</style>
