<template>
  <nav class="flex max-w-xl flex-wrap py-6 w-full">
    <div class="flex items-center flex-no-shrink text-white mr-6">
      <nuxt-link :to="{name: 'index'}">
        <img 
          src="@/assets/images/logo.png"
          class="nav-logo">
      </nuxt-link>
    </div>
    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
        <svg 
          class="fill-current h-3 w-3" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>
    <div class="w-full block flex-grow  flex-col lg:flex lg:items-end lg:w-auto">
      <div class="text-sm lg:flex-grow nav-tl-wrapper">
        <node-dropdown/>
      </div>
      <div class="text-sm lg:flex-grow nav-bl-wrapper">
        <nuxt-link 
          :to="{name: 'index'}"
          :class="{'text-teal':$route.name==='index'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light mr-6 ">
          New Wallet
        </nuxt-link>
        <nuxt-link 
          :to="{name: 'send-transaction'}" 
          :class="{'text-teal':$route.name==='send-transaction'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light mr-6 ">
          Send Zilliqa
        </nuxt-link>
        <nuxt-link 
          :to="{name: 'wallet-info'}" 
          :class="{'text-teal':$route.name==='wallet-info'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light ">
          Wallet Info
        </nuxt-link>
        <!-- <nuxt-link 
          :to="{name: 'help'}" 
          :class="{'text-teal':$route.name==='help'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light">
          Help
        </nuxt-link> -->
      </div>
    </div>
  </nav>
</template>
<script>
import NodeDropdown from '@/components/NodeDropdown';
export default {
  name: 'Navigation',
  components: {
    'node-dropdown': NodeDropdown
  },
  watch: {
    '$route.path': {
      handler() {
        // console.log(this.$route.name);
      },
      immediate: true
    }
  }
};
</script>

<style>
.nav-logo {
  max-height: 50px;
}
.nav-link {
  margin-top: 7px !important;
}
</style>
