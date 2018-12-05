<template>
  <div class="overflow-hidden relative w-full mb-6">
    <button 
      class="bg-teal hover:bg-teal-dark w-full hover:shadow-md 
            text-white font-bold py-3 px-8">
      <span class="ml-2">{{ name ? name : 'Select wallet file' }}</span>
    </button>
    <input 
      v-bind="$attrs" 
      class="cursor-pointer absolute block w-full py-3 px-8 opacity-0 pin-r pin-t"
      type="file" 
      name="jsonImportFile" 
      v-on="$listeners">
    <p 
      v-if="notification.error" 
      class="text-red text-sm italic mt-4">{{ notification.text }}</p>
  </div>
</template>
<script>
export default {
  name: 'ZInputButton',
  props: {
    name: {
      type: String,
      default: ''
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
  }
};
</script>
