<template>
  <div
    :class="[{'alert--center': center,},`alert--${type}`]"
    class="alert">
    <i
      :class="{
        'eva-alert-triangle-outline': type==='warning' || type==='danger',
        'eva-close-circle-outline': type==='', // danger
        'eva-checkmark-circle-2-outline': type==='success',
        'eva-info-outline': type==='info',
      }"
      class="eva" />
    <slot />
  </div>
</template>
<script>
export default {
  name: 'ZAlert',
  props: {
    title: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'warning'
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/assets/css/_variables.scss';
i.eva {
  margin-right: 1rem;
  font-size: 1.2rem;
}
.alert {
  @apply py-2 px-8  border border-gray-400 bg-gray-200 rounded;
  @apply font-semibold leading-normal;
  @apply flex items-center justify-start;
  &--center {
    @apply justify-center;
  }
  &--danger {
    background: rgba($color: $danger, $alpha: 0.05);
    border: 1px solid rgba($color: $danger, $alpha: 0.3);
    color: rgba($color: $danger, $alpha: 1);
    i.eva {
      color: rgba($color: $danger, $alpha: 1);
    }
  }
  &--success {
    background: rgba($color: $success, $alpha: 0.05);
    border: 1px solid rgba($color: $success, $alpha: 0.3);
    color: rgba($color: $success, $alpha: 1);
    i.eva {
      color: rgba($color: $success, $alpha: 1);
    }
  }
  &--warning {
    background: rgba($color: $warning, $alpha: 0.05);
    border: 1px solid rgba($color: $warning, $alpha: 0.3);
    color: rgba($color: $warning, $alpha: 1);
    i.eva {
      color: rgba($color: $warning, $alpha: 1);
    }
  }
}
</style>
