<template>
  <button
    :class="[{
      'button--loading': loading || $attrs.disabled,
      'button--rounded': rounded,
    }, `button--${type}`, `button--${size}`]"
    v-bind="$attrs"
    class="button"
    type="button"
    v-on="$listeners">
    <slot />
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
