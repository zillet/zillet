<template>
  <div class="flex items-center justify-center">
    <div class="relative">
      <div 
        v-if="showDropDown" 
        class="fixed inset-0" 
        @click="showDropDown = false"/>
      <button 
        class="relative flex items-center focus:outline-none" 
        @click="showDropDown = !showDropDown">
        <div :class="`h-2 w-2 mr-2 rounded-full inline-block align-middle ${connectionStatusClass}`"/>
        <span 
          class="lg:inline-block lg:mt-0 hover:text-teal 
          block mt-4 text-xs uppercase tracking-wide 
          font-semibold text-gray-400">
          {{ selectedNode.name }}
        </span>
        <i class="eva eva-arrow-ios-downward-outline ml-1 text-gray-400 text-lg relative right-10" />
      </button>
      <transition
        enter-active-class="transition-all transition-fastest ease-out-quad"
        leave-active-class="transition-all transition-faster ease-in-quad"
        enter-class="opacity-0 scale-70"
        enter-to-class="opacity-100 scale-100"
        leave-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-70">
        <div 
          v-if="showDropDown" 
          class="origin-top-right absolute right-0 mt-2 w-64 bg-white rounded border shadow-md z-50 overflow-hidden">
          <div 
            v-for="node in nodes" 
            :key="node.name"
            :class="{'bg-grey-lighter':selectedNode.name === node.name}"
            class="flex items-start text-left px-4 py-2 cursor-pointer hover:bg-grey-lightest"
            @click="changeNode(node)">
            <div class="text-sm">
              <p class="text-grey-darkest leading-none font-semibold mb-1"> {{ node.name }}</p>
              <p class="text-grey-darker text-xs"> {{ node.url }}</p>
            </div>
          </div>
          <button 
            class="bg-teal text-white px-4 py-3 w-full text-sm font-semibold" 
            type="button"
            @click="isNewNode=true; showDropDown=false;">
            Add Custom node
          </button>
        </div>
      </transition>
    </div>
    <z-modal 
      :visible="isNewNode" 
      @close="isNewNode=false">
      <add-custom-node 
        @add="changeNode" 
        @close="isNewNode=false" />
    </z-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AddCustomNode from '@/components/AddCustomNode';
import config from '@/config';
export default {
  name: 'ZDropdown',
  components: {
    'add-custom-node': AddCustomNode
  },
  data() {
    return {
      showDropDown: false,
      connectionStatusClass: 'bg-grey',
      isNewNode: false
    };
  },
  computed: {
    ...mapState({
      selectedNode: state => state.selectedNode,
      nodes: state => state.nodes
    })
  },
  beforeMount() {
    this.changeNode(this.selectedNode);
  },
  methods: {
    ...mapActions(['checkNetworkStatus', 'selectNode']),
    async changeNode(node) {
      this.connectionStatusClass = 'bg-yellow-dark';
      this.showDropDown = false;
      if (await this.checkConnection(node.url)) {
        await localStorage.setItem('_selected_node', JSON.stringify(node));
        this.isNewNode = false;
        this.selectNode(node);
      }
    },
    async checkConnection(url) {
      try {
        const { result } = await this.checkNetworkStatus(url);
        this.$notify({
          message: `Node successfully connected to ${result} at ${url}`,
          type: 'success'
        });
        this.connectionStatusClass = 'bg-green';
        return true;
      } catch (error) {
        this.$notify({
          message: `Unable to connect at ${url}`,
          type: 'danger'
        });
        this.connectionStatusClass = 'bg-red';
        return true;
      }
    }
  }
};
</script>
