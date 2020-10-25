<template>
  <z-modal
    :visible="visible"
    custom-class="overflow-visible md:overflow-auto"
    @close="$emit('close')">
    <div 
      style="max-width:450px"
      class="w-full px-2">
      <div class="font-semibold text-2xl mb-6 text-gray-800">
        Unstake <b>ZIL</b>
      </div>
      <div class="flex flex-col w-full">
        <div class="flex flex-row items-center justify-between">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Amount
          </div>
          <div
            class=" text-sm cursor-pointer"
            @click="fillMax"
          >
            <b class="text-teal-600">{{ Number(selectedSeedNode.amount*Math.pow(10,-12)).toFixed(4) }}</b> ZIL  Available   
          </div>
        </div>
        <div class="flex flex-row">
          <z-input
            v-model.number="amount"
            :hide="false"
            :valid="validateAmount"
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

      <div v-if="myStakes.length > 1">
        <p class=" text-left my-2">
          It looks like you have delegted ZILs to {{ myStakes.length }} different seed nodes. Please select a seed node where you
          want to undelegate your amount. 
        </p>
        <div class="flex flex-row items-center justify-between">
          <div class="tracking-wide text-sm font-semibold mb-2">
            Removes from
          </div>
        </div>
        <div class="relative">
          <div
            v-if="seedNodeDropDown"
            class="fixed inset-0"
            @click="seedNodeDropDown = false" />
          <span
            class="flex flex-row items-center cursor-pointer justify-between focus:outline-none bg-gray-100 text-gray-900 
                  h-10 px-4 py-2 rounded border border-gray-400 w-full"
            @click="seedNodeDropDown=true">
            <div class="flex flex-column items-center justify-between w-full">
              <p class="text-gray-800 font-bold pl-2">
                {{ selectedSeedNode.name }}
              </p>
              <p class="text-gray-800 pr-2">
                <b>{{ selectedSeedNode.amount*Math.pow(10, -12) }}</b> ZIL
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
                v-for="n in orderBy(myStakes,'name')"
                :key="n.address"
                :class="{'bg-gray-200':selectedSeedNode.address === n.address}"
                class="flex flex-column items-center justify-between text-left px-4 py-3 
              text-sm cursor-pointer hover:bg-grey-lightest"
                @click="fromTokenChange(n, false)">
                <p class="text-gray-800 font-bold pl-2">
                  {{ n.name }}
                </p>
                <p class="text-gray-800 pr-2">
                  <b>{{ n.amount*Math.pow(10, -12) }}</b> ZIL
                </p>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div
        class="bg-gray-100 text-gray-700 rounded my-4 p-2 px-4  text-left flex flex-row items-center">
        <i class="eva eva-info-outline text-xl mr-4" />
        <div>
          After Unstake you have to wait for at least <strong>{{ bnumReq }}</strong> confirmation in 
          order to make the withdrawal
        </div>
      </div>
      <div
        v-if="errorMsg"
        class="bg-red-100 text-red-700 rounded my-4  px-4 p-2  text-left flex flex-row items-center">
        <i
          class="eva eva-alert-triangle-outline  text-xl mr-4" />
        <div>
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
          :disabled="!validateAmount"
          class="rounded py-2 shadow-md ml-2 w-full"
          @click="$emit('unstake', amount, selectedSeedNode.address)">
          Unstake
        </z-button>
      </div>
    </div>
  </z-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Vue2Filters from 'vue2-filters';

export default {
  name: 'AddToken',
  mixins: [Vue2Filters.mixin],
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    myStakes: {
      required: true,
      type: Array
    },
    errorMsg: {
      type: String,
      default: ''
    },
    bnumReq: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      amount: 0,
      seedNodeDropDown: false,
      selectedSeedNode: {}
    };
  },
  computed: {
    totalZilStaked() {
      let total = 0;
      for (let index = 0; index < this.myStakes.length; index++) {
        const element = this.myStakes[index];
        total = total + parseInt(element.amount);
      }
      return total * Math.pow(10, -12);
    },
    validateAmount() {
      return (
        parseFloat(this.amount) <=
        parseInt(this.selectedSeedNode.amount) * Math.pow(10, -12)
      );
    }
  },
  watch: {
    myStakes: {
      handler(newValue, oldValue) {
        if (newValue.length) {
          this.selectedSeedNode = newValue[0];
        }
      }
    }
  },
  mounted() {
    if (this.myStakes.length) {
      this.selectedSeedNode = this.myStakes[0];
    }
  },
  methods: {
    fromTokenChange(node) {
      this.selectedSeedNode = node;
      this.seedNodeDropDown = false;
    },
    fillMax() {
      this.amount = Number(
        this.selectedSeedNode.amount * Math.pow(10, -12)
      ).toFixed(4);
    }
  }
};
</script>

<style>
</style>
