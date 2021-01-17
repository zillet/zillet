<template>
  <div class="flex flex-row justify-start w-full bg-gray-200 mobile:flex-wrap">
    <a
      href="javascript:void(0)"
      class="flex-1 py-3 max-w-xss px-4 text-gray-800 font-semibold border-b-4  border-gray-500
      flex items-center"
      :class="{'border-primary text-primary border rounded-t': $route.name=='send'}"
      @click="$emit('tabSelected', 'send')">
      <i class="eva eva-diagonal-arrow-right-up-outline font-semibold mr-2" />
      <span>Send </span>
    </a>
    <a
      href="javascript:void(0)"
      class="flex-1 py-3 max-w-xss px-4 text-gray-800  font-semibold border-b-4 border-gray-500
      flex items-center"
      :class="{'border-primary text-primary border rounded-t': $route.name=='transactions'}"
      @click="$emit('tabSelected', 'transactions')">
      <i class="eva eva-clock-outline font-semibold mr-2" />
      <span>Transactions</span>
      <span
        v-if="pendingTx> 0"
        style="top: -5px;left: -3px;transform: scale(.85);"
        class="relative ml-1 bg-primary h-4 w-8 rounded-full
             text-xs text-white flex items-center font-normal justify-center">
        {{ pendingTx }}
      </span>
    </a>
    <a
      href="javascript:void(0)"
      class="flex-1 py-3 max-w-xss px-4 text-gray-800  font-semibold border-b-4 border-gray-500
      flex items-center"
      :class="{'border-primary text-primary border rounded-t': $route.name=='tokens'}"

      @click="$emit('tabSelected', 'tokens')">
      <i
        class="eva eva-layers-outline font-semibold mr-2" />
      <span>Tokens</span>
    </a>
    <a
      href="javascript:void(0)"
      class="flex-1 py-3 max-w-xss px-4 text-gray-800  font-semibold border-b-4 border-gray-500
      flex items-center"
      :class="{'border-primary text-primary border rounded-t': $route.name=='staking'}"

      @click="$emit('tabSelected', 'staking')">
      <i
        class="eva eva-gift-outline font-semibold mr-2" />
      <span>Staking</span>
      <span
        style="top: -5px;left: -3px;transform: scale(.85);"
        class="relative ml-1 bg-primary h-4 w-8 rounded-full
             text-xs text-white flex items-center font-normal justify-center">
        New
      </span>
    </a>
    <a
      href="javascript:void(0)"
      :class="{'border-primary text-primary border rounded-t': $route.name=='info'}"
      
      class="flex-1 flex-grow py-3 px-4 text-gray-800 font-semibold border-b-4 border-gray-500
      flex items-center justify-end"
      @click="$emit('tabSelected', 'info')">
      <i
        class="eva eva-alert-circle-outline  font-semibold mr-2" />
      <span>  Wallet Info</span>
    </a>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'NavigationTab',
  computed: {
    ...mapGetters(['pendingTx'])
  }
};
</script>
<style lang="scss" scoped>
.wallet-info-btn {
  @include no-select;
  @apply flex items-center justify-center font-semibold cursor-pointer;
  padding-bottom: calc(0.5rem + 3px);
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  white-space: nowrap;
  -webkit-touch-callout: none;
  &.selected {
    padding-bottom: calc(0.5rem);
    border-bottom: 3px solid $primary;
    @apply text-primary;
  }
  &:hover {
    outline: 0;
    @apply text-gray-800;
  }
  @media (max-width: 510px) {
    padding: 5px;
    border-radius: 5px;
    @apply flex flex-col items-center justify-between;
    @apply font-semibold text-sm;
    border: 0px !important;
    margin-bottom: 0.5rem;
    &.selected {
      padding-bottom: 5px;
      background: rgba(0, 0, 0, 0.08);
      @apply text-primary;
    }
  }
}
.max-w-xss {
  max-width: 10rem;
}
</style>
