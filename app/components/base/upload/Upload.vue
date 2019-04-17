<template>
  <div class="overflow-hidden relative w-full mb-6">
    <button 
      :class="{
        'bg-teal hover:bg-teal-dark text-white ': !name, 
        'border-grey-dark text-grey-darkest border': name
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
    }
  }
};
</script>
