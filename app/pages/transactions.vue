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
              style="top: 2px" />
            Refresh
          </span>
        </h3>
        <z-button
          class="m-0 p-2 px-4 text-sm rounded"
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
      <div class="w-full">
        <Loader v-if="loading && !transactions.length" />
        <div
          v-else-if="!loading && !transactions.length"
          style="min-height: 16rem"
          class="w-full flex flex-col justify-center items-center">
          No transaction found.
        </div>
        <z-table
          v-else
          class="w-full"
          :data="transactions"
          :loading="loading"
        >
          <template slot-scope="scope">
            <!-- Status Icon Column -->
            <z-table-column width="20" field="hash">
              <div
                class="flex flex-row justify-between p-1 text-sm rounded-full"
                :class="{
                  'bg-gray-700 text-white': scope.row.status === 'pending',
                  'bg-red-200': scope.row.receiptSuccess === false,
                  'bg-yellow-200': scope.row.direction === 'out' && scope.row.receiptSuccess && !scope.row.isContract,
                  'bg-gray-200': (scope.row.isContract && scope.row.receiptSuccess) || scope.row.direction === 'self',
                  'bg-green-200': scope.row.direction === 'in' && !scope.row.isContract
                }"
              >
                <i v-if="scope.row.receiptSuccess === false" class="eva eva-alert-triangle-outline" />
                <i v-else-if="scope.row.status === 'pending'" class="eva eva-loader-outline rotating" />
                <i v-else-if="scope.row.isContract && scope.row.tag !== 'Transfer' && scope.row.tag !== 'proxyTransfer'" class="eva eva-code-outline" />
                <i v-else-if="scope.row.direction === 'out' && !scope.row.status" class="eva eva-arrow-upward-outline" />
                <i v-else-if="scope.row.direction === 'in'" class="eva eva-arrow-downward-outline" />
                <i v-else-if="scope.row.direction === 'self'" class="eva eva-radio-button-on-outline" />
              </div>
            </z-table-column>

            <!-- Transaction ID Column -->
            <z-table-column label="Transaction ID" field="hash">
              <div class="flex flex-row justify-between">
                <a
                  :href="openTxOnVb(selectedNode, scope.row.hash)"
                  class="text-teal-700 text-sm font-semibold"
                  target="_blank"
                >
                  {{ formatTxHash(scope.row.hash) }}
                </a>
              </div>
            </z-table-column>

            <!-- Transfer Amount Column -->
            <z-table-column field="value" label="Transfer Amount">
              <div v-if="scope.row.receiptSuccess !== false" class="flex items-center justify-between">
                <div class="flex items-center justify-start">
                  <img
                    :src="getImages(scope.row.symbol)"
                    :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
                    height="20"
                    width="20"
                    class="mr-2"
                  />
                  <span
                    :class="{ 'text-green-600': scope.row.direction === 'in' }"
                    class="zil"
                  >
                    <span v-if="scope.row.direction === 'in'">+</span>
                    <span v-else-if="scope.row.direction === 'out'">-</span>
                    <span v-else-if="scope.row.direction === 'self'">--</span>
                    <span class="font-semibold">
                      {{
                        scope.row.direction === 'self' ? '...' :
                        (scope.row.value * Math.pow(10, -1 * ((scope.row.token && scope.row.token.decimals) || 12)))
                          | currency('', 2)
                      }}
                    </span>
                  </span>
                  <div class="text-xs text-gray-700">
                    &nbsp;
                    <span v-if="scope.row.symbol !== 'generic'" class="font-semibold">{{ scope.row.symbol }}</span>
                    <span v-if="scope.row.direction !== 'self' && scope.row.symbol === 'ZIL'" class="usd">
                      &nbsp;&nbsp;{{ amountInUsd(scope.row.value) | currency('$', 2) }}
                    </span>
                  </div>
                </div>
                <div class="text-sm text-right">
                  {{ scope.row.type }}
                </div>
              </div>
            </z-table-column>

            <!-- From/To Column -->
            <z-table-column field="to" label="From/To">
              <div
                v-clipboard:copy="`${scope.row.direction === 'in' ? toBech32(scope.row.from) : toBech32(scope.row.to)}`"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                class="flex flex-row items-center justify-start cursor-pointer text-sm font-semibold transaction__address bg-gray-200 hover:bg-gray-300 rounded px-2"
              >
                <jazzicon
                  :diameter="18"
                  :address="scope.row.direction === 'in' ? toBase16(scope.row.from) : toBase16(scope.row.to)"
                  class="mt-1 mr-2"
                />
                <div v-if="(scope.row.direction === 'in' ? scope.row.from : scope.row.to) in zilDomains">
                  {{ zilDomains[scope.row.direction === 'in' ? scope.row.from : scope.row.to] }}
                </div>
                <div v-else>
                  {{ scope.row.direction === 'in' ? toAddress(scope.row.from) : toAddress(scope.row.to) }}
                </div>
              </div>
            </z-table-column>

            <!-- Block Number Column (instead of Timestamp) -->
            <z-table-column field="blockNumber" class="text-sm" label="Block Number">
              {{ scope.row.blockNumber }}
            </z-table-column>
          </template>
        </z-table>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable vue/require-v-for-key */

import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
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
      selectedTxn: '',
      tId: null,
      txs: {
        docs: []
      },
      localTxs: []
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices']),
    ...mapState({
      selectedNode: state => state.selectedNode,
      zrc2: state => state.zrc2
    }),
    transactions() {
      // const data = this.txs.docs;

      // // this gives an object with dates as keys
      // const groups = data.reduce((groups, tx) => {
      //   const date = new Date(tx.timestamp).toISOString().split('T')[0];
      //   if (!groups[date]) {
      //     groups[date] = [];
      //   }
      //   groups[date].push(tx);
      //   return groups;
      // }, {});
      // // Edit: to add it in the array format instead
      // const groupArrays = Object.keys(groups).map(date => {
      //   return {
      //     date,
      //     txs: groups[date]
      //   };
      // });
      return this.orderBy([...this.txs.docs], 'timestamp', -1);
    },
    zilDomains() {
      try {
        const t = JSON.parse(localStorage.getItem('_zil_domains'));
        if (t == null) {
          return {};
        } else {
          return t;
        }
      } catch (error) {
        console.error(error);
        return {};
      }
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
  beforeDestroy() {
    console.log(`destroying transactions ... ${this.tId}`);
    if (this.tId) {
      clearInterval(this.tId);
    }
  },
  beforeMount() {
    try {
      this.localTxs = [];
    } catch (error) {}
    this.fetchTransactions();
  },
  methods: {
    ...mapMutations(['updateLocalTxn']),
    getImages,
    openAddressOnVb,
    openTxOnVb,
    async fetchTransactions(page = 1) {
      if (this.tId) {
        clearInterval(this.tId);
      }
      this.loading = true;
      this.txs = {
        docs: []
      };
      const rpcUrl = this.selectedNode.url;
      const address = this.Account.address;
      const start = 0;
      const limit = 25;

      const payload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'ots_searchTransactionsBefore',
        params: [address, start, limit]
      };

      try {
        const { data } = await this.$axios.post(rpcUrl, payload, {
          headers: { 'Content-Type': 'application/json' }
        });
        if (data.error) throw new Error(data.error.message);

        const newTxs = data.result.txs.map(tx => {
          const toDecimal = h => parseInt(h ?? '0x0', 16);
          const el = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: toDecimal(tx.value) * Math.pow(10, -6),
            gasPrice: BigInt(tx.gasPrice).toString(),
            gasLimit: toDecimal(tx.gas),
            nonce: toDecimal(tx.nonce),
            blockNumber: toDecimal(tx.blockNumber),
            direction:
              tx.from.toLowerCase() === tx.to.toLowerCase()
                ? 'self'
                : tx.from.toLowerCase() === address.toLowerCase()
                  ? 'out'
                  : 'in',
            timestamp: Date.now(), // You can replace this with actual block timestamp if available
            receiptSuccess: tx.status !== '0x0',
            symbol: 'ZIL',
            method: 'Transfer',
            toAddr: tx.to,
            events: tx.events || [],
            data: tx.data || '{}' // tx.data is the raw JSON string of the contract call
          };

          // Apply formatting logic
          try {
            const data = JSON.parse(el.data);
            el.tag = data._tag;
            el.symbol = 'ZIL';
            if (data._tag === 'WithdrawStakeRewards') {
              el.type = 'Rewards Claimed';
              el.value = el.events?.[0]?.params?.rewards || el.value;
              el.direction = 'in';
            } else if (data._tag === 'DelegateStake') {
              el.type = 'Stake';
            } else if (data._tag === 'CompleteWithdrawal') {
              el.type = 'Withdraw Unstake';
              el.value = el.events?.[0]?.params?.amount || el.value;
              el.direction = 'in';
            } else if (data._tag === 'WithdrawStakeAmt') {
              el.type = 'Unstake';
            } else if (data._tag === 'ReDelegateStake') {
              el.type = 'Transfer Stake';
            } else if (
              data._tag === 'Transfer' ||
              data._tag === 'proxyTransfer'
            ) {
              el.type = 'Token Transfer';

              const contractKey =
                this.selectedNode.id === 1 ? 'address' : 'testnetAddress';
              const zrc = this.zrc2.find(element => {
                return (
                  el.toAddr === element[contractKey] ||
                  el.to === element[contractKey]
                );
              });

              // // Extract and format ZRC-2 transfer
              // el.value = Number(data.params?.[1]?.value || 0);
              // el.to = toBech32Address(data.params?.[0]?.value || el.to);

              if (zrc && zrc.decimals) {
                el.token = zrc;
                el.symbol = zrc.symbol;
              } else {
                el.symbol = 'generic';
              }
            }

            if (data && data._tag) {
              el.isContract = true;
            } else {
              throw Error('No _tag');
            }
          } catch (error) {
            el.tag = '';
            el.symbol = 'ZIL';
            el.type = 'Transfer';
            // el.value = Number(el.value);
          }

          return el;
        });
        this.txs.docs = newTxs;
      } catch (err) {
        console.error('RPC fetch failed:', err);
      }

      this.loading = false;
      // if (this.Account.address && this.$route.name == 'transactions') {
      //   this.tId = setTimeout(() => {
      //     this.fetchTransactions();
      //   }, 60000);
      // }
    },
    amountInZil(amount) {
      return units.fromQa(new BN(amount), units.Units.Zil);
    },
    amountInUsd(amount) {
      return amount * this.Prices.USD;
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
      return `${txhash && txhash.substr(0, 10)}...${txhash &&
        txhash.substr(56)}`;
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
    formatTransactions(el, vb) {
      try {
        const data = JSON.parse(el.data);
        el.tag = data._tag;
        el.symbol = 'ZIL';
        if (data._tag === 'WithdrawStakeRewards') {
          el.type = 'Rewards Claimed';
          el.value = el.events && el.events[0] && el.events[0].params.rewards;
          el.direction = 'in';
        } else if (data._tag === 'DelegateStake') {
          el.type = 'Stake';
        } else if (data._tag === 'CompleteWithdrawal') {
          el.type = 'Withdraw Unstake';
          el.value = el.events && el.events[0] && el.events[0].params.amount;
          el.direction = 'in';
        } else if (data._tag === 'WithdrawStakeAmt') {
          el.type = 'Unstake';
        } else if (data._tag === 'ReDelegateStake') {
          el.type = 'Transfer Stake';
        } else if (data._tag === 'Transfer' || data._tag === 'proxyTransfer') {
          el.type = 'Token Transfer';
          const contractKey =
            this.selectedNode.id == 1 ? 'address' : 'testnetAddress';
          let zrc = this.zrc2.find(function(element) {
            return (
              el.toAddr == element[contractKey] || el.to == element[contractKey]
            );
          });
          el.value = Number(data.params[1].value);
          el.to = toBech32Address(data.params[0].value);

          if (el.amount) {
            console.log(el, data, zrc);
          }
          if (zrc && zrc.decimals) {
            el.token = zrc;
            el.symbol = zrc.symbol;
          } else {
            el.symbol = 'generic';
          }
        }
        if (data && data._tag) {
          el.isContract = true;
        } else {
          throw Error();
        }
      } catch (error) {
        el.tag = '';
        el.symbol = 'ZIL';
        el.type = 'Transfer';
        el.value = Number(el.value);
      }
      if (vb) {
        this.localTxs = this.localTxs.filter(function(obj) {
          return obj.hash !== el.hash;
        });
      }
      return el;
    },
    onCopy(e) {
      this.$notify({
        icon: 'eva eva-checkmark-circle-outline',
        message: `Address copied successfully`,
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
.transaction {
  @apply flex flex-col border rounded mb-2;
  @apply items-center w-full overflow-hidden cursor-pointer;

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

      padding: 0 8px;

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
