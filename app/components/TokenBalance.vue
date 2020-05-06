<template>
  <div class="w-full">
    <div class="flex flex-row items-center justify-between px-6 pt-4 pb-2">
      <h3 class="font-semibold text-xl my-0 text-left">
        Tokens 
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
      class="h-full px-6 overflow-scroll"
      style="max-height:18rem">
      <Loader v-if="loading || fetching" />
      <div
        v-for="bal in sortTokenBalances"
        v-else-if="sortTokenBalances.length"
        :key="bal.symbol"
        class="flex flex-row justify-between items-center border-b pb-2 pt-3">
        <div
          class="flex cursor-pointer"
          @click="displayTokenDetail(bal)">
          <img
            :src="getImages(bal.symbol)"
            :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
            class="token__icon rounded">
          <p class="ml-2 uppercase font-semibold">
            {{ bal.symbol }}
          </p>
        </div>
        <div
          class="flex items-center"
          @click="$emit('tokenClicked', bal)">
          <div class="flex  font-bold cursor-pointer">
            {{ bal.balance*Math.pow(10, -1*bal.decimals) | currency('', 2) }}
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
      class="text-sm text-gray-800 pt-2">
      Scroll for more <i
        class="eva eva-arrowhead-down-outline relative"
        style="top:3px" />
    </div>
    <!-- Add new token modal -->
    <z-modal
      :visible="isAddModal"
      @close="isAddModal=false">
      <div 
        style="min-width:400px" 
        class="mx-4">
        <h3 class="font-semibold text-2xl mb-6 text-gray-800">
          Add Custom Token
        </h3>
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Token Contract Address
        </div>
        <z-input
          v-model="token.address"
          :hide="false"
          :valid="validateAddress"
          class="mb-4"
          :disabled="fetchingDetails"
          placeholder="zil1399rnnzxnl3yllhakxn08eelmrpk3ydwywv8xy" />
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Token Symbol
        </div>
        <z-input
          v-model="token.symbol"
          :hide="false"
          class="mb-4 flex-1"
          :disabled="fetchingDetails"
          placeholder="ZWT" />
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Token Decimals
        </div>
        <z-input
          v-model.number="token.decimals"
          :hide="false"
          class="18"
          number
          :disabled="fetchingDetails"
          placeholder="18" />
        <div class="flex items-center justify-between -mx-3">
          <z-button
            class="mx-3"
            type="default"
            rounded
            @click="isAddModal=false">
            Cancel
          </z-button>
          <z-button
            class="mx-3 min-w-42"
            rounded
            :disabled="fetchingDetails || !validateAddress"
            @click="saveToken(token)">
            Save Token
          </z-button>
        </div>
      </div>
    </z-modal>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import { getImages } from '@/utils';
import Vue2Filters from 'vue2-filters';
export default {
  name: 'TokenBalance',
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      isAddModal: false,
      token: {
        address: '',
        testnetAddress: '',
        name: '',
        symbol: '',
        decimals: ''
      },
      fetching: true,
      fetchingDetails: false
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance']),
    ...mapState({
      tokens: state => state.zrc2,
      selectedNode: state => state.selectedNode,
      tokenBalances: state => state.tokenBalances,
      loading: state => state.loading
    }),
    validateAddress() {
      return this.token.address.length == 42;
    },
    sortTokenBalances() {
      return this.orderBy(this.tokenBalances, 'balance', -1);
    }
  },
  watch: {
    'token.address': {
      handler(newValue, oldValue) {
        if (newValue && newValue.length === 42 && newValue != oldValue) {
          this.getDetails(newValue);
        }
      }
    }
  },
  async beforeMount() {
    await this.fetchTokenBalance();
    this.fetching = false;
  },
  methods: {
    ...mapActions(['fetchTokenBalance', 'getContract', 'getZrc2List']),
    getImages,
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
    async getDetails(address) {
      this.fetchingDetails = true;
      try {
        const td = await this.getContract(address);
        this.fetchingDetails = false;
        this.token = { ...this.token, ...td };
      } catch (error) {
        this.$notify({
          message: `${error.message}`,
          type: 'danger'
        });
        this.fetchingDetails = false;
      }
    },
    displayTokenDetail(token) {
      console.log(token);
    },
    async saveToken() {
      let zrc2;
      let token = this.token;
      let address;
      if (this.selectedNode.id != '1') {
        token.testnetAddress = token.address;
        address = token.address;
        delete token.address;
      }
      try {
        zrc2 = JSON.parse(localStorage.getItem('_zrc2_tokens'));
        let obj = zrc2.find(
          t =>
            (t.address && t.address == token.address) ||
            (t.testnetAddress && t.testnetAddress == token.testnetAddress)
        );
        if (obj && obj.symbol) {
          token.address = address;
          return this.$notify({
            message: `${'This token already exists in your list.'}`,
            type: 'danger'
          });
        } else if (zrc2 && zrc2.length) {
          zrc2.push(token);
        } else {
          zrc2 = [token];
        }
      } catch (error) {
        zrc2 = [token];
      }
      localStorage.setItem('_zrc2_tokens', JSON.stringify(zrc2));
      this.token = {
        address: '',
        testnetAddress: '',
        name: '',
        symbol: '',
        decimals: ''
      };
      this.isAddModal = false;
      this.fetching = true;
      await this.getZrc2List();
      await this.fetchTokenBalance();
      this.fetching = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.token__icon {
  height: 20px;
  width: 20px;
}
</style>
