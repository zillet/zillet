<template>
  <z-modal
    :visible="visible"
    @close="$emit('close')">
    <h3 class="font-bold text-xl mb-8 mt-4">
      Transaction Sent
    </h3>
    <div class="flex flex-col px-8">
      <z-icon type="success" />
      <span class="text-base leading-normal font-semibold">
        {{ `0x${tranxId}` }}
      </span>
      <div
        class="mt-4 mt-2 text-sm italic">
        * Your balance will be updated after transaction got confirmed.
      </div>
      <div class="flex flex-row -mx-2">
        <div class="w-1/2 px-2">
          <z-button
            class="w-full mt-8"
            type="default"
            rounded
            @click="$emit('close')">
            Okay, Got it.
          </z-button>
        </div>
        <div class="w-1/2 px-2">
          <a
            :href="openTxOnVb(selectedNode, `0x${tranxId}`)"
            target="_blank"
            rounded
            class="w-full flex-1">
            <z-button
              rounded
              class="mt-8 w-full">
              Check on Explorer
            </z-button>
          </a>
        </div>
      </div>
    </div>
  </z-modal>
</template>

<script>
import { mapState } from 'vuex';
import { openTxOnVb } from '@/utils';

export default {
  name: 'AddToken',
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    tranxId: {
      required: true,
      type: [String, Object]
    }
  },
  computed: {
    ...mapState({
      selectedNode: state => state.selectedNode
    })
  },
  methods: {
    openTxOnVb
  }
};
</script>

<style>
</style>
