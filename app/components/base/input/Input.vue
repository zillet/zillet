<template>
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
        :type="`${isVisible || !hide ? 'text': 'password'}`"
        v-bind="$attrs"
        :class="{'rounded-r-none': hide, 'focus:border-red': !valid, 'focus:border-green': valid && value}"
        class="input__field"
        @input="$emit('input', $event.target.value)"
      >
      <div
        v-if="hide"
        class="flex -mr-px">
        <button
          class="input__side-btn"
          @click="isVisible=!isVisible">
          <i 
            :class="isVisible ? 'eva-eye-off-outline' : 'eva-eye-outline'" 
            class="eva"/>
        </button>
      </div>
      <slot/>
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
<style lang="scss" scoped>
i.eva {
  font-size: 1.6rem;
  @apply text-grey-darkest;
}
</style>
