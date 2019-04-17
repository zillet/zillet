<template>
  <div class="w-full">
    <div class="card">
      <AccessWallet 
        v-if="accessMethodId==0" 
        @wallet="selectAccessMethod" />
      <PrivateKey 
        v-else-if="accessMethodId==1001" 
        @exit="accessMethodId=0"/>
      <Keystore 
        v-else-if="accessMethodId==1002" 
        @exit="accessMethodId=0"/>
    </div>
  </div>
</template>
<script>
import AccessWallet from '@/components/AccessWallet';
import PrivateKey from '@/components/AccessWalletPrivateKey';
import Keystore from '@/components/AccessWalletKeystore';

export default {
  name: 'Index',
  components: {
    AccessWallet,
    PrivateKey,
    Keystore
  },
  data() {
    return {
      accessMethodId: 0
    };
  },
  methods: {
    selectAccessMethod(id) {
      this.accessMethodId = id;
    }
  }
};
</script>
