<template>
  <div
    class="card">
    <h3 class="header">
      Address Details
    </h3>
    <div class="text-left">
      <label
        class="block tracking-wide text-grey-darker text-sm mb-2" >
        Account Address
      </label>
      <div class="break-words flex align-center">
        <z-blockies 
          :seed="getAccount.address" 
          class="w-10 h-10 rounded-full mr-4 my-2"/>
        <p
          style="width:calc(100% - 2.5rem)"
          class="leading-normal font-bold
           text-grey-darkest mb-4">
          0x{{ getAccount.address }}
        </p>
      </div>
    </div>
    <div class="text-left">
      <label
        class="block tracking-wide text-grey-darker text-sm mb-2" >
        Account Balance
      </label>
      <p
        class="leading-normal font-bold text-xl
        text-grey-darkest mb-4 break-words">
        {{ getAccount.balance }} ZIL
        <span
          class="text-xs italic text-left inline-block
          align-middle text-grey-darker font-normal underline cursor-pointer hover:text-teal"
          @click="getBalance(getAccount.address)">
          Refresh
        </span>
      </p>
      <label
        class="block tracking-wide text-grey-darker text-sm mb-4" >
        Equivalent Balance
      </label>
      <div class="flex flex-wrap -mx-2">
        <div 
          v-for="(price, symbol) in getPrices" 
          :key="symbol" 
          class="w-1/2 px-2 text-grey-darkest mb-4">
          <span class="tracking-wide text-sm">{{ symbol }}:</span> 
          <span class="font-semibold">{{ equivalentBal(symbol, price) }} </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'AddressDetails',
  computed: {
    ...mapGetters(['getAccount', 'getPrices'])
  },
  methods: {
    ...mapActions(['getBalance']),
    equivalentBal(symbol, price) {
      const bal = price * this.getAccount.balance;
      if (symbol === 'ETH' || symbol === 'BTC') {
        return bal && bal.toFixed(3);
      } else {
        return bal && bal.toFixed(2);
      }
    }
  }
};
</script>
<style scoped>
.header {
  @apply mb-6;
}
</style>
