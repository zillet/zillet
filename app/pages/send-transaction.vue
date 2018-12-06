<template>
  <div class="flex flex-wrap w-full max-w-xl -mx-2">
    <div class="flex-1 w-full px-2">
      <send-transaction-form />
    </div>
    <div class="w-full max-w-msm px-2">
      <address-details />
    </div>
  </div>
</template>
<script>
import AddressDetails from '@/containers/AddressDetails';
import SendTransactionForm from '@/containers/SendTransactionForm';
export default {
  name: 'Home',
  middleware: 'ifKeyExists',
  components: {
    'address-details': AddressDetails,
    'send-transaction-form': SendTransactionForm
  }
};
</script>
