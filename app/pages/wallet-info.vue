<template>
  <wallet-info />
</template>
<script>
import WalletInfo from '@/containers/WalletInfo';
export default {
  name: 'Home',
  middleware: 'ifKeyExists',
  components: {
    'wallet-info': WalletInfo
  }
};
</script>
