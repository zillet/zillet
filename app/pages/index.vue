<template>
  <div class="w-full">
    <div class="card">
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
          :uid="1001"
          @exit="accessMethodId=0" />
        <Keystore
          v-else-if="accessMethodId===1002"
          :uid="1002"
          @exit="accessMethodId=0" />
        <Mnemonic
          v-else-if="accessMethodId===1003"
          :uid="1003"
          @exit="accessMethodId=0" />
        <Zilpay
          v-else-if="accessMethodId===1004"
          :uid="1004"
          @exit="accessMethodId=0" />
        <Moonlet
          v-else-if="accessMethodId===1005"
          :uid="1005"
          @exit="accessMethodId=0" />
        <Ledger
          v-else-if="accessMethodId===1006"
          :uid="1006"
          @exit="accessMethodId=0" />
      </transition>
    </div>
  </div>
</template>
<script>
import AccessWallet from '@/components/index/AccessWallet';
import PrivateKey from '@/components/index/AccessWalletPrivateKey';
import Keystore from '@/components/index/AccessWalletKeystore';
import Mnemonic from '@/components/index/AccessWalletMnemonic';
import Zilpay from '@/components/index/AccessWalletZilpay';
import Moonlet from '@/components/index/AccessWalletMoonlet';
import Ledger from '@/components/index/AccessWalletLedger';

export default {
  name: 'Index',
  components: {
    AccessWallet,
    PrivateKey,
    Keystore,
    Mnemonic,
    Zilpay,
    Moonlet,
    Ledger
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
