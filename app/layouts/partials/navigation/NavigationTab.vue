<template>
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
      :checked="$route.name=='info'"
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
        @click="$emit('tabSelected', 'info')">
        <label
          for="tab3"
          role="button">
          <i class="eva eva-eye-outline font-semibold mr-2" />
          <span>Wallet Info</span>
        </label>
      </li>
      <!-- <li
        title="Wallet Info"
        @click="$emit('tabSelected', 'contract')">
        <label
          for="tab3"
          role="button">
          <i class="eva eva-eye-outline font-semibold mr-2" />
          <span>Contract</span>
        </label>
      </li> -->
    </ul>
    <div class="slider">
      <div class="indicator" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavigationTab'
};
</script>
<style lang="scss" scoped>
</style>
