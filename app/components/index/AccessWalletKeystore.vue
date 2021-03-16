<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Select Your Keystore/JSON File
    </template>
    <z-upload
      :name="fileName"
      rounded
      @change="fileChanges" />
    <div
      v-if="isFile"
      class="max-w-2xl mx-auto">
      <z-input
        v-model="passphrase"
        placeholder="Type your password"
        label="Your wallet is encrypted. Good! Please enter the password."
      />
      <z-button
        class="w-full"
        rounded
        @click="unlock()">
        Unlock Wallet
      </z-button>
    </div>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import { decryptPrivateKey } from '@zilliqa-js/crypto';
export default {
  name: 'Keystore',
  props: {
    uid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      isFile: false,
      loading: false,
      passphrase: '',
      fileName: '',
      encryptedWallet: ''
    };
  },
  methods: {
    ...mapMutations(['importAccount', 'saveAccessType']),
    checkEncryptedWallet(file) {
      if (file == null) return false;
      try {
        let parsed = JSON.parse(file);
        if (!parsed.address || !parsed.crypto) {
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    },
    fileChanges(e) {
      let file = e.target.files[0];
      try {
        this.fileName = file.name;
        let reader = new FileReader();
        reader.onload = event => {
          this.encryptedWallet = event.target['result'];
          if (!this.checkEncryptedWallet(this.encryptedWallet)) {
            this.isFile = false;
            return this.$notify({
              message: `Invalid file format, please select valid keystore/wallet (JSON) file.`,
              type: 'danger'
            });
          } else {
            this.isFile = true;
          }
        };
        reader.readAsText(file);
      } catch (error) {
        return this.$notify({
          message: `Invalid file format, please select valid keystore/wallet (JSON) file, ${error}`,
          type: 'danger'
        });
      }
    },
    async unlock() {
      this.loading = true;
      let keystore = JSON.parse(this.encryptedWallet);
      try {
        const pk = await decryptPrivateKey(this.passphrase, keystore);
        this.$zillet.wallet.addByPrivateKey(pk);
        this.importAccount(this.$zillet.wallet.defaultAccount);
        this.$router.push({
          name: this.$route.query.redirect || 'send'
        });
        this.saveAccessType(this.uid);
        return this.$notify({
          message: `Wallet loaded successfully.`,
          type: 'success'
        });
      } catch (error) {
        return this.$notify({
          message: `Failed to decrypt, please check your password.`,
          type: 'danger'
        });
        this.loading = false;
      }
    }
  }
};
</script>
