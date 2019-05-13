<template>
  <div class="access-wallet">
    <div class="access-wallet__header">
      <h3>How would you like to access your wallet?</h3>
    </div>
    <div class="access-wallet__methods">
      <div
        v-for="method in accessMethods"
        :key="method.id"
        :class="{'access-wallet__method-btn--disabled': !method.allowed}"
        class="access-wallet__method-btn">
        <div class="access-wallet__method-btn__title">
          <img
            :src="getImg(method.img)">
          <span>{{ method.title }}</span>
        </div>
        <div class="access-wallet__method-btn__body">
          <span>{{ method.body }}</span>
        </div>
        <div class="access-wallet__method-btn__footer">
          <z-button
            :disabled="!method.allowed"
            :type="method.allowed ? 'primary': 'default'"
            size="small"
            rounded
            class="access-wallet__button"
            @click="selectMethod(method)">
            {{ method.buttonText }}
          </z-button>
          <!-- <i
              class="eva eva-question-mark-circle-outline"
              data-balloon="Whats up!"
              data-balloon-pos="right"/>
            <i class="eva eva-question-mark-circle-outline"/> -->
        </div>
      </div>
    </div>
    <div class="helpful-articles">
      <h3 class="font-semibold mr-4">
        Helpful articles:
      </h3>
      <a
        class="text-teal-600"
        href="//support.zillet.io/security/avoid-phishing-and-scams"
        target="_blank">
        15 Simple tips to avoid Phishing and Scams
      </a>
      &nbsp;
      and
      &nbsp;
      <a
        class="text-teal-600"
        href="//support.zillet.io/getting-started/how-to-access-your-wallet"
        target="_blank">
        How to access your Wallet
      </a>
    </div>
    <p class="text-gray-800">
      <code>Zillet.io</code> does not hold your keys for you. We cannot access accounts,
      recover keys, reset passwords, nor reverse transactions. Protect your keys &
      always check that you are on correct URL.
      <span class="font-semibold">You are responsible for your security</span>.
    </p>
    <p class="text-gray-700 mt-8">
      Do not have a wallet?
      <nuxt-link
        :to="{name: 'create'}"
        class="text-teal-500 font-semibold">
        Create A New Wallet
      </nuxt-link>
    </p>
  </div>
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
  max-width: 700px;
  margin: auto;
  &__header {
    @apply mb-8;
    h3 {
      @apply font-bold text-2xl mt-4 text-gray-800;
    }
    p {
      @apply text-base;
    }
  }
  &__methods {
    @apply flex items-center justify-center flex-wrap flex-row -mx-3 mb-4;
    margin: auto;
  }
  &__method-btn {
    @apply rounded overflow-hidden bg-white cursor-pointer mx-3 mb-8;
    width: 300px;
    min-height: 100px;
    @include transition;
    &:not(&--disabled) {
      @apply border rounded;
      // &:hover {
      //   @apply shadow-lg;
      //   @include transition;
      // }
    }
    &__title {
      @apply flex items-center justify-center p-4 flex-row;
      img {
        height: 2rem;
        width: 2rem;
      }
      span {
        @apply pl-2 font-semibold text-xl text-gray-800;
      }
    }
    &__body {
      @apply px-12 text-gray-800 pb-4;
      font-size: 0.9rem;
    }
    &__footer {
      @apply px-2 text-gray-700 pb-4;
      i {
        @apply text-xl;
      }
    }
    &--disabled {
      @apply opacity-75 cursor-not-allowed;
      @apply border rounded;
    }
  }
  &__button {
    min-width: 13rem;
  }
}
.helpful-articles {
  @apply flex justify-center mb-6 text-sm;
  @include mobile {
    @apply flex-col;
  }
}
</style>
