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
