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
        class="access-wallet__method-btn"
        @click="selectMethod(method)">
        <div class="access-wallet__method-btn__title">
          <img 
            :src="getImg(method.img)">
          <span>{{ method.title }}</span>
        </div>
        <div class="access-wallet__method-btn__body">
          <span>{{ method.body }}</span>
        </div>
        <div class="access-wallet__method-btn__footer">
          <!-- <i 
              class="eva eva-question-mark-circle-outline" 
              data-balloon="Whats up!" 
              data-balloon-pos="right"/>
            <i class="eva eva-question-mark-circle-outline"/> -->
        </div>
      </div>
      <p class="font-semibold text-gray-700 mt-8">Do not have a wallet? 
        <nuxt-link 
          :to="{name: 'create-wallet'}"
          class="text-teal">Create A New Wallet
        </nuxt-link>
      </p>
    </div>
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
@import '@/assets/css/_variables.scss';
@import '@/assets/css/_mixins.scss';
.access-wallet {
  &__header {
    @apply mb-12;
    h3 {
      @apply font-bold text-2xl mb-4 text-gray-700;
    }
    p {
      @apply text-base;
    }
  }
  &__methods {
    @apply flex items-center justify-center flex-wrap flex-row -mx-3 mb-4;
    max-width: 700px;
    margin: auto;
  }
  &__method-btn {
    @apply rounded overflow-hidden bg-white cursor-pointer mx-3 mb-8;
    width: 200px;
    min-height: 202px;
    @include transition;
    &:not(&--disabled) {
      @apply shadow;
      &:hover {
        @apply shadow-lg;
        @include transition;
      }
    }
    // @include mobile {
    //   @apply w-full;
    //   min-heigh: 50px;
    // }
    &__title {
      @apply flex items-center justify-center p-4 flex-col;
      img {
        height: 4.6rem;
        width: 4.6rem;
      }
      span {
        @apply pl-2 font-semibold text-xl text-gray-700;
      }
      // @include mobile {
      //   @apply flex items-start justify-start p-4 flex-row;
      //   img {
      //     height: 4rem;
      //     width: 4rem;
      //   }
      // }
    }
    &__body {
      @apply px-4 text-gray-700 pb-4;
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
}
</style>
