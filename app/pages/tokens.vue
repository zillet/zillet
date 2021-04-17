<template>
  <div class="w-full">
    <div class="card py-4">
      <div class="flex flex-row items-center justify-between">
        <h3 class="font-semibold text-xl">
          Tokens
          <span
            class="text-xs italic text-left inline-block ml-2
            font-semibold align-middle text-gray-700 font-normal
            underline cursor-pointer hover:text-teal-500"
            @click="fetchTokenBalance()">
            <i
              class="eva eva-sync-outline relative font-bold"
              style="top: 2px" />
            Refresh
          </span>
        </h3>
        <z-button
          class="m-0 p-2 px-4 text-sm rounded"
          size="mini"
          @click="isAddModal=true">
          <i class="eva eva-plus-circle-outline mr-2" />
          Add Token
        </z-button>
      </div>
      <div class="w-full">
        <Loader v-if="(loading || fetching) && !tokenBalances.length" />
        <div
          v-else-if="!loading && !fetching && !tokenBalances.length"
          style="min-height: 16rem"
          class="w-full flex flex-col justify-center items-center">
          No transaction found.
        </div>
        <z-table
          v-else
          class="w-full"
          :data="sortTokenBalances"
          :loading="loading">
          <template slot-scope="scope">
            <z-table-column
              label="Symbol"
              field="symbol"
              class="font-semibold ">
              <div 
                class="flex flex-row token-symbol cursor-pointer pr-6 hover:text-gray-900"
                @click="openContractOnVb(selectedNode, scope.row)">
                <img
                  :src="getImages(scope.row.symbol)"

                  :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
                  class="token__icon rounded h-6 w-6">
                <p class="ml-2 font-semibold">
                  {{ scope.row.symbol }}
                </p>
                <i
                  class="hide eva eva-alert-circle-outline text-primary relative font-semibold pl-2"
                  style="top: 4px" />
              </div>
            </z-table-column>
            <z-table-column
              label="Name"
              field="Name"
              class="font-semibold">
              {{ scope.row.name }}
            </z-table-column>
            <z-table-column
              label="Balance"
              field="balance"
              class="font-semibold">
              <div class="flex items-center ">
                <div class="flex  font-bold ">
                  {{ roundDown(scope.row.balance*Math.pow(10, -1*scope.row.decimals),2) | currency('', 6) }}
                </div>
                <div
                  v-if="amountInUsd(scope.row) > 0"
                  class="ml-2 text-xs font-semibold text-gray-700">
                  ≈  {{ amountInUsd(scope.row) | currency('$', 2) }}
                </div>
              </div>
            </z-table-column>
            <z-table-column
              label="Actions"
              field="Actions"
              width="330"
              class="font-semibold ">
              <div class="flex">
                <z-button
                  rounded
                  size="small"
                  class="py-1 ml-0 mr-2"
                  @click="sendToken(scope.row)">
                  Send
                </z-button>
                <z-button
                  class="mx-2 p-2 px-4 text-sm rounded"
                  type="default"
                  size="mini"
                  @click="openAddressOnVb(selectedNode, Account.bech32Address)">
                  <img
                    src="@/assets/icons/viewblock.png"
                    height="20"
                    width="20"
                  >
                </z-button>
                <z-button
                  v-if="scope.row.local"
                  class="mx-2 p-2 px-4 text-sm rounded"
                  type="default"
                  size="mini"
                  @click="removeToken(scope.row)">
                  <i class="eva eva-close-circle-outline text-base mr-2" />
                  Remove
                </z-button>
              </div>
            </z-table-column>
          </template>
        </z-table>
      </div>
    </div>
    <AddToken
      :visible="isAddModal"
      @close="isAddModal=false" />
    <z-modal
      :visible="removeTokenConfirmation"
      @close="removeTokenConfirmation=false">
      <div 
        style="max-width: 400px" 
        class="mx-4 ">
        <h3 class="font-semibold text-2xl mb-6 text-gray-800">
          Removing {{ selectedToken.symbol }}
        </h3>
        <div class="text-left">
          <p class="text-lg mb-4">
            You have non-zero balance in your wallet. <br>
            Are you sure you want to remove {{ selectedToken.symbol }} from your token list?
          </p>
          <span class="text-sm italic">
            * Please note that this action will only remove tokens from 
            the wallet UI. You will still have the tokens in your wallet.
          </span>
        </div>
        <div class="flex items-center justify-between -mx-3 mt-4">
          <z-button
            class="mx-3"
            type="default"
            rounded
            @click="removeTokenConfirmation=false">
            Cancel
          </z-button>
          <z-button
            class="mx-3 min-w-42"
            rounded
            @click="removeAllow=true;removeToken(selectedToken)">
            Remove {{ selectedToken.symbol }}
          </z-button>
        </div>
      </div>
    </z-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import { getImages, roundDown, openContractOnVb } from '@/utils';
import AddToken from '@/components/AddToken.vue';
import Vue2Filters from 'vue2-filters';
export default {
  middleware: 'ifKeyExists',
  components: {
    AddToken
  },
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      isAddModal: false,
      fetching: true,
      removeTokenConfirmation: false,
      removeAllow: false,
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
    ...mapActions(['fetchTokenBalance', 'getZrc2List']),
    getImages,
    roundDown,
    openContractOnVb,
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
    async removeToken(token) {
      this.selectedToken = token;
      if (token.balance > 0 && this.removeAllow == false) {
        this.removeTokenConfirmation = true;
        return;
      }
      try {
        let localZrc2 = JSON.parse(localStorage.getItem('_zrc2_tokens'));
        localZrc2 = localZrc2.filter(
          t =>
            (t.address && t.address != token.address) ||
            (t.testnetAddress && t.testnetAddress != token.testnetAddress)
        );
        this.removeTokenConfirmation = false;
        localStorage.setItem('_zrc2_tokens', JSON.stringify(localZrc2));
        await this.getZrc2List();
        await this.fetchTokenBalance();
      } catch (error) {
        console.log(error);
        console.log(error);
      }
    },
    sendToken(row) {
      this.$router.push({
        name: 'send',
        query: { symbol: row.symbol && row.symbol.toLowerCase() }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.token__icon {
  height: 20px;
  width: 20px;
}

.hide {
  display: none;
}
// .token-symbol:hover {
//   .hide {
//     display: block;
//     color: red;
//   }
// }
</style>
