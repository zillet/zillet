<template>
  <z-modal
    :visible="visible"
    custom-class="overflow-visible"
    @close="$emit('close')">
    <div 
      style="max-width:450px" 
      class="w-full px-2">
      <div class="font-semibold text-2xl mb-6 text-gray-800">
        Transfer Stake
      </div>
      <div class="flex flex-row items-center justify-between">
        <div class="tracking-wide text-sm font-semibold mb-2">
          From
        </div>
      </div>
      <div class="relative">
        <div
          v-if="fromNodeDropdown"
          class="fixed inset-0"
          @click="fromNodeDropdown = false" />
        <span
          class="flex flex-row items-center cursor-pointer justify-between focus:outline-none bg-gray-100 text-gray-900 
                  h-10 px-4 py-2 rounded border border-gray-400 w-full"
          @click="fromNodeDropdown=true">
          <div class="flex flex-column items-center justify-between w-full">
            <p class="text-gray-800 font-semibold pl-2">
              {{ fromNode.name }}
            </p>
            <p class="text-gray-800 pr-6 text-sm">
              <b class="text-base">{{ fromNode.amount*Math.pow(10, -12) | currency('', 4) }}</b> 
              ZIL staked
            </p>
          </div>
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor">
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
        </span>
        <transition
          enter-active-class="transition-all transition-fastest ease-out-quad"
          leave-active-class="transition-all transition-faster ease-in-quad"
          enter-class="opacity-0 scale-70"
          enter-to-class="opacity-100 scale-100"
          leave-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-70">
          <div
            v-if="fromNodeDropdown"
            class="origin-top-right absolute left-0 bg-white rounded border shadow-md w-full z-50 "
            style="max-height:250px; overflow-y:scroll"
          >
            <div
              v-for="n in myStakes"
              :key="n.address"
              :class="{'bg-gray-200':fromNode.address === n.address}"
              class="flex flex-column items-center justify-between text-left px-4 py-3 
              text-sm cursor-pointer hover:bg-grey-lightest"
              @click="fromNodeChange(n, false)">
              <p class="text-gray-800 pl-2">
                {{ n.name }}
              </p>
              <p class="text-gray-800 pr-2 font-semibold">
                {{ n.amount*Math.pow(10, -12) | currency('', 4) }} ZIL
              </p>
            </div>
          </div>
        </transition>
      </div>
      <div class="flex flex-row items-center justify-between mt-4">
        <div class="tracking-wide text-sm font-semibold mb-2">
          To
        </div>
      </div>
      <div class="relative">
        <div
          v-if="toNodeDropdown"
          class="fixed inset-0"
          @click="toNodeDropdown = false" />
        <span
          class="flex flex-row items-center cursor-pointer justify-between focus:outline-none bg-gray-100 text-gray-900 
                  h-10 px-4 py-2 rounded border border-gray-400 w-full"
          @click="toNodeDropdown=true">
          <div class="flex flex-column items-center justify-between w-full">
            <p class="text-gray-800 font-semibold pl-2">
              {{ toNode.name }}
            </p>
            <p class="text-gray-800 pr-6 text-sm">
              <b class="text-base">{{ toNode.commision | currency('', 2) }} %</b>
              (Commission rate)
            </p>
          </div>
          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor">
              <path
                d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
        </span>
        <transition
          enter-active-class="transition-all transition-fastest ease-out-quad"
          leave-active-class="transition-all transition-faster ease-in-quad"
          enter-class="opacity-0 scale-70"
          enter-to-class="opacity-100 scale-100"
          leave-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-70">
          <div
            v-if="toNodeDropdown"
            class="origin-top-right absolute left-0 bg-white rounded border shadow-md w-full z-50 "
            style="max-height:250px; overflow-y:scroll"
          >
            <div
              v-for="n in formattedList"
              :key="n.address"
              :class="{'bg-gray-200':toNode.address === n.address}"
              class="flex flex-column items-center justify-between text-left px-4 py-3 
              text-sm cursor-pointer hover:bg-grey-lightest"
              @click="toNodeChange(n, false)">
              <p class="text-gray-800 pl-2 flex items-center">
                {{ n.name }} <i
                  v-if="n.name.toLowerCase() =='zillet'"
                  class="eva eva-star-outline ml-2 text-primary" />
              </p>
              <p class="text-gray-800 pr-2 font-semibold">
                {{ n.commision | currency('', 2) }} %
              </p>
            </div>
          </div>
        </transition>
      </div>
      <div class="flex flex-col w-full mt-4">
        <div class="flex flex-row items-center justify-between">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Amount
          </div>
        </div>
        <div class="flex flex-row">
          <z-input
            v-model.number="amount"
            :hide="false"
            :valid="validateCryptoAmount"
            class="mb-0"
            number
            placeholder="0 ZIL" />
          <z-button
            type="default"
            style="height:3rem; left:-3px"
            class="m-0 relative bg-white border-gray-400 rounded-r"
            @click="fillMax">
            Max
          </z-button>
        </div>
      </div>
      <p class="italic text-left flex flex-row flex-wrap text-sm mt-2">
        * Redelegation to other SSN is instant.
        <ZLink
          to="/staking-on-zillet#what-are-the-benefits-of-delegating"
          class="text-left"
          external>
          Who should you redelegate your ZILs to?
        </ZLink>
      </p>
      <div
        v-if="errorMsg"
        class="bg-red-100 text-red-700 rounded my-4  px-4 p-2  text-left flex flex-row items-center">
        <i
          class="eva eva-alert-triangle-outline  text-xl mr-4" />
        <div class="text-sm">
          {{ errorMsg }}
        </div>
      </div>
      <div class="flex flex-row items-center justify-between">
        <z-button
          class="rounded py-2 mr-2 w-40"
          type="default"
          :disabled="loading"
          size="medium"
          @click="$emit('close')">
          Cancel
        </z-button>
        <z-button
          size="medium"
          :loading="loading"
          class="rounded py-2 shadow-md ml-2 w-full"
          @click="$emit('transfer', fromNode, toNode, amount)">
          Transfer
        </z-button>
      </div>
    </div>
  </z-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue2Filters from 'vue2-filters';
import { BN, units } from '@zilliqa-js/util';

export default {
  name: 'AddToken',
  mixins: [Vue2Filters.mixin],
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    ssnlist: {
      required: true,
      type: [Array, Object]
    },
    loading: {
      default: false,
      type: Boolean
    },
    errorMsg: {
      type: String,
      default: ''
    },
    myStakes: {
      default() {
        return [];
      },
      type: [Array, Object]
    }
  },
  data() {
    return {
      fetchingDetails: false,
      amount: 0,
      fromNodeDropdown: false,
      toNodeDropdown: false,
      fromNode: {},
      toNode: {}
    };
  },
  computed: {
    ...mapGetters(['Balance']),
    formattedList() {
      let list = [];
      for (const key in this.ssnlist) {
        if (key != this.fromNode.address) {
          list.push({
            address: key,
            name: this.ssnlist[key].arguments[3],
            commision: this.ssnlist[key].arguments[7] * Math.pow(10, -7)
          });
        }
      }
      return list;
    },
    validateCryptoAmount() {
      try {
        return !new BN(units.toQa(this.amount, units.Units.Zil)).gt(
          new BN(this.fromNode.amount)
        );
      } catch (error) {
        return false;
      }
    }
  },
  mounted() {
    if (this.myStakes.length) {
      this.fromNode = this.myStakes[0];
    }
    let obj = this.formattedList.find(o => o.name.toLowerCase() === 'zillet');
    if (obj) {
      this.toNode = obj;
    }
  },
  methods: {
    fromNodeChange(node) {
      this.fromNode = node;
      this.fromNodeDropdown = false;
    },
    toNodeChange(node) {
      this.toNode = node;
      this.toNodeDropdown = false;
    },
    fillMax() {
      this.amount = Number(this.fromNode.amount * Math.pow(10, -12)).toFixed(
        10
      );
    },
    stake() {}
  }
};
</script>

<style>
</style>
