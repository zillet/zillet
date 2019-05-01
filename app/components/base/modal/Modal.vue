<template>
  <div
    v-if="showModal"
    class="fixed inset-0 flex items-center justify-center z-50">
    <transition
      enter-active-class="transition-all transition-fast ease-out-quad"
      leave-active-class="transition-all transition-medium ease-in-quad"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
      appear
      @before-leave="backdropLeaving = true"
      @after-leave="backdropLeaving = false">
      <div
        v-if="showBackdrop"
        @click="backdropClick">
        <div class="absolute inset-0 bg-black opacity-25" />
      </div>
    </transition>
    <transition
      enter-active-class="transition-all transition-fast ease-out-quad"
      leave-active-class="transition-all transition-medium ease-in-quad"
      enter-class="opacity-0 scale-70"
      enter-to-class="opacity-100 scale-100"
      leave-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-70"
      appear
      @before-leave="cardLeaving = true"
      @after-leave="cardLeaving = false">
      <div
        v-if="showContent"
        class="relative max-w-2xl w-full">
        <slot />
      </div>
    </transition>
  </div>
</template>
<script>
/* copyright (c) adamwathan
 https://github.com/adamwathan/vue-tailwind-examples
*/
export default {
  name: 'ZModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    autoclose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showModal: false,
      showBackdrop: false,
      showContent: false,
      backdropLeaving: false,
      cardLeaving: false
    };
  },
  computed: {
    leaving() {
      return this.backdropLeaving || this.cardLeaving;
    }
  },
  watch: {
    visible: {
      handler: function(value) {
        if (this.visible) {
          this.show();
        } else {
          this.close();
        }
      },
      immediate: true
    },
    leaving(newValue) {
      if (newValue === false) {
        this.showModal = false;
        this.$emit('close');
      }
    }
  },
  methods: {
    show() {
      this.showModal = true;
      this.showBackdrop = true;
      this.showContent = true;
    },
    close() {
      this.showBackdrop = false;
      this.showContent = false;
    },
    backdropClick() {
      if (this.autoclose) {
        this.$emit('close');
      }
    }
  }
};
</script>
