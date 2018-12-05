<template>
  <transition name="modal">
    <div 
      class="modal-mask z-50 fixed pin-t pin-r 
        w-full h-full bg-modal table">
      <div class="table-cell align-middle">
        <div 
          class="modal-container w-full 
            min-w-msm max-w-md mx-auto my-0 px-10
            py-8 bg-white rounded shadow-md">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'ZModal'
};
</script>
<style scoped>
.modal-mask {
  transition: opacity 0.3s ease;
}
.modal-container {
  transition: all 0.3s ease;
}
.modal-enter {
  opacity: 0;
}
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
