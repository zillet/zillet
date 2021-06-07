<template>
  <z-modal
    :visible="visible"
    custom-class="overflow-visible"
    @close="$emit('close')">
    <div 
      style="max-width:450px" 
      class="px-2 w-full">
      <div class="font-semibold text-2xl mb-6 text-gray-800">
        Stake <b>ZIL</b>
      </div>
      <div class="flex flex-row items-center justify-between">
        <div class="tracking-wide text-sm font-semibold mb-2">
          Amount
        </div>
        <div
          class=" text-sm cursor-pointer"
          @click="amount=(avlAmount > 0 ? avlAmount : 0)"
        >
          <b class="text-teal-600">{{ avlAmount > 0 ? avlAmount : 0 }}</b>  ZIL available 
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
          @click="amount=(avlAmount > 0 ? avlAmount : 0)">
          Max
        </z-button>
      </div>
      <div class="flex flex-row items-center justify-between">
        <div class="tracking-wide text-sm font-semibold mb-2">
          Delegating to
        </div>
      </div>
      <div class="relative">
        <div
          v-if="seedNodeDropDown"
          class="fixed inset-0"
          @click="seedNodeDropDown = false" />
        <span
          class="flex flex-row items-center cursor-pointer justify-between focus:outline-none bg-white text-gray-900 
                  h-10 px-4 py-2 rounded border border-gray-200 w-full"
          @click="seedNodeDropDown=true">
          <div class="flex flex-column items-center justify-between w-full">
            <p class="text-gray-800 font-bold pl-2">
              {{ selectedSeedNode.name }}
            </p>
            <p class="text-gray-800 pr-6 text-sm">
              <b class="text-base">{{ selectedSeedNode.commision | currency('', 2) }} %</b>
              (Commission rate )
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
            v-if="seedNodeDropDown"
            class="origin-top-right absolute left-0 bg-white rounded border shadow-md w-full z-50 "
            style="max-height:250px; overflow-y:scroll"
          >
            <div
              v-for="n in orderBy(formattedList,'name')"
              :key="n.address"
              :class="{'bg-gray-200':selectedSeedNode.address === n.address}"
              class="flex flex-column items-center justify-between text-left px-4 py-3 
              text-sm cursor-pointer hover:bg-grey-lightest"
              @click="fromTokenChange(n, false)">
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
      <p class="italic text-left flex flex-row flex-wrap text-sm mt-2">
        * Don't know who to delegate?
        <ZLink
          to="/staking-on-zillet#what-are-the-benefits-of-delegating"
          class="text-left"
          external>
          Who should you delegate your ZILs to?
        </ZLink>
      </p>
      <div
        class="bg-gray-100 text-gray-700 rounded my-2 p-2 px-4  text-left flex flex-row items-center">
        <i class="eva eva-info-outline text-xl mr-4" />
        <div>
          Minimum staking amount is <b>{{ minStake *Math.pow(10, -12) }} ZIL</b>.
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
          @click="$emit('stake', amount, selectedSeedNode.address)">
          Stake
        </z-button>
      </div>
    </div>
  </z-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue2Filters from 'vue2-filters';
import { isNumber } from '@/utils/validation';
import { roundDown } from '@/utils';

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
    minStake: {
      default: 100,
      type: [Number, String]
    }
  },
  data() {
    return {
      fetchingDetails: false,
      amount: 0,
      seedNodeDropDown: false,
      selectedSeedNode: {}
    };
  },
  computed: {
    ...mapGetters(['Balance']),
    formattedList() {
      let list = [];
      for (const key in this.ssnlist) {
        list.push({
          address: key,
          name: this.ssnlist[key].arguments[3],
          commision: this.ssnlist[key].arguments[7] * Math.pow(10, -7)
        });
      }
      return list;
    },
    avlAmount() {
      return this.roundDown(
        this.Balance.zil && Number(this.Balance.zil).toFixed(4) - 100,
        4
      );
    },
    validateCryptoAmount() {
      if (!isNumber(this.amount)) {
        return false;
      }
      return parseFloat(this.amount) < this.Balance.zil - 100;
    }
  },
  watch: {
    formattedList: {
      handler(newValue, oldValue) {
        let obj = newValue.find(o => o.name.toLowerCase() === 'zillet');
        if (obj) {
          this.selectedSeedNode = obj;
        }
      }
    }
  },
  mounted() {
    let obj = this.formattedList.find(o => o.name.toLowerCase() === 'zillet');
    if (obj) {
      this.selectedSeedNode = obj;
    }
  },
  methods: {
    roundDown,
    fromTokenChange(node) {
      this.selectedSeedNode = node;
      this.seedNodeDropDown = false;
    },
    stake() {}
  }
};
</script>

<style>
</style>
