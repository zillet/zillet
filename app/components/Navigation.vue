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
      <div class="text-sm lg:flex-grow nav-bl-wrapper font-semibold">
        <nuxt-link 
          :to="{name: 'index'}"
          :class="{'text-teal':$route.name==='index', 'mr-4': !getAccount.address}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light mr-6">
          New Wallet
        </nuxt-link>
        <nuxt-link 
          v-if="!getAccount.address"
          :to="{name: 'access-wallet'}" 
          :class="{'text-teal':$route.name==='access-wallet'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light border-l pl-6 border-grey-darker">
          Access wallet
        </nuxt-link>
        <nuxt-link 
          v-if="getAccount.address" 
          :to="{name: 'send-transaction'}" 
          :class="{'text-teal':$route.name==='send-transaction'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light mr-6 ">
          Send Zilliqa
        </nuxt-link>
        <nuxt-link 
          v-if="getAccount.address" 
          :to="{name: 'wallet-info'}" 
          :class="{'text-teal':$route.name==='wallet-info'}" 
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light mr-2">
          Wallet Info
        </nuxt-link>
        <a 
          v-if="getAccount.address" 
          href="#"
          class="nav-link lg:inline-block lg:mt-0 hover:text-teal block mt-4 text-grey-light border-l pl-4 border-grey-darker"
          @click="logout">
          Logout
        </a>
      </div>
    </div>
  </nav>
</template>
<script>
import NodeDropdown from '@/components/NodeDropdown';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Navigation',
  components: {
    'node-dropdown': NodeDropdown
  },
  computed: {
    ...mapGetters(['getAccount'])
  },
  watch: {
    '$route.path': {
      handler() {
        // console.log(this.$route.name);
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['clearWallet']),
    async logout() {
      await this.clearWallet();
      this.$router.push({ name: 'index' });
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
