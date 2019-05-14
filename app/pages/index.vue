<template>
  <div>
    <transition
      name="fade"
      mode="out-in">
      <AccessWallet
        v-if="accessMethodId===0"
        @wallet="selectAccessMethod" />
    </transition>
    <transition
      name="fade"
      mode="out-in">
      <PrivateKey
        v-if="accessMethodId===1001"
        @exit="accessMethodId=0" />
      <Keystore
        v-else-if="accessMethodId===1002"
        @exit="accessMethodId=0" />
      <Mnemonic
        v-else-if="accessMethodId===1003"
        @exit="accessMethodId=0" />
    </transition>
  </div>
</template>
<script>
import AccessWallet from '@/components/index/AccessWallet';
import PrivateKey from '@/components/index/AccessWalletPrivateKey';
import Keystore from '@/components/index/AccessWalletKeystore';
import Mnemonic from '@/components/index/AccessWalletMnemonic';

export default {
  name: 'Index',
  components: {
    AccessWallet,
    PrivateKey,
    Keystore,
    Mnemonic
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
