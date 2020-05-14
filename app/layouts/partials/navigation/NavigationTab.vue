<template>
  <div class="flex flex-row justify-between w-full">
    <div class="tabs">
      <input
        id="tab1"
        :checked="$route.name=='send'"
        type="radio"
        name="tab-control">
      <input
        id="tab2"
        :checked="$route.name=='transactions'"
        type="radio"
        name="tab-control">
      <input
        id="tab3"
        :checked="$route.name=='tokens'"
        type="radio"
        name="tab-control">
      <ul>
        <li
          title="Send Zilliqa"
          @click="$emit('tabSelected', 'send')">
          <label
            for="tab1"
            role="button">
            <i class="eva eva-diagonal-arrow-right-up-outline font-semibold mr-2" />
            <span>Send </span>
          </label>
        </li>
        <li
          title="Transactions"
          @click="$emit('tabSelected', 'transactions')">
          <label
            for="tab2"
            role="button">
            <i class="eva eva-clock-outline font-semibold mr-2" />
            <span>Transactions</span>
          </label>
        </li>
        <li
          title="Wallet Info"
          @click="$emit('tabSelected', 'tokens')">
          <label
            for="tab3"
            role="button">
            <i
              class="eva eva-layers-outline font-semibold mr-2" />
            <span>Tokens</span>
          </label>
        </li>
      </ul>
      <div
        v-if=" $route.name!='info'"
        class="slider">
        <div class="indicator" />
      </div>
    </div>
    <div
      class="wallet-info-btn"
      :class="{'selected': $route.name=='info'}"
      @click="$emit('tabSelected', 'info')">
      <i
        class="eva eva-alert-circle-outline  font-semibold mr-2" />
      <span>  Wallet Info</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavigationTab'
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
</style>
