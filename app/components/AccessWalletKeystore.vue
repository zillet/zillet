<template>
  <div class="keystore">
    <div 
      class="keystore__head-actions" 
      @click="$emit('exit')">
      <i class="eva eva-arrow-back-outline" />  &nbsp;Other Methods
    </div>
    <p class="keystore__title">
      Select Your Keystore/JSON File
    </p>
    <div class="keystore__body">
      <span>
        If you must, please  <u>double-check the URL & SSL cert</u>.
        For additional security, <b>turn off your internet connection</b> prior to accessing/ creating a wallet.
      </span>
      <z-upload
        :name="fileName"
        class="mt-8"
        rounded
        @change="fileChanges"/>
      <div 
        v-if="isFile" 
        class="max-w-md mx-auto">
        <z-input
          v-model="passphrase"
          placeholder="Type your password"
          label="Your wallet is encrypted. Good! Please enter the password."
        />
        <z-alert 
          type="danger" 
          class="my-2">
          This is Zilliqa wallet. Do not send any 
          ERC-20 ZIL tokens to this wallet.
        </z-alert>
        <z-button 
          class="w-full" 
          rounded
          @click="unlock()">
          Unlock wallet
        </z-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: 'Keystore',
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
    ...mapActions(['importAccount', 'saveEncryptedWallet']),
    checkEncryptedWallet(file) {
      // todo - add more checks
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
              message: `Invalid file format, Please Select valid Keystore/wallet (JSON) File.`,
              type: 'danger'
            });
          } else {
            this.isFile = true;
          }
        };
        reader.readAsText(file);
      } catch (error) {
        return this.$notify({
          message: `Invalid file format, Please Select valid Keystore/wallet (JSON) File, ${error}`,
          type: 'danger'
        });
      }
    },
    async unlock() {
      this.loading = true;
      let keystore = JSON.parse(this.encryptedWallet);
      try {
        const pk = await this.$zil.crypto.decryptPrivateKey(
          this.passphrase,
          keystore
        );
        if (this.canSave) {
          this.saveEncryptedWallet(keystore);
        }
        this.importKey(pk);
      } catch (error) {
        return this.$notify({
          message: `Failed to decrypt, Please check your password.`,
          type: 'danger'
        });
        this.loading = false;
      }
    },
    importKey(pk) {
      this.importAccount(pk);
      this.$router.push({
        name: this.$route.query.redirect || 'send'
      });
      return this.$notify({
        message: `Wallet loaded successfully.`,
        type: 'success'
      });
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.keystore {
  &__head-actions {
    @apply flex items-center justify-start cursor-pointer;
    @apply text-base font-semibold text-gray-600;
    &:hover {
      @apply text-gray-700;
    }
    i {
      @apply font-bold;
    }
  }
  &__title {
    @apply text-grey-darkest my-4 text-2xl font-semibold;
  }
  &__body {
    @apply max-w-md;
    margin: auto;
  }
}
</style>
