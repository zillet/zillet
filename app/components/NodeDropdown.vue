<template>
  <div class="relative">
    <a 
      :class="{'text-teal':showDropDown}" 
      href="#"
      class="nav-link lg:inline-block lg:mt-0 hover:text-teal 
      block mt-4  text-xs text-grey uppercase tracking-wide font-semibold"
      @click.prevent="showDropDown=!showDropDown">

      <div 
        :class="`bg-grey h-2 w-2 mr-2 rounded-full inline-block align-middle ${connectionStatusClass}`"/>
      {{ selected.name }} 
      <i class="caret inline-block align-middle ml-2"/>
    </a>
    <!-- TODO add transition -->
    <transition name="slide-fade">
      <div 
        v-if="showDropDown" 
        class="absolute rounded max-w-sm overflow-hidden shadow-lg bg-white pin-t mt-8 pin-r w-64">
        <div 
          v-for="node in nodes" 
          :key="node.name"
          :class="{'bg-grey-lighter':selected.name === node.name}"
          class="flex items-start text-left px-4 py-2 cursor-pointer hover:bg-grey-lightest"
          @click="changeNode(node)">
          <!-- <img 
              class="w-10 h-10 rounded-full mr-4" 
              src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg" 
              alt="Avatar of Jonathan Reinink"> -->
          <div class="text-sm">
            <p class="text-grey-darkest leading-none font-semibold mb-1"> {{ node.name }}</p>
            <p class="text-grey-darker text-xs"> {{ node.url }}</p>
          </div>
        </div>
        <button 
          class="bg-teal text-white px-4 py-3 w-full" 
          type="button"
          @click="isNewNode=true">
          Add Custom node
        </button>
      </div>
    </transition>
    <z-modal 
      v-if="isNewNode" >
      <add-custom-node 
        @add="changeNode" 
        @close="isNewNode=false" />
    </z-modal> 
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import AddCustomNode from '@/components/AddCustomNode';
export default {
  name: 'ZDropdown',
  components: {
    'add-custom-node': AddCustomNode
  },
  data() {
    return {
      showDropDown: false,
      selected: {},
      connectionStatusClass: '',
      isNewNode: false,
      nodes: [
        {
          name: 'Zilliqa V3',
          url: 'https://testnetv3a-api.aws.zilliqa.com/'
        },
        {
          name: 'Zilliqa',
          url: 'https://api-scilla.zilliqa.com/'
        }
      ]
    };
  },
  beforeMount() {
    try {
      const node = JSON.parse(localStorage.getItem('_selected_node'));
      console.log(
        !this.nodes.find(item => {
          return item.url === node.url;
        })
      );
      if (
        !this.nodes.find(item => {
          return item.url === node.url;
        })
      ) {
        this.nodes.push(node);
      }
      if (node && node.name) this.selected = node;
      else this.selected = this.nodes[0];
    } catch (error) {
      this.selected = this.nodes[0];
    }
    this.changeNode(this.selected);
  },
  methods: {
    ...mapActions(['checkNetworkStatus']),
    async changeNode(node) {
      this.selected = node;
      this.connectionStatusClass = 'bg-yellow-dark';
      this.showDropDown = false;
      if (await this.checkConnection(node.url)) {
        await localStorage.setItem('_selected_node', JSON.stringify(node));
        this.isNewNode = false;
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
<style>
.caret {
  border-top: 0.25rem dashed;
  border-right: 0.25rem solid transparent;
  border-left: 0.25rem solid transparent;
}
</style>
