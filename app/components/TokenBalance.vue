<template>
  <div class="w-full">
    <div class="flex flex-row items-center justify-between px-6 pt-4 pb-2">
      <h3 class="font-semibold text-xl my-0 text-left">
        Token Balances
        <span
          class="text-xs italic text-left inline-block ml-2
            font-semibold align-middle text-gray-700 font-normal
            underline cursor-pointer hover:text-teal-500"
          @click="fetchTokenBalance()">
          <i
            class="eva eva-sync-outline relative font-bold"
            style="top:2px" />
          Refresh
        </span>
      </h3>
      <z-button
        class="m-0 p-1 px-4 text-sm rounded"
        @click="isAddModal=true">
        <i class="eva eva-plus-circle-outline mr-2" />
        Add Token
      </z-button>
    </div>
    <!-- <div class="divider" /> -->
    <div
      class="h-full px-6 overflow-auto"
      style="max-height:18rem">
      <Loader v-if="(loading || fetching ) && !sortTokenBalances.length" />
      <div
        v-for="bal in sortTokenBalances"
        v-else-if="sortTokenBalances.length"
        :key="bal.symbol"
        class="flex flex-row justify-between items-center border-b pb-2 pt-3">
        <div
          class="flex token-symbol cursor-pointer pr-6 hover:text-gray-900"
          @click="displayTokenDetail(bal)">
          <img
            :src="getImages(bal.symbol)"
            :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
            class="token__icon rounded">
          <p class="ml-2 font-semibold">
            {{ bal.symbol }}
          </p>
          <!-- <i
            class="hide eva eva-alert-circle-outline text-primary relative font-semibold pl-2"
            style="top:4px" /> -->
        </div>
        <div
          class="flex items-center hover:text-gray-900"
          @click="$emit('tokenClicked', bal)">
          <div class="flex font-bold cursor-pointer">
            {{ roundDown(bal.balance*Math.pow(10, -1*bal.decimals), 4) | currency('', bal.symbol =='gZIL' ? 4:2) }}
          </div>
          <div
            v-if="amountInUsd(bal) > 0"
            class="ml-2 text-xs font-semibold text-gray-700">
            ≈  {{ amountInUsd(bal) | currency('$', 2) }}
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center h-full">
        <img
          src="@/assets/illustrations/no_data.svg"
          height="150"
          width="150">
        <p class="font-semibold text-gray-700 text-sm pt-12">
          No ZRC2 token available.<br>
          <span class="text-xs italic text-gray-700 font-normal">* Click on `Add token` to add a custom ZRC2</span>
        </p>
      </div>
    </div>
    <div
      v-if="sortTokenBalances.length > 6"
      class="text-xs text-gray-700 py-2">
      Scroll for more <i
        class="eva eva-arrowhead-down-outline relative"
        style="top:3px" />
    </div>
    <AddToken
      :visible="isAddModal"
      @close="isAddModal=false" />
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { getImages, roundDown, openContractOnVb } from '@/utils';
import Vue2Filters from 'vue2-filters';
import AddToken from '@/components/AddToken.vue';
export default {
  name: 'TokenBalance',
  components: {
    AddToken
  },
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      isAddModal: false,
      fetching: true,
      selectedToken: {}
    };
  },
  computed: {
    ...mapGetters(['Prices', 'Balance']),
    ...mapState({
      tokens: state => state.zrc2,
      tokenBalances: state => state.tokenBalances,
      loading: state => state.loading,
      selectedNode: state => state.selectedNode
    }),
    sortTokenBalances() {
      return this.orderBy(this.tokenBalances, 'balance', -1);
    }
  },
  async beforeMount() {
    await this.fetchTokenBalance();
    this.fetching = false;
  },
  methods: {
    ...mapActions(['fetchTokenBalance']),
    getImages,
    roundDown,
    amountInUsd(token) {
      try {
        return (
          token.balance *
          Math.pow(10, -1 * token.decimals) *
          this.Prices[token.symbol].USD
        );
      } catch (error) {
        return 0;
      }
    },
    displayTokenDetail(token) {
      openContractOnVb(this.selectedNode, token);
    }
  }
};
</script>
<style lang="scss" scoped>
.token__icon {
  height: 20px;
  width: 20px;
}
// .hide {
//   display: none;
// }
// .token-symbol:hover {
//   .hide {
//     display: block;
//     color: red;
//   }
// }
</style>
