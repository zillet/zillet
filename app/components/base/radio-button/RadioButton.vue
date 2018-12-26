<template>
  <div 
    class="flex flex-row px-4" >
    <input 
      v-bind="$attrs" 
      type="radio"
      v-on="$listeners">
    {{ $listeners }}
    <label 
      :for="$attrs.id"
      class="block text-grey-darker ml-2" 
    >
      <slot/>
    </label>
  </div>
</template>
<script>
export default {
  name: 'ZRadioButton'
};
</script>
