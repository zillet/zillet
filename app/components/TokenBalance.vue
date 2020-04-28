<template>
  <div class="w-full">
    <div class="flex flex-row items-center justify-between">
      <h3 class="font-semibold text-xl my-0 text-left">
        Tokens
      </h3>
      <z-button
        class="m-0 p-1 px-4 text-sm rounded"
        @click="isAddModal=true">
        <i class="eva eva-plus-circle-outline mr-2" />
        Add Token
      </z-button>
    </div>
    <div class="h-full">
      <Loader v-if="loading" />
      <div
        v-else-if="!sortTokenBalances.length && !loading"
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
      <div
        v-for="bal in sortTokenBalances"
        v-else
        :key="bal.symbol"
        class="flex flex-row justify-between items-center border-b pb-2 pt-3">
        <div class="flex">
          <img
            :src="getImages(bal.symbol)"
            :onerror="`this.onerror=null;this.src='${getImages('generic')}'`"
            class="token__icon rounded">
          <p class="ml-1 uppercase font-semibold">
            {{ bal.symbol }}
          </p>
        </div>
        <div
          class="flex items-center"
          @click="$emit('tokenClicked', bal)">
          <div class="flex  font-bold cursor-pointer">
            {{ bal.balance*Math.pow(10, -1*bal.decimals) | currency('', 2) }}
          </div>
          <div class="ml-2 text-xs font-semibold text-gray-700">
            ≈  {{ amountInUsd(bal) | currency('$', 2) }}
          </div>
        </div>
      </div>
    </div>
    <!-- ADd new token modal -->
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
          :disabled="fetching"
          placeholder="zil1399rnnzxnl3yllhakxn08eelmrpk3ydwywv8xy" />
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Token Symbol
        </div>
        <z-input
          v-model="token.symbol"
          :hide="false"
          class="mb-4 flex-1"
          :disabled="fetching"
          placeholder="ZWT" />
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
          Token Decimals
        </div>
        <z-input
          v-model.number="token.decimals"
          :hide="false"
          class="18"
          number
          :disabled="fetching"
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
            :disabled="fetching || !validateAddress"
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
      fetching: false
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
  beforeMount() {
    // console.log(this.tokens);
    // const deployedContract = this.$zillet.contracts.at(
    //   this.tokens[0].testnetAddress
    // );
    // console.log(deployedContract);
  },
  methods: {
    ...mapActions(['fetchBalance', 'getContract', 'getZrc2List']),
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
      this.fetching = true;
      try {
        const td = await this.getContract(address);
        this.fetching = false;
        this.token = { ...this.token, ...td };
      } catch (error) {
        this.$notify({
          message: `${error.message}`,
          type: 'danger'
        });
        this.fetching = false;
      }
    },
    async saveToken() {
      let zrc2;
      this.fetching = true;
      if (this.selectedNode.id != '1') {
        this.token.testnetAddress = this.token.address;
        this.token.address = '';
      }
      try {
        zrc2 = JSON.parse(localStorage.getItem('_zrc2_tokens'));
        if (zrc2 && zrc2.length) {
          zrc2.push(this.token);
        } else {
          zrc2 = [this.token];
        }
      } catch (error) {
        zrc2 = [this.token];
      }
      localStorage.setItem('_zrc2_tokens', JSON.stringify(zrc2));
      await this.getZrc2List();
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
