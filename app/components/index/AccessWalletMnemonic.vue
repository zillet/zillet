<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Enter Your Mnemonic Phrase
    </template>
   
    <div class="w-full flex items-center justify-between mb-4">
      <div class="uppercase font-semibold ">
        Mnemonic Phrase
      </div>
      <div>
        <ZSelect
          :show-all="false"
          :data="mnemonicTypes"
          field="name"
          @change="typeChange" />
      </div>
    </div>
    <z-textarea
      v-model="mnemonicPhrase"
      :valid="isMnemonicValid(mnemonicPhrase)"
      :placeholder="selectedType ===2 ? `Enter your 24 character ledger Mnemonic phrase here`: `Enter your Mnemonic phrase here`"
      class="mnemonic-textarea"
    />
    <div v-if="selectedType==1">
      <z-input
        v-model="passphrase"
        placeholder="Type your password"
        label="Type your password"
      />
      <z-alert
        type="warning"
        class="my-2">
        This is not the password you set in the Moonlet or ZilPay wallet, 
        In most of the cases you need default method.
      </z-alert>
    </div>
    <div v-if="selectedType==2">
      <z-input
        v-model="index"
        placeholder="Index"
        :hide="false"
        number
        label="Index of ledger wallet (Default = 0)"
      />
    </div>
    <z-button
      id="private-key"
      rounded
      class="w-full"
      @click="loadWallet()">
      Load wallet
    </z-button>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
const bip39 = require('bip39');
const hdkey = require('hdkey');
import { isMnemonicValid } from '@/utils/validation';
export default {
  name: 'PrivateKey',
  props: {
    uid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      mnemonicPhrase: '',
      passphrase: '',
      index: 0,
      isLedger: false,
      showDropDown: false,
      selectedType: 0,
      mnemonicTypes: [
        {
          name: 'Default',
          key: 0
        },
        {
          name: 'Password Based',
          key: 1
        },
        {
          name: 'Ledger Based',
          key: 2
        }
      ]
    };
  },
  mounted() {
    this.selectedType = this.mnemonicTypes[0];
  },
  methods: {
    ...mapMutations(['importAccount', 'saveAccessType']),
    isMnemonicValid,
    typeChange(e) {
      try {
        let val = JSON.parse(e.target.value);
        this.selectedType = val.key;
      } catch (error) {
        console.log(error);
      }
    },
    async loadWallet() {
      if (!this.isMnemonicValid(this.mnemonicPhrase)) {
        return this.$notify({
          message: `Invalid Mnemonic Phrase`,
          type: 'danger'
        });
      } else {
        if (this.selectedType == 1) {
          const seed = await bip39.mnemonicToSeedSync(
            this.mnemonicPhrase,
            this.passphrase
          );
          const hdKey = hdkey.fromMasterSeed(seed);
          const childKey = hdKey.derive(`m/44'/313'/0'/0/${this.index}`);
          const privateKey = childKey.privateKey.toString('hex');
          this.$zillet.wallet.addByPrivateKey(privateKey);
        } else if (this.selectedType == 2) {
          const seed = await bip39.mnemonicToSeedSync(this.mnemonicPhrase, '');
          const hdKey = hdkey.fromMasterSeed(seed);
          const childKey = hdKey.derive(`m/44'/313'/${this.index}'/0'/0'`);
          const privateKey = childKey.privateKey.toString('hex');
          this.$zillet.wallet.addByPrivateKey(privateKey);
        } else {
          this.$zillet.wallet.addByMnemonic(this.mnemonicPhrase, this.index);
        }
        this.importAccount(this.$zillet.wallet.defaultAccount);
        this.saveAccessType(this.uid);
        this.$router.push({
          name: this.$route.query.redirect || 'send'
        });
        return this.$notify({
          message: `Wallet loaded successfully.`,
          type: 'success'
        });
      }
    }
  }
};
</script>
<style lang="scss">
.mnemonic-textarea textarea {
  font-family: Menlo, Monaco, Consolas, Courier New, monospace !important;
  letter-spacing: 0.02em;
  &::placeholder {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
  }
}
</style>
