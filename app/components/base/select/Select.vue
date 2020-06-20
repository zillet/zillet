<template>
  <!-- eslint-disable vue/no-parsing-error -->
  <!-- eslint-disable vue/valid-v-on  -->
  <div class="inline-block relative w-full">
    <select
      v-bind="$attrs"
      :class="theme ==='black' ? 'bg-black border-gray-700 text-dark' : 'bg-white border-gray-400'"
      class="block appearance-none w-full border rounded
              px-4 py-2 pr-8 
             leading-tight focus:outline-none focus:shadow-outline"
      v-on="{...$listeners,input: event => $emit('input', event.target.value)}">
      <option
        v-if="showAll"
        disabled
        selected
        value>
        All
      </option>
      <option
        v-for="(d, i) in data"
        :key="i"
        :value="field !=='' ? JSON.stringify(d) : d"
        :selected="selected==d[field]">
        {{ field !=='' ? d[field] : d }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZSelect',
  props: {
    theme: {
      default: 'white',
      type: String
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    field: {
      type: String,
      default: ''
    },
    showAll: {
      type: Boolean,
      default: true
    },
    selected: {
      type: String,
      default: 'all'
    }
  },
  computed: {
    finalData() {
      return [{ category: 'All' }, ...this.data];
    }
  }
};
</script>
