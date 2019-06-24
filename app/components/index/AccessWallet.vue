<template>
  <MainContainer full-width>
    <template v-slot:title>
      How would you like to access your wallet?
    </template>
    <div
      v-for="method in accessMethods"
      :key="method.id"
      :class="{'opacity-75 cursor-not-allowed border rounded': !method.allowed}"
      class="access-wallet__method-btn">
      <div class="flex items-center justify-center p-4 flex-row">
        <img
          class="w-8 h-8"
          :src="getImg(method.img)">
        <span class="pl-2 font-semibold text-xl text-gray-800">{{ method.title }}</span>
      </div>
      <div class="px-12 text-gray-800 pb-4 text-sm">
        <span>{{ method.body }}</span>
      </div>
      <div class="px-2 text-gray-700 pb-4">
        <z-button
          :disabled="!method.allowed"
          :type="method.allowed ? 'primary': 'default'"
          size="small"
          rounded
          style="min-width:13rem"
          @click="selectMethod(method)">
          {{ method.buttonText }}
        </z-button>
      </div>
    </div>
    <template v-slot:articles>
      <ZLink
        to="/security/avoid-phishing-and-scams"
        external>
        Simple tips to avoid Phishing and Scams
      </ZLink>
      and
      <ZLink
        to="/getting-started/how-to-access-your-wallet"
        external>
        How to access your Wallet
      </ZLink>
    </template>
    <template v-slot:warning>
      <p>
        <code>Zillet.io</code> does not hold your keys for you. We cannot access accounts,
        recover keys, reset passwords, nor reverse transactions. Protect your keys &
        always check that you are on correct URL.
        <span class="font-semibold">You are responsible for your security</span>.
      </p>
    </template>
    <template v-slot:footer>
      Do not have a wallet?
      <nuxt-link
        :to="{name: 'create'}"
        class="link font-semibold">
        Create A New Wallet
      </nuxt-link>
    </template>
  </MainContainer>
</template>
<script>
import config from '@/config';
export default {
  name: 'AccessWallet',
  data() {
    return {
      accessMethods: config.WALLET_METHODS
    };
  },
  methods: {
    getImg(img) {
      try {
        return require(`@/assets/icons/${img}`);
      } catch (error) {}
    },
    selectMethod(method) {
      if (method.allowed) {
        this.$emit('wallet', method.id);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.access-wallet {
  &__method-btn {
    @apply rounded overflow-hidden bg-white cursor-pointer mx-3 mb-8;
    width: 260px;
    min-height: 100px;
    @include transition;
    &:not(&--disabled) {
      @apply border rounded;
    }
  }
  &__button {
    min-width: 13rem;
  }
}
</style>
