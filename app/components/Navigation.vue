<template>
  <div class="w-full">
    <nav class="navigation">
      <div class="navigation__logo">
        <nuxt-link :to="{name: 'index'}">
          <img src="@/assets/images/logo.png">
        </nuxt-link>
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
    <div 
      v-if="getAccount.address" 
      class="account-info card px-6 py-4 mb-4">
      <div class="account-info__main">
        <div class="block tracking-wide text-grey-darker font-semibold">
          Address
        </div>
        <div class="account-info__address">
          <jazzicon 
            :diameter="22"
            :address="getAccount.address" 
            class="mt-1 mr-2" /> 
          <h3>
            {{ `0x${getAccount.address}` }}
          </h3>
          <i 
            v-clipboard:copy="'message'" 
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            class="eva eva-copy-outline"/> 
          <i 
            class="eva eva-grid-outline" 
            @click="showQr=true"/> 
        </div>
      </div>
      <div class="account-info__balance">
        <div class="block tracking-wide text-grey-darker font-semibold">
          Balance
        </div>
        <div class="account-info__amount">
          <span class="zil">
            {{ getAccount.balance/Math.pow(10, multiplier) }} ZIL
          </span>
          <span class="usd">
            &nbsp; &asymp; &nbsp; ${{ (getAccount.balance/Math.pow(10, multiplier) )* getPrices.USD }} 
          </span>
          <span
            class="text-xs italic text-left inline-block ml-2
            font-semibold align-middle text-grey-darker font-normal 
            underline cursor-pointer hover:text-teal"
            @click="getBalance(getAccount.address)">
            Refresh
          </span>
        </div>
      </div>
    </div>
    <z-modal 
      :visible="showQr" 
      @close="showQr=false">
      <div class="card w-xl pb-2">
        <h3 class="font-bold text-xl mb-4 text-gray-800"> 
          Your Zilliqa Address
        </h3>
        <div class="flex justify-center items-center flex-col">
          <div class="qr-code">
            <z-qrcode 
              :value="`0x${getAccount.address}`" 
              :options="{ width: 250, color:{ dark: '#303133'}}"/>
          </div>
          <span class="mb-4 font-semibold">{{ `0x${getAccount.address}` }}</span>
          <p class="text-grey-darker text-xs italic font-semibold">Scan QR code to import Address</p>
          <z-button 
            type="default" 
            class="mt-6 w-full" 
            rounded
            @click="showQr=false">Okay, Got it </z-button>
        </div>
      </div>
    </z-modal>
  </div>
</template>
<script>
import NodeDropdown from '@/components/NodeDropdown';
import { mapGetters, mapActions } from 'vuex';
import config from '@/config';
export default {
  name: 'Navigation',
  components: {
    'node-dropdown': NodeDropdown
  },
  data() {
    return {
      showQr: false,
      multiplier: config.MULTIPLIER
    };
  },
  computed: {
    ...mapGetters(['getAccount', 'getPrices'])
  },
  methods: {
    ...mapActions(['clearWallet', 'getBalance']),
    async logout() {
      await this.clearWallet();
      this.$router.push({ name: 'index' });
    },
    onCopy(e) {
      this.$notify({
        icon: 'eva eva-checkmark-circle-outline',
        message: `Address copied successfully `,
        type: 'success'
      });
    },
    onError: function(e) {
      this.$notify({
        icon: 'eva eva-close-circle-outline',
        message: `Failed to copy address`,
        type: 'danger'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.navigation {
  @apply py-6 w-full;
  display: grid;
  grid-template-columns: auto 1fr auto;
  &__logo {
    @apply items-center text-white;
    img {
      max-height: 3.66rem;
    }
  }
  &__account {
    @apply mx-4 px-6 border-r border-l border-gray-600;
    @apply text-white;
  }
  &__actions {
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
.account-info {
  @apply flex flex-row items-start justify-center;
  &__main {
    @apply flex flex-1 flex-col items-start justify-center;
  }
  &__label {
    @apply flex items-center justify-center;
    span {
      @apply ml-4 font-semibold text-lg;
    }
    i {
      @apply ml-4 text-gray-600;
      // background: #eee;
      // border-radius: 50%;
      // padding: 5px;
    }
  }
  &__address {
    @apply flex flex-row items-center justify-start;
    h3 {
      @apply leading-normal font-bold text-lg;
    }
    // font-size: 1.1rem;
    i {
      @apply ml-2 text-gray-800 p-1 text-base border rounded-full cursor-pointer;
      &:hover {
        @apply shadow-md;
      }
    }
  }
  &__balance {
    @apply flex flex-col items-start justify-center;
    min-width: 13rem;
  }
  &__amount {
    @apply flex flex-row my-1 items-center;
    .zil {
      @apply leading-normal font-bold text-lg;
    }
    .usd {
      @apply tracking-wide text-grey-darker font-semibold;
    }
  }
}
.qr-code-btn {
  @apply flex justify-center items-center;
}
</style>
