<template>
  <div class="card">
    <h3 class="font-semibold text-2xl mb-8 text-gray-700 text-center w-full">
      Transactions
    </h3>
    <div class="flex w-full">
      <div
        v-if="!transactions.length && loading"
        class="spinner">
        <div class="double-bounce1" />
        <div class="double-bounce2" />
      </div>
      <div
        v-else-if="!transactions.length"
        style="min-height:16rem"
        class="w-full flex flex-col justify-center items-center">
        No transaction found.
      </div>
      <div
        v-else
        class="w-full">
        <transition-group name="list-item">
          <div
            v-for="txn in transactions"
            :key="txn.hash"
            :class="{'selected': selectedTxn==txn.hash}"
            class="transaction">
            <div
              class="transaction__top-row"
              @click="toggleTxn(txn.hash)">
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
                    v-if="txn.direction=='out' && !txn.status"
                    class="eva eva-arrow-upward-outline font-bold ml-1" />
                  <i
                    v-else-if="txn.direction=='in'"
                    class="eva eva-arrow-downward-outline font-bold ml-1" />
                  <i
                    v-else-if="txn.direction=='self'"
                    class="eva eva-radio-button-on-outline ml-1 font-bold" />
                  <i
                    v-else-if="txn.status"
                    class="eva eva-loader-outline rotating ml-1 font-bold" />
                </span>
                <!-- <span></span> -->
                <!-- Zilliqa -->
              </div>
              <div class="transaction__amount">
                <span
                  :class="{'text-green-600': txn.direction=='in'}"
                  class="zil">
                  <span v-if="txn.direction=='in'">+</span>
                  <span v-else>-</span>
                  {{ txn.direction=='self'? '--' :txn.value* Math.pow(10, -12) | currency('', 4) }}
                </span>
                &nbsp; ZIL
                <span
                  v-if="txn.direction!='self'"
                  class="usd">
                  &nbsp; &asymp; &nbsp; {{ (txn.value*Math.pow(10, -12) )* getPrices.USD | currency('$', 2) }}
                </span>
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
              </div>
              <div class="transaction__time">
                {{ txn.timestamp | moment(" MMM Do, h:mm a") }}
              </div>
            </div>
            <div class="divider" />
            <div
              v-if="selectedTxn===txn.hash"
              class="transaction__bottom-row">
              <div>
                <div class="block tracking-wide text-gray-700 text-sm font-semibold">
                  Transaction Hash
                </div>
                <span>
                  <a
                    :href="`${selectedNode.explorer}transactions/${txn.hash}`"
                    class="hover:text-teal-600"
                    target="_blank">{{ txn.hash }}</a>
                  <i
                    v-clipboard:copy="`${txn.hash}`"
                    v-clipboard:success="onCopyTxn"
                    v-clipboard:error="onErrorTxn"
                    class="eva eva-copy-outline" />
                  <a
                    :href="`${selectedNode.explorer}transactions/${txn.hash}`"
                    target="_blank">
                    <i
                      class="eva eva-external-link-outline" />
                  </a>
                </span>
              </div>
              <div class="ml-12">
                <div class="block tracking-wide text-gray-700 text-sm font-semibold">
                  Fee
                </div>
                <span>
                  {{ txn.fee* Math.pow(10, -12) }} ZIL
                </span>
              </div>
            </div>
          </div>
        </transition-group>
        <span
          v-if="transactions.length > 24"
          class="text-gray-700 pt-4 text-left text-sm italic text-left">
          * These are only last 25 Transactions
        </span>
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
        network: 'testnet',
        page: ''
      },
      selectedTxn: ''
    };
  },
  computed: {
    ...mapGetters(['getAccount', 'getPrices']),
    ...mapState({
      viewTxns: state => state.viewblockAccount.txs,
      selectedNode: state => state.selectedNode,
      localTxns: state => state.localTxns,
      loading: state => state.loading
    }),
    transactions() {
      const address = this.getAccount.address;
      let txn = this.localTxns.filter(function(obj) {
        return obj.from == address || obj.to == address;
      });
      return [...txn, ...this.viewTxns.docs];
    }
  },
  watch: {
    selectedNode: {
      handler(value) {
        console.log(value);
        this.getTransactions(this.requestParams);
      },
      deep: true
    }
  },
  async beforeMount() {
    this.requestParams.address = this.getAccount.address;
    if (this.selectedNode.id == 1001) {
      this.requestParams.network = 'mainnet';
      await this.getTransactions(this.requestParams);
    } else if (this.selectedNode.id == 1002) {
      this.requestParams.network = 'testnet';
      await this.getTransactions(this.requestParams);
    } else {
      console.error('Can not fetch transaction from unknown network');
    }
  },
  methods: {
    ...mapActions(['getTransactions']),
    txnStatus(dir) {
      if (dir == 'in') {
        return 'Received';
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
    onCopyTxn(e) {
      this.$notify({
        icon: 'eva eva-checkmark-circle-outline',
        message: `Transction Hash copied successfully `,
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
    onErrorTxn(e) {
      this.$notify({
        icon: 'eva eva-close-circle-outline',
        message: `Failed to copy address`,
        type: 'danger'
      });
    },
    toggleTxn(hash) {
      if (hash == this.selectedTxn) {
        this.selectedTxn = '';
      } else {
        this.selectedTxn = hash;
      }
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
  @apply flex flex-col border rounded mb-2;
  @apply items-center w-full overflow-hidden cursor-pointer;
  &.selected,
  &:hover {
    @apply shadow-md;
  }
  &__top-row {
    @apply flex flex-row w-full px-4 py-3;
  }
  &__bottom-row {
    @apply flex flex-row w-full px-4 py-3 text-left;
    span {
      @apply leading-normal;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    i {
      @apply ml-2 text-gray-800 p-1 text-base border rounded-full cursor-pointer;
      &:hover {
        @apply shadow-md;
      }
    }
  }
  // font-size: 0.9rem;
  &__token {
    @apply flex flex-row items-center;
    flex: 1;
    max-width: 20%;
    min-width: 6.6rem;
  }
  &__status {
    flex: 1;
    max-width: 25%;
    min-width: 7rem;
    @apply flex items-center;
    span {
      @apply flex items-center;
      @apply rounded-lg relative;
      padding: 4px 8px;
      color: rgba(12, 12, 13, 0.6);
      @apply tracking-wide text-gray-700 text-xs font-semibold;
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
    min-width: 10rem;
    @apply flex flex-row my-1 items-center;
    .zil {
      @apply leading-normal text-gray-900 font-semibold;
    }
    .usd {
      @apply tracking-wide text-gray-700 text-sm;
    }
  }
  &__address {
    flex: 1;
    width: 20%;
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
  &__time {
    flex: 1;
    width: 20%;
    min-width: 10rem;
    @apply flex justify-end text-sm items-center;
  }
}
.list-item-enter-active,
.list-item-leave-active {
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: left center;
}
.list-item-enter, .list-item-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: scale(0.5);
}

.list-item-leave-active {
  position: absolute;
}

.list-item-move {
  transition: transform 0.4s linear 0.3;
}
.divider {
  @apply bg-gray-300 w-full;
  height: 1px;
}
</style>
