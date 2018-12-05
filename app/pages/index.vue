<template>
  <new-wallet />
</template>

<script>
import NewWallet from '@/containers/NewWallet';
export default {
  name: 'Home',
  components: {
    'new-wallet': NewWallet
  },
  mounted() {}
};
</script>
