<template>
  <div class="overflow-hidden relative w-full mb-6">
    <button 
      :class="{
        'bg-primary hover:bg-teal-500 text-white ': !name, 
        'border-gray-400-dark text-gray-800 border': name,
        'rounded': rounded
      }"
      class="w-full hover:shadow-md 
            font-bold py-3 px-8">
      <span class="ml-2">{{ name ? name : 'Select wallet file' }}</span>
    </button>
    <input 
      v-bind="$attrs" 
      class="cursor-pointer absolute block w-full py-3 px-8 opacity-0 right-0 top-0"
      type="file" 
      name="jsonImportFile" 
      v-on="$listeners">
  </div>
</template>
<script>
export default {
  name: 'ZUpload',
  props: {
    name: {
      type: String,
      default: ''
    },
    rounded: {
      type: Boolean,
      default: false
    }
  }
};
</script>
