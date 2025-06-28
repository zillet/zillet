<template>
  <div class="w-full">
    <nav class="flex py-6 w-full">
      <div class="items-center text-white flex-none">
        <nuxt-link :to="{name: LoggedIn ? 'send' : 'index'}">
          <img
            src="@/assets/images/icon.png"
            style="max-height:3.66rem">
        </nuxt-link>
      </div>
      <div class="flex-auto" />
      <div class="flex-none flex flex-col items-end justify-around">
        <NodeDropdown />
        <!-- <nuxt-link
          v-if="$route.name!='create' && !LoggedIn"
          :to="{name: 'create'}"
          class="navigation__link">
          <i class="eva eva-plus-outline font-bold text-base" />
          &nbsp;Create Wallet
        </nuxt-link> -->
        <nuxt-link
          v-if="!LoggedIn"
          :to="{name: 'index'}"
          class="navigation__link">
          <i class="eva eva-layers-outline font-bold text-base" />
          &nbsp;Access Wallet
        </nuxt-link>
        <a
          v-else
          class="navigation__link cursor-pointer"
          @click="logout">
          <i class="eva eva-power-outline font-bold text-base" />
          &nbsp;Logout
        </a>
      </div>
    </nav>
    <LoggedInNavigation v-if="LoggedIn" />
  </div>
</template>
<script>
import LoggedInNavigation from './LoggedInNavigation';
import NodeDropdown from './NodeDropdown';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Navigation',
  components: {
    LoggedInNavigation,
    NodeDropdown
  },
  data() {
    return {
      showQr: false
    };
  },
  computed: {
    ...mapGetters(['LoggedIn'])
  },
  methods: {
    ...mapActions(['clearWallet']),
    async logout() {
      this.$router.push({ name: 'index' });
      await this.clearWallet();
    }
  }
};
</script>
<style lang="scss" scoped>
.navigation {
  &__link {
    @apply text-gray-300 uppercase font-bold tracking-wide text-base;
    @apply flex items-center justify-end;
    &:hover {
      @apply text-primary;
    }
  }
}
</style>
