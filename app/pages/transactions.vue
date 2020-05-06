<template>
  <div class="w-full">
    <div class="card py-4">
      <div class="flex flex-row items-center justify-between">
        <h3 class="font-semibold text-xl">
          Transactions
          <span
            class="text-xs italic text-left inline-block ml-2
            font-semibold align-middle text-gray-700 font-normal
            underline cursor-pointer hover:text-teal-500"
            @click="fetchTransactions()">
            <i
              class="eva eva-sync-outline relative font-bold"
              style="top:2px" />
            Refresh
          </span>
        </h3>
        <z-button
          class="m-0 p-2 px-4 text-sm"
          type="default"
          size="mini"
          @click="openAddressOnVb(selectedNode, Account.bech32Address)">
          <img
            src="@/assets/icons/viewblock.png"
            height="20"
            class="mr-4"
            width="20"
          >
          Check on Viewblock.io
        </z-button>
      </div>
      <div class="flex w-full">
        <Loader v-if="loading" />
        <div
          v-else-if="!loading && !transactions.length"
          style="min-height:16rem"
          class="w-full flex flex-col justify-center items-center">
          No transaction found.
        </div>
        <z-table
          v-else
          class="w-full"
          :data="transactions"
          :loading="loading">
          <template slot-scope="scope">
            <z-table-column
              label="Transaction ID"
              field="hash"
              sortable
              class="font-semibold">
              <a
                :href="openTxOnVb(selectedNode, scope.row.hash)"
                class="text-teal-700 font-semibold"
                target="_blank">{{ formatTxHash(scope.row.hash) }}</a>
              <!-- <a
                :href="explorerLink(scope.row.hash)"
                target="_blank">
                <i class="eva eva-external-link-outline" />
              </a> -->
            </z-table-column>
            
            <z-table-column
              field="value"
              label="Transfer Amount">
              <div
                v-if="scope.row.type=='contract' && scope.row.eventType=='transfer'" 
                class="flex items-center justify-start">
                <img
                  :src="getImages(scope.row.contractTransfer.symbol)"
                  :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
                  height="20"
                  class="mr-2"
                  width="20">
                <span
                  :class="{'text-green-600': scope.row.direction=='in'}"
                  class="zil font-semibold">
                  <span v-if="scope.row.direction=='in'">+</span>
                  <span v-else>-</span>
                  <!-- TODO: Use zilliqa unit function -->
                  {{ 
                    scope.row.direction=='self'? '--' :
                    (scope.row.contractTransfer.amount* Math.pow(10, -1*(scope.row.contractTransfer.decimals || 18)))
                      | currency('', 2) 
                  }}
                </span>
                <div class="text-xs text-gray-700">
                  &nbsp; <span class="font-semibold">{{ scope.row.contractTransfer.symbol }}</span>
                  <!-- <span
                    v-if="scope.row.direction!='self'"
                    class="usd">
                    &nbsp; &asymp; &nbsp; {{ | currency('$', 2) }}
                  </span> -->
                </div>
              </div>
              <div
                v-else
                class="flex items-center justify-start">
                <img
                  :src="getImages('zil')"
                  height="20"
                  class="mr-2"
                  width="20">
                <span
                  :class="{'text-green-600': scope.row.direction=='in'}"
                  class="zil font-semibold">
                  <span v-if="scope.row.direction=='in'">+</span>
                  <span v-else>-</span>
                  <!-- TODO: Use zilliqa unit function -->
                  {{ scope.row.direction=='self'? '--' :amountInZil(scope.row.value)| currency('', 2) }}
                </span>
                <div class="text-xs text-gray-700">
                  &nbsp; <span class="font-semibold">ZIL</span>
                  <span
                    v-if="scope.row.direction!='self'"
                    class="usd">
                    <!-- TODO: Use zilliqa unit function -->
                    &nbsp;  &nbsp; {{ amountInUsd(scope.row.value)| currency('$', 2) }}
                  </span>
                </div>
              </div>
            </z-table-column>
            <z-table-column
              field="to"
              label="From/To">
              <div
                v-clipboard:copy="`${scope.row.direction=='in' ? toBech32(scope.row.from):toBech32(scope.row.to)}`"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                class="flex flex-row items-center justify-start
                cursor-pointer text-sm font-semibold
                 transaction__address bg-gray-200 hover:bg-gray-300 rounded px-2">
                <jazzicon
                  :diameter="18" 
                  :address="scope.row.direction=='in' ? toBase16(scope.row.from):toBase16(scope.row.to)"
                  class="mt-1 mr-2" />
                {{ scope.row.direction=='in' ? toAddress(scope.row.from):toAddress(scope.row.to) }}
              </div>
            </z-table-column>
            <z-table-column
              field="direcion"
              label="Status">
              <div class="transaction__status">
                <span
                  v-if="scope.row.receiptSuccess || scope.row.status=='pending'"
                  :class="scope.row.direction">
                  {{ txnStatus(scope.row.direction) }}
                  <i
                    v-if="scope.row.direction=='out' && !scope.row.status"
                    class="eva eva-arrow-upward-outline font-bold ml-1" />
                  <i
                    v-else-if="scope.row.direction=='in'"
                    class="eva eva-arrow-downward-outline font-bold ml-1" />
                  <i
                    v-else-if="scope.row.direction=='self'"
                    class="eva eva-radio-button-on-outline ml-1 font-bold" />
                  <i
                    v-else-if="scope.row.status"
                    class="eva eva-loader-outline rotating ml-1 font-bold" />
                    
                </span>
                <span
                  v-else
                  class="failed">
                  Failed
                  <i
                    class="eva eva-alert-triangle-outline ml-1 font-bold" />
                </span>
              </div>
            </z-table-column>
            <z-table-column
              field="timestamp"
              class="text-sm"
              label="Timestamp">
              {{ scope.row.timestamp | moment(" MMM Do, h:mm a") }}
            </z-table-column>
          </template>
        </z-table>
      </div>
      <div
        class="w-full">
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
import Vue2Filters from 'vue2-filters';
import { units, BN, validation, isHex } from '@zilliqa-js/util';
import { toBech32Address, fromBech32Address } from '@zilliqa-js/crypto';
import { getImages } from '@/utils';
import { openAddressOnVb, openTxOnVb } from '@/utils';
export default {
  name: 'Home',
  middleware: 'ifKeyExists',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      loading: false,
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
    ...mapGetters(['Account', 'Prices']),

    ...mapState({
      viewTxns: state => state.viewblockAccount.txs,
      selectedNode: state => state.selectedNode,
      localTxns: state => state.localTxns
    }),
    transactions() {
      const address = this.Account.address;
      let txn = this.localTxns.filter(function(obj) {
        return obj.from == address || obj.to == address;
      });
      const tx = [...txn, ...this.viewTxns];
      return this.orderBy(tx, 'timestamp', -1);
    }
  },
  watch: {
    'Account.address': {
      handler(newValue, oldValue) {
        this.fetchTransactions();
      }
    },
    'selectedNode.id': {
      handler(newValue, oldValue) {
        this.fetchTransactions();
      }
    }
  },
  beforeMount() {
    this.fetchTransactions();
  },
  methods: {
    ...mapActions(['getTransactions']),
    getImages,
    openAddressOnVb,
    openTxOnVb,
    async fetchTransactions() {
      this.loading = true;
      this.requestParams.address = this.Account.address;
      if (this.selectedNode.id == 1) {
        this.requestParams.network = 'mainnet';
      } else if (this.selectedNode.id == 333) {
        this.requestParams.network = 'testnet';
      } else {
        console.error('Can not fetch transaction from unknown network');
        return null;
      }
      await this.getTransactions(this.requestParams);
      this.loading = false;
    },
    txnStatus(dir) {
      if (dir == 'in') {
        return 'Received';
      } else if (dir == 'self') {
        return 'Self';
      } else if (dir == 'out') {
        return 'Sent';
      }
    },
    toBech32(address) {
      if (!validation.isBech32(address)) {
        return toBech32Address(address);
      } else {
        return address;
      }
    },
    toBase16(address) {
      if (!validation.isAddress(address)) {
        return fromBech32Address(address);
      } else {
        return address;
      }
    },
    toAddress(address) {
      address = this.toBech32(address);
      return `${address && address.substr(0, 8)}...${address &&
        address.substr(35)}`;
    },
    formatTxHash(txhash) {
      return `${txhash && txhash.substr(0, 6)}...${txhash &&
        txhash.substr(60)}`;
    },
    toggleTxn(hash) {
      if (hash == this.selectedTxn) {
        this.selectedTxn = '';
      } else {
        this.selectedTxn = hash;
      }
    },
    amountInZil(amount) {
      return units.fromQa(new BN(amount), units.Units.Zil);
    },
    amountInUsd(amount) {
      return this.amountInZil(amount) * this.Prices.USD;
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
    onErrorTxn(e) {
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
  &__hash {
    width: 2rem;
  }
  &__token {
    @apply flex flex-row items-center;
    flex: 1;
    max-width: 20%;
    min-width: 6.6rem;
  }
  &__status {
    flex: 1;
    max-width: 20%;
    min-width: 7rem;
    @apply flex items-center;
    span {
      @apply flex items-center;
      @apply rounded-lg relative;
      padding: 2px 12px;
      color: rgba(12, 12, 13, 0.6);
      @apply tracking-wide text-gray-800 text-xs font-semibold;
      &.in {
        background: rgba(0, 153, 77, 0.2);
      }
      &.out {
        background: rgba(250, 188, 45, 0.2);
      }
      &.self {
        background: rgba(101, 127, 230, 0.2);
      }
      &.failed {
        background: rgba(230, 101, 101, 0.2);
      }
    }
  }
  &__amount {
    flex: 1;
    min-width: 15rem;
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

.divider {
  @apply bg-gray-300 w-full;
  height: 1px;
}
</style>
