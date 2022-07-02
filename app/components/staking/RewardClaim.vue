<template>
  <z-modal
    :visible="visible"
    @close="$emit('close')">
    <div 
      style="max-width:550px" 
      class="mx-4">
      <div class="font-semibold text-2xl mb-6 text-gray-800">
        Claim <b>ZIL</b> reward
      </div>
      <p class=" text-left my-4">
        You have delegated your ZIL to {{ myStakes.length }} delegator{{ myStakes.length == 1 ? '' : 's' }}. 
        You need to claim your reward individually.
      </p>
      <z-table
        class="w-full"
        :data="myStakes">
        <template slot-scope="scope">
          <z-table-column
            label="Name"
            field="name"
            class="font-semibold">
            <div
              class="flex items-center  cursor-pointer mr-"
              @click="selectRow(scope)">
              <input
                id="node-option"
                :checked="selectedIndex===scope.index"
                type="radio"
                name="nodes"
                :value="scope.index" 
                class="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300 mr-2"
                aria-labelledby="node-option"
                aria-describedby="node-option">
              {{ scope.row.name }}
            </div>
          </z-table-column>
          <z-table-column
            label="Amount Staked (ZIL)"
            field="amount">
            {{ scope.row.amount*Math.pow(10, -12) | currency('', 2) }}
          </z-table-column>
          <z-table-column
            label="Rewards (ZIL)"
            class="font-semibold"
            field="myReward">
            {{ scope.row.myReward*Math.pow(10, -12) | currency('', 4) }} 
          </z-table-column>
        </template>
      </z-table>
      <div
        class="bg-gray-200 text-gray-900 rounded my-4 p-2 px-4  text-left flex flex-row items-center">
        <i class="eva eva-info-outline text-xl mr-4" />
        <div>
          Increase the "Gas Limit" if your transaction is failing.
        </div>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <div
            class=" text-left inline-block
          align-middle f  font-semibold">
            Fee:
            <span class="text-md font-bold">
              {{ transactionFee }}
            </span>
            ZIL
          </div>
        </div>
        <div
          @click="isAdvance=!isAdvance">
          <span
            class=" italic text-left inline-block
              align-middle 
              cursor-pointer hover:text-teal-500 font-semibold">
            {{ isAdvance ? '-': '+' }} Advance
          </span>
        </div>
      </div>
        
      <div
        v-if="isAdvance"
        class="gas-form flex flex-col md:flex-row flex-1 ">
        <div class="gas__limit flex-1 items-start flex-col flex">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Gas Limit
          </div>
          <z-input
            v-model="overrides.gasLimit"
            :hide="false"
            :valid="isNumber(overrides.gasLimit) && overrides.gasLimit > 0"
            number
            placeholder="10" />
        </div>
        <div class="gas__space mx-6" />
        <div class="gas__price flex-1 items-start flex-col flex">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Gas Price (Li)
          </div>
          <z-input
            v-model="overrides.gasPriceInLi"
            :valid="isNumber(overrides.gasPriceInLi) && overrides.gasPriceInLi > 0"
            :hide="false"
            number
            placeholder="1" />
        </div>
      </div>
    </div>
    <div
      v-if="errorMsg"
      class="bg-red-100 text-red-700 rounded my-4  px-4 p-2  text-left flex flex-row items-center">
      <i
        class="eva eva-alert-triangle-outline  text-xl mr-4" />
      <div class="text-sm">
        {{ errorMsg }}
      </div>
    </div>
    <div class="flex flex-row -mx-2">
      <div class="w-1/3 px-2">
        <z-button
          class="w-full mt-8"
          type="default"
          rounded
          :disabled="loading"
          @click="$emit('close')">
          Cancel
        </z-button>
      </div>
      <div class="w-2/3 px-2">
        <z-button
          rounded
          class="mt-8 w-full"
          :loading="loading"
          @click="claim()">
          Claim Reward
        </z-button>
      </div>
    </div>
  </z-modal>
</template>

<script>
import Vue2Filters from 'vue2-filters';
import { isNumber } from '@/utils/validation';
import config from '@/config.json';
import { BN, Long, validation, units } from '@zilliqa-js/util';

export default {
  name: 'RewardClaim',
  mixins: [Vue2Filters.mixin],
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    myStakes: {
      required: true,
      type: [Array, Object]
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      selectedRow: {},
      selectedIndex: null,
      isAdvance: false,
      overrides: {
        gasLimit: 50000,
        gasPriceInLi: config.MINIMUM_GAS_PRICE
      },
      errorMsg: null
    };
  },
  computed: {
    transactionFee() {
      const fee =
        this.overrides.gasLimit *
        this.overrides.gasPriceInLi *
        Math.pow(10, -6); // in Li
      return parseFloat(fee.toFixed(4));
    }
  },
  async mounted() {
    try {
      const minGasPrice = await this.$zillet.blockchain.getMinimumGasPrice();
      this.overrides.gasPriceInLi = Number(minGasPrice.result) * 10 ** -6;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    isNumber,
    claim() {
      if (this.selectedRow.address && this.selectedIndex >= 0) {
        this.$emit('claim', {
          address: this.selectedRow.address,
          overrides: {
            gasLimit: Long.fromNumber(this.overrides.gasLimit),
            gasPrice: new BN((this.overrides.gasPriceInLi * 10 ** 6).toFixed(0))
          }
        });
      } else {
        this.errorMsg = `Plese select a node first`;
        return this.$notify({
          message: this.errorMsg,
          type: 'danger'
        });
      }
    },
    selectRow(scope) {
      this.selectedIndex = scope.index;
      this.selectedRow = scope.row;
      this.errorMsg = null;
    }
  }
};
</script>

<style>
</style>
