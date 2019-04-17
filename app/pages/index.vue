<template>
  <div class="w-full">
    <div class="card">
      <transition 
        name="fade" 
        mode="out-in">
        <AccessWallet 
          v-if="accessMethodId==0" 
          @wallet="selectAccessMethod" />
      </transition>
      <transition 
        name="fade" 
        mode="out-in">
        <PrivateKey 
          v-if="accessMethodId==1001" 
          @exit="accessMethodId=0"/>
        <Keystore 
          v-else-if="accessMethodId==1002" 
          @exit="accessMethodId=0"/>
      </transition>
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
<style lang="scss" scoped>
.fade-enter-active {
  position: relative;
  top: 0;
  transition: all 0.3s;
}
.fade-leave-active {
  opacity: 0;
  display: none;
  // transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  position: relative;
  top: 4px;
}
</style>
