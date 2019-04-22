<template>
  <div class="card">
    <h3 class="font-bold text-2xl mb-4 text-gray-700 text-center w-full"> 
      Transactions
    </h3>
    <div class="flex w-full">
      <div 
        v-if="!transactions.docs.length" 
        class="spinner">
        <div class="double-bounce1"/>
        <div class="double-bounce2"/>
      </div>
      <div 
        v-else 
        class="w-full">
        <div 
          v-for="txn in transactions.docs" 
          :key="txn.hash"
          class="transaction">
          <div class="transaction__token">
            <cryptoicon 
              symbol="zil" 
              size="24" /> 
            &nbsp;<span class="font-semibold ml-2">Zilliqa</span>
          </div>
          <div class="transaction__status">
            <span 
              :class="txn.direction">
              {{ txnStatus(txn.direction) }}
              <i 
                v-if="txn.direction=='out'" 
                class="eva eva-arrow-upward-outline font-bold ml-1"/>
              <i 
                v-else-if="txn.direction=='in'"
                class="eva eva-arrow-downward-outline font-bold ml-1" />
              <i 
                v-else-if="txn.direction=='self'"
                class="eva eva-radio-button-on-outline ml-1 font-bold" />
            </span>
            <!-- <span></span> -->
            <!-- Zilliqa -->
          </div>
          <div class="transaction__amount">
            <span class="zil">
              {{ txn.direction=='self'? '0' :txn.value* Math.pow(10, -12) }} ZIL
            </span>
            <span 
              v-if="txn.direction!='self'" 
              class="usd">
              &nbsp; &asymp; &nbsp; {{ (txn.value*Math.pow(10, -12) )* getPrices.USD | currency('$', 2) }} 
            </span>
            <!-- <span></span> -->
          </div>
          <div class="transaction__address">
            <span 
              v-clipboard:copy="`0x${txn.direction=='in' ? txn.from:txn.to}`" 
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
              <jazzicon 
                :diameter="18"
                :address="txn.direction=='in' ? txn.from:txn.to" 
                class="mt-1 mr-2" /> 
              {{ txn.direction=='in' ? toAddress(txn.from):toAddress(txn.to) }}
            </span>
          
            <!-- <span></span> -->
            <!-- Zilliqa -->
          </div>
          <!-- {{ txn }} -->

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
export default {
  name: 'Home',
  middleware: 'ifKeyExists',
  data() {
    return {
      requestParams: {
        address: '',
        type: '',
        network: '',
        page: ''
      }
    };
  },
  computed: {
    ...mapGetters(['getAccount', 'getPrices']),
    ...mapState({
      transactions: state => state.viewblockAccount.txs
    })
  },
  beforeMount() {
    this.requestParams.address = this.getAccount.address;
    this.getTransactions(this.requestParams);
  },
  methods: {
    ...mapActions(['getTransactions']),
    txnStatus(dir) {
      if (dir == 'in') {
        return 'Recevied';
      } else if (dir == 'self') {
        return 'Self';
      } else if (dir == 'out') {
        return 'Sent';
      }
    },
    toAddress(address) {
      return `0x${address.substr(0, 4)}...${address.substr(36)}`;
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
.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #cbd5e0;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
.transaction {
  @apply border rounded mb-2 p-4 flex flex-row items-center w-full;
  &__token {
    @apply flex flex-row items-center;
    flex: 1;
    max-width: 20%;
    min-width: 10rem;
  }
  &__status {
    flex: 1;
    max-width: 15%;
    min-width: 9rem;
    @apply flex items-center;
    span {
      @apply flex items-center;
      @apply rounded-lg relative;
      padding: 4px 8px;
      color: rgba(12, 12, 13, 0.6);
      @apply tracking-wide text-gray-700 text-sm font-semibold;
      &.in {
        background: rgba(0, 153, 77, 0.1);
      }
      &.out {
        background: rgba(250, 188, 45, 0.1);
      }
      &.self {
        background: rgba(101, 127, 230, 0.1);
      }
    }
  }
  &__amount {
    flex: 1;
    min-width: 15rem;
    @apply flex flex-row my-1 items-center;
    .zil {
      @apply font-semibold leading-normal text-lg;
    }
    .usd {
      @apply tracking-wide text-grey-darker;
    }
  }
  &__address {
    flex: 1;
    max-width: 15%;
    min-width: 10rem;
    @apply flex justify-end;
    span {
      @apply flex flex-row items-center rounded-lg cursor-pointer;
      @apply bg-gray-200;
      padding: 0px 8px;
      @apply tracking-wide text-gray-700 text-sm font-semibold;
      &:hover {
        @apply bg-gray-300;
      }
    }
  }
}
</style>
