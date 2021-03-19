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
            {{ scope.row.name }}
          </z-table-column>
          <z-table-column
            label="Amount Staked (ZIL)"
            field="amount">
            {{ scope.row.amount*Math.pow(10, -12) | currency('', 2) }}
          </z-table-column>
          <z-table-column
            label="Rewards (ZIL + gZIL)"
            class="font-semibold"
            field="myReward">
            {{ scope.row.myReward*Math.pow(10, -12) | currency('', 4) }} +               
            {{ scope.row.myReward*Math.pow(10, -15) | currency('', 4) }} 
          </z-table-column>
          <z-table-column
            label="Action"
            width="150"
            field="commission">
            <z-button
              size="small"
              :loading="loading && selectedRow.name==scope.row.name"
              :disabled="loading"
              type="default"
              class="rounded hover:bg-primary hover:text-gray-100 p-1 shadow ml-2 w-full"
              @click="claim(scope.row)">
              Claim Reward
            </z-button>
          </z-table-column>
        </template>
      </z-table>
    </div>
  </z-modal>
</template>

<script>
import Vue2Filters from 'vue2-filters';
import { isNumber } from '@/utils/validation';

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
      selectedRow: {}
    };
  },
  methods: {
    claim(row) {
      this.selectedRow = row;
      this.$emit('claim', this.selectedRow.address);
    }
  }
};
</script>

<style>
</style>
