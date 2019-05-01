<template>
  <div class="flex items-center justify-center">
    <div class="relative">
      <div
        v-if="showDropDown"
        class="fixed inset-0"
        @click="showDropDown = false" />
      <span
        class="flex items-center focus:outline-none"
        @click="showDropDown = !showDropDown">
        <div :class="`h-2 w-2 mr-2 rounded-full inline-block align-middle ${connectionStatusClass}`" />
        <span
          class="inline-block mt-0 hover:text-teal-500
          block text-xs uppercase tracking-wide cursor-pointer
          font-semibold text-gray-400">
          {{ selectedNode.name }}
        </span>
        <i class="eva eva-arrow-ios-downward-outline ml-1 text-gray-400 text-lg relative right-10" />
      </span>
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
            v-for="n in nodes"
            :key="n.name"
            :class="{'bg-gray-200':selectedNode.name === n.name}"
            class="flex items-start text-left px-4 py-2 cursor-pointer hover:bg-grey-lightest"
            @click="changeNode(n)">
            <div class="text-sm">
              <p class="text-gray-800 leading-none font-semibold mb-1">
                {{ n.name }}
              </p>
              <p class="text-gray-700 text-xs">
                {{ n.url }}
              </p>
            </div>
          </div>
          <button
            class="bg-primary text-white px-4 py-3 w-full text-sm font-semibold"
            type="button"
            @click="isNewNode=true; showDropDown=false;">
            Add Custom node
          </button>
        </div>
      </transition>
    </div>
    <z-modal
      :visible="isNewNode"
      :autoclose="false"
      @close="isNewNode=false">
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
          placeholder="My Zilliqa Node" />
        <div class="flex items-center justify-between -mx-3">
          <div class="flex flex-1 flex-col mx-3">
            <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
              Node Url
            </div>
            <z-input
              v-model="node.url"
              :hide="false"
              class="mb-4 flex-1"
              placeholder="http://127.0.0.1:4200" />
          </div>
          <div class="flex flex-1 flex-col mx-3">
            <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
              Network ID
            </div>
            <z-input
              v-model="node.networkId"
              :hide="false"
              class="mb-4 flex-1"
              placeholder="1759155 (Optional)" />
          </div>
        </div>
        <div class="flex items-center mt-4 justify-between -mx-3">
          <z-button
            class="w-full mx-3"
            type="default"
            rounded
            @click="isNewNode=false">
            Cancel
          </z-button>
          <z-button
            class="w-full mx-3 min-w-32"
            rounded
            @click="changeNode(node)">
            Save and Use
          </z-button>
        </div>
      </div>
    </z-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import config from '@/config';
export default {
  name: 'ZDropdown',
  data() {
    return {
      showDropDown: false,
      connectionStatusClass: 'bg-gray-400',
      isNewNode: false,
      node: {
        name: '',
        url: '',
        networkId: ''
      }
    };
  },
  computed: {
    ...mapState({
      selectedNode: state => state.selectedNode,
      nodes: state => state.nodes
    })
  },
  async beforeMount() {
    await this.changeNode(this.selectedNode);
    console.log(this.$zilliqa);
  },
  methods: {
    ...mapActions(['checkNetworkStatus', 'selectNode']),
    async changeNode(node) {
      this.connectionStatusClass = 'bg-yellow-400';
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
        this.connectionStatusClass = 'bg-green-500';
        return true;
      } catch (error) {
        this.$notify({
          message: `Unable to connect at ${url}`,
          type: 'danger'
        });
        this.connectionStatusClass = 'bg-red-500';
        return true;
      }
    }
  }
};
</script>
