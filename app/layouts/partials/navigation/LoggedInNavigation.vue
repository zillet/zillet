<template>
  <div>
    <div class="flex flex-col items-start justify-center w-full card mb-4 p-0">
      <div class="flex flex-row w-full p-4 ">
        <div class="account-info__main">
          <div class="block tracking-wide text-gray-700 text-sm font-semibold">
            Address
          </div>
          <div class="account-info__address">
            <jazzicon
              :diameter="22"
              :address="Account.address"
              class="mt-1 mr-2" />
            <h3>
              {{ `${Account.bech32Address}` }}
              <span
                data-balloon="This is the new bech32 address which derives from the old address and supported by all the exchanges and wallets. You can check your old 20 bytes, base 16 address in Wallet Info page. kindly use this new address to receive funds. Note that your funds are not affected in any way."
                data-balloon-length="xlarge"
                data-balloon-pos="right">
                <i
                  class="eva eva-question-mark-circle-outline relative ml-1 text-gray-700"
                  style="top:3px;" />
              </span>
            </h3>
            <span
              v-clipboard:copy="`${Account.bech32Address}`"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
              class="circle-button">
              <i class="eva eva-copy-outline" />
              Copy
            </span>
            <span
              class="circle-button"
              @click="showQr=true">
              <i
                class="eva eva-grid-outline" />
              Show QR
            </span>
          </div>
        </div>
        <div class="account-info__balance mobile:mr-6">
          <div class="block tracking-wide text-gray-700 text-sm font-semibold">
            Balance
          </div>
          <div class="account-info__amount">
            <span class="zil">
              {{ Balance.zil }} ZIL
            </span>
            <span class="usd">
              &nbsp; &asymp; &nbsp; {{ Balance.usd | currency('$', 2) }}
            </span>
            <span
              class="text-xs italic text-left inline-block ml-2
            font-semibold align-middle text-gray-700 font-normal
            underline cursor-pointer hover:text-teal-500"
              @click="fetchBalance(Account.address)">
              Refresh
            </span>
          </div>
        </div>
      </div>
      <div class="divider" />
      <NavigationTab
        class="mt-4 px-4"
        @tabSelected="changeRoute" />
    </div>
    <z-modal
      :visible="showQr"
      custom-class="px-8"
      @close="showQr=false">
      <h3 class="font-bold text-xl mb-4 text-gray-800">
        Your Zilliqa Address
      </h3>
      <div class="flex justify-center items-center flex-col">
        <div class="qr-code">
          <z-qrcode
            :value="Account.bech32Address"
            :options="{ width: 250, color:{ dark: '#303133'}}" />
        </div>
        <span class="mb-4 font-semibold">{{ Account.bech32Address }}</span>
        <p class="text-gray-700 text-xs italic font-semibold">
          Scan QR code to import Address
        </p>
        <z-button
          type="default"
          class="mt-6 w-full"
          rounded
          @click="showQr=false">
          Okay, Got it
        </z-button>
      </div>
    </z-modal>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import NavigationTab from './NavigationTab';
export default {
  components: {
    NavigationTab
  },
  data() {
    return {
      showQr: false
    };
  },
  computed: {
    ...mapGetters(['Balance', 'LoggedIn', 'Account'])
  },
  watch: {
    'Account.address': {
      handler(newValue, oldValue) {
        this.fetchBalance(newValue);
      }
    }
  },
  mounted() {
    this.fetchBalance();
  },
  methods: {
    ...mapMutations(['updateBalance']),
    async fetchBalance() {
      try {
        this.$nuxt.$loading.start();
        const balance = await this.$zillet.blockchain.getBalance(
          this.Account.address
        );
        if (balance.result) {
          this.updateBalance(balance.result);
        } else {
          this.updateBalance({ balance: '0', nonce: 0 });
        }
        this.$nuxt.$loading.finish();
      } catch (error) {
        console.log(error);
        this.$notify({
          icon: 'eva eva-close-circle-outline',
          message: `Something went wrong ${error}`,
          type: 'danger'
        });
      }
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
    },
    changeRoute(path) {
      this.$router.push({ name: path });
    }
  }
};
</script>

<style lang="scss" scoped>
.account-info {
  @apply flex flex-col items-start justify-center w-full;
  &__top {
    @apply flex flex-row w-full p-4;
    @include mobile {
      @apply flex flex-col;
    }
  }
  &__main {
    @apply flex flex-1 flex-col items-start justify-center;
    white-space: nowrap;
    // overflow: hidden;
    text-overflow: ellipsis;
  }
  &__label {
    @apply flex items-center justify-center;
    span {
      @apply ml-4 font-semibold text-lg;
    }
    i {
      @apply ml-4 text-gray-600;
    }
  }
  &__address {
    @apply flex flex-row items-center justify-start w-full;
    h3 {
      @apply leading-normal font-bold text-lg;
      white-space: nowrap;
      // overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &__balance {
    @apply flex flex-col items-start justify-center pl-4;
    flex: 0 0 15rem; /* do not grow, do not shrink, start at 13rem */
    @include mobile {
      @apply flex-1  pl-0 pt-2;
    }
  }
  &__amount {
    @apply flex flex-row my-1 items-center;
    .zil {
      @apply leading-normal font-bold text-lg;
    }
    .usd {
      @apply tracking-wide text-gray-700 font-semibold;
    }
  }
}
.qr-code-btn {
  @apply flex justify-center items-center;
}

.divider {
  @apply bg-gray-300 w-full;
  height: 1px;
}
.circle-button {
  @apply ml-2 text-gray-800 p-1 text-xs font-semibold border rounded-full cursor-pointer;
  @apply flex items-center justify-center px-2 border-gray-400;
  line-height: 1rem;
  @include no-select;
  @include transition;
  &:hover {
    @apply shadow-md;
    @include transition;
  }
  i {
    @apply text-sm mr-1;
  }
}
</style>
