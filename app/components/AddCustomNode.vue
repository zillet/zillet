<template>
  <div class="card w-xl">
    <h3 class="font-bold text-xl mb-4 text-gray-700"> 
      Add Custom Node
    </h3>
    <z-input
      v-model="node.name"
      :hide="false"
      class="mb-4"
      label="Node name"
      placeholder="My Zilliqa Node"/>
    <div class="flex items-center justify-between -mx-3">
      <z-input
        v-model="node.url"
        :hide="false"
        class="mb-4 flex-1 mx-3"
        label="URL"
        placeholder="http://127.0.0.1:4200"/>
      <z-input
        v-model="node.networkId"
        :hide="false"
        class="mb-4 flex-1 mx-3"
        label="Network Id"
        placeholder="1759155 (Optional)"/>
    </div>
    <div class="flex items-center justify-between -mx-3">
      <z-button  
        class="w-full mx-3"
        type="default"
        rounded
        @click="$emit('close')">
        Cancel
      </z-button>
      <z-button  
        class="w-full mx-3 min-w-32"
        rounded
        @click="add">
        Save and Use
      </z-button>
    </div>
   
  </div>
</template>
<script>
export default {
  name: 'AddCustomNode',
  data() {
    return {
      node: {
        name: '',
        url: '',
        networkId: ''
      }
    };
  },
  methods: {
    add() {
      this.$emit('add', this.node);
    }
  }
};
</script>
