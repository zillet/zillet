<template>
  <MainContainer full-width>
    <template v-slot:title>
      How would you like to access your wallet?
      <div class="font-normal text-base mt-4">
        Do not have a wallet?
        <nuxt-link
          :to="{name: 'create'}"
          class="link font-semibold">
          Create A New Wallet
        </nuxt-link>
      </div>
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
      <div class="px-2 text-gray-700">
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
      <div class="flex items-center justify-center text-xs my-2 font-semibold text-gray-700">
        Secure:&nbsp;&nbsp;<div
          v-for="i in 3"
          :key="i"
          class="mx-1 rounded relative"
          :class="securityClasses(i, method.securityLevel)"
          style="height:0.25rem; width:1.3rem;top:1px" />
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
  </MainContainer>
</template>
<script>
import config from '@/config.json';
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
    },
    securityClasses(i, level) {
      if (i <= level) {
        if (level <= 1) {
          return 'bg-red-500';
        } else if (level <= 2) {
          return 'bg-yellow-500';
        }
        return 'bg-green-500';
      } else {
        return 'bg-gray-300';
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
