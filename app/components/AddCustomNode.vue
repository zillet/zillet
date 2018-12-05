<template>
  <div>
    <h3 class="header"> 
      Add custom node
    </h3>
    <z-input
      v-model="node.name"
      :hide="false"
      class="mb-4"
      label="Node name"
      placeholder="My Zilliqa Node"/>
    <div class="flex -mx-2">
      <div class="w-2/3 px-2">
        <z-input
          v-model="node.url"
          :hide="false"
          class="mb-4"
          label="URL"
          placeholder="http://127.0.0.1"/>
      </div>
      <div class="w-1/3 px-2">
        <z-input
          v-model="node.port"
          :hide="false"
          class="mb-4"
          label="Port"
          placeholder="4200"/>
      </div>
    </div>
    <z-button  
      class="w-full"
      @click="add">
      Save and Use Custom Node
    </z-button>
    <z-button  
      class="w-full"
      type="default"
      @click="$emit('close')">
      Cancel
    </z-button>
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
        port: ''
      }
    };
  },
  methods: {
    add() {
      let node = {
        name: this.node.name
      };
      if (this.node.port) {
        node.url = `${this.node.url}:${this.node.port}/`;
      } else {
        node.url = `${this.node.url}`;
      }
      this.$emit('add', node);
    }
  }
};
</script>
