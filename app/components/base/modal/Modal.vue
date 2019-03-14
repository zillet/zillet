<template>
  <transition name="modal">
    <div 
      class="modal--mask z-50 fixed pin-t pin-r 
        w-full h-full bg-modal table">
      <div class="table-cell align-middle">
        <div 
          class="modal--container w-full 
            min-w-msm max-w-md mx-auto my-0 
            bg-white rounded shadow-md">
          <div class="modal--header">
            <h3 
              v-if="title && !$slots.header" 
              class="header modal mb-4 tracking-wide"> {{ title }}</h3>
            <slot 
              v-else 
              name="header"/>
          </div>
          <div 
            :class="{'full': !$slots.footer }" 
            class="modal--content">
            <slot />
          </div>
          <div 
            v-if="$slots.footer" 
            class="modal--footer border-t border-grey-light">
            <slot name="footer"/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'ZModal',
  props: {
    title: {
      type: String,
      default: null
    }
  }
};
</script>
<style scoped lang="scss">
.modal {
  &-enter {
    opacity: 0;
  }
  &-leave-active {
    opacity: 0;
  }
  &--mask {
    transition: opacity 0.3s ease;
  }
  &--container {
    transition: all 0.3s ease;
    max-height: 80vh;
    min-height: 300px;
  }
  &--header {
    @apply px-10 pt-8 pb-4;
  }
  &--content {
    @apply px-10 pb-8 pt-4;
    max-height: calc(80vh - 9rem);
    overflow: scroll;
    &.full {
      max-height: calc(80vh - 5rem);
    }
  }
  &--footer {
    @apply px-10 pb-4 pt-4;
  }
}

.modal-enter .modal--container,
.modal-leave-active .modal--container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
