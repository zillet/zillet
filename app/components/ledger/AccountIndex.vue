<template>
  <z-modal
    :visible="visible"
    custom-class="p-8"
    @close="$emit('close')">
    <h3 class="font-semibold text-xl mb-8 text-gray-800">
      Select Acount
    </h3>
    <z-table
      :data="accounts"
      @rowClicked="rowClicked">
      <template
        slot-scope="scope"
        class="hover:bg-gray-100">
        <z-table-column
          label="Index"
          @click="rowClicked(scope.row)">
          <div class="font-semibold">
            #{{ scope.row.index }}
          </div>
        </z-table-column>
        <z-table-column
          label="Address"
          @click="rowClicked(scope.row)">
          <div class="flex items-center justify-start">
            <jazzicon
              :diameter="16"
              :address="scope.row.base16Address"
              class="mt-1 mr-2" />
            <h3 class="truncate font-semibold">
              {{ `${scope.row.pubAddr}` }}
            </h3>
          </div>
        </z-table-column>
        <z-table-column
          label="Balance">
          <div
            class="font-bold">
            {{ scope.row.balance }}
          </div>
        </z-table-column>
        <z-table-column
          class="mobile:hidden"
          label="">
          <a
            :href="explorerLink(scope.row.pubAddr)"
            class="text-secondry hover:text-gray-900"
            target="_blank">
            <i
              class="eva eva-external-link-outline relative"
              style="top:2px" />
          </a>
        </z-table-column>
      </template>
    </z-table>
    <div class="flex">
      <z-button
        rounded
        type="default"
        size="medium"
        class="w-full mt-12 mb-0 flex next-btn"
        @click="$emit('addAccount')">
        Next Account <i class="ml-2 eva eva-arrow-forward-outline font-bold" />
      </z-button>
      <div style="width:50px;" />
      <z-button
        rounded
        size="medium"
        class="w-full mt-12 mb-0 flex next-btn"
        @click="$emit('access', accounts[0])">
        Use Default (#0 Index)
      </z-button>
    </div>
  </z-modal>
</template>
<script>
import { mapState } from 'vuex';
import ZilliqaHW from '@/utils/ledger';
import { fromBech32Address } from '@zilliqa-js/crypto';

export default {
  props: {
    visible: {
      default: false,
      type: [Boolean, String]
    },
    accounts: {
      required: true,
      type: [Array, Object]
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      selectedNode: state => state.selectedNode
    })
  },
  methods: {
    rowClicked(row, index, col) {
      this.$emit('access', row);
    },
    explorerLink(address) {
      return this.selectedNode.id === 1002
        ? `${this.selectedNode.explorer}address/${address}?network=testnet`
        : `${this.selectedNode.explorer}address/${address}`;
    }
  }
};
</script>
