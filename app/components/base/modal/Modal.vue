<template>
  <div 
    v-if="showModal" 
    class="fixed inset-0 flex items-center justify-center">
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
        @click="$emit('close')">
        <div class="absolute inset-0 bg-black opacity-25"/>
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
        class="relative">
        <slot/>
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
    }
  }
};
</script>
<style lang="scss" scoped>
.origin-top-right {
  transform-origin: top right;
}
.transition-all {
  transition-property: all;
}
.transition-fastest {
  transition-duration: 50ms;
}
.transition-faster {
  transition-duration: 100ms;
}
.transition-fast {
  transition-duration: 150ms;
}
.transition-medium {
  transition-duration: 200ms;
}
.ease-out-quad {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.ease-in-quad {
  transition-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
}
.scale-70 {
  transform: scale(0.7);
}
.scale-100 {
  transform: scale(1);
}
</style>
