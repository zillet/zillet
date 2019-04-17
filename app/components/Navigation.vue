<template>
  <nav class="navigation">
    <div class="navigation__logo">
      <nuxt-link :to="{name: 'index'}">
        <img src="@/assets/images/logo.png">
      </nuxt-link>
    </div>
    <div class="navigation__account">
      Ok
    </div>
    <div class="navigation__actions">
      <node-dropdown/>
      <nuxt-link 
        v-if="$route.name!='create-wallet'"
        :to="{name: 'create-wallet'}"
        class="navigation__link">
        <i class="eva eva-plus-outline font-bold text-base"/>
        &nbsp;Create Wallet 
      </nuxt-link>
      <nuxt-link 
        v-else
        :to="{name: 'index'}"
        class="navigation__link">
        <i class="eva eva-layers-outline font-bold text-base"/>
        &nbsp;Access Wallet
      </nuxt-link>
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
  methods: {
    ...mapActions(['clearWallet']),
    async logout() {
      await this.clearWallet();
      this.$router.push({ name: 'index' });
    }
  }
};
</script>
<style lang="scss" scoped>
.navigation {
  @apply flex py-6 w-full;
  &__logo {
    @apply items-center text-white mr-4;
    flex: 0 0 auto;
    img {
      max-height: 50px;
    }
  }
  &__account {
    flex: 1 1 auto;
  }
  &__actions {
    @apply ml-4;
    flex: 0 0 auto;
    @apply flex flex-col items-end justify-around;
  }
  &__link {
    @apply text-grey-light uppercase font-bold tracking-wide text-base;
    @apply flex items-center justify-end;
    &:hover {
      @apply text-teal;
    }
  }
}
</style>
