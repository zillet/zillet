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
    </div>

  </div>

</template>
<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'AddressDetails',
  computed: {
    ...mapGetters(['getAccount'])
  },
  methods: {
    ...mapActions(['getBalance'])
  }
};
</script>

<style scoped>
.header {
  @apply text-grey-darkest text-xl align-middle mb-6;
}
.card {
  @apply rounded overflow-hidden shadow p-8 w-full bg-white;
}
.qr-code-btn {
  height: 20px;
  width: 20px;
}
.qr-code {
  width: 200px;
  margin: auto;
}
</style>
