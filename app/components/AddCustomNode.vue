<template>
  <div class="card w-xl pb-4">
    <h3 class="font-semibold text-2xl mb-4 text-gray-700"> 
      Add Custom Node
    </h3>
    <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
      Node name
    </div>
    <z-input
      v-model="node.name"
      :hide="false"
      class="mb-4"
      placeholder="My Zilliqa Node"/>
    <div class="flex items-center justify-between -mx-3">
      <div class="flex flex-1 flex-col mx-3">
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Node Url
        </div>
        <z-input
          v-model="node.url"
          :hide="false"
          class="mb-4 flex-1"
          placeholder="http://127.0.0.1:4200"/>
      </div>
      <div class="flex flex-1 flex-col mx-3">
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Network ID
        </div>
        <z-input
          v-model="node.networkId"
          :hide="false"
          class="mb-4 flex-1"
          placeholder="1759155 (Optional)"/>
      </div>
    </div>
    <div class="flex items-center mt-4 justify-between -mx-3">
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
