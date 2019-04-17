<template>
  <div class="w-full">
    <div 
      class="card">
      <h3 class="header mb-8"> 
        How would you like to access your wallet?
      </h3>
      <div class="radio-btn-wrapper ">
        <div 
          aria-flowto="aria5" 
          class="flex flex-row px-4" >
          <input 
            id="json" 
            v-model="walletType"
            type="radio" 
            aria-label="Import JSON Keystore" 
            value="json"
            name="json">
          <label 
            class="block text-grey-darkest ml-2" 
            for="json">
            Import Keystore/JSON File
          </label>
        </div>
        <div 
          aria-flowto="aria5" 
          class="flex flex-row px-4">
          <input 
            id="privatekey" 
            v-model="walletType"
            type="radio"
            aria-label="Private Key" 
            value="pk" 
            name="pk">
          <label 
            class="block text-grey-darkest ml-2" 
            for="privatekey">
            Enter Private Key
          </label>
        </div>
      </div>
      <div class="my-8 max-w-md mx-auto">
        <p 
          v-if="walletType"
          class="subheading">
          {{
            walletType ==='pk' ? 'Paste Your Private Key' : 'Select Your Keystore/JSON File'
          }}
        </p>
        <span class="text-sm text-grey-darkest">
          If you must, please  <u>double-check the URL & SSL cert</u>. 
          For additional security, <b>turn off your internet connection</b> prior to accessing/ creating a wallet.
        </span>
      </div>
      <div 
        v-if="walletType==='json'" 
        class="max-w-md mx-auto">
        <z-upload
          :name="fileName"
          @change="fileChanges"/>
        <div 
          v-if="isFile" 
          class="max-w-md mx-auto">
          <z-input
            v-model="passphrase"
            placeholder="Type your password"
            label="Your wallet is encrypted. Good! Please enter the password."
          />
          <z-alert type="danger">
            This is Zilliqa wallet. Do not send any 
            ERC-20 ZIL tokens to this wallet.
          </z-alert>
          <div 
            class="cursor-pointer mb-4 mt-6 flex items-center text-sm text-grey-darkest" 
            @click="canSave=!canSave">
            <input 
              :checked="canSave" 
              type="checkbox"> &nbsp; &nbsp;Remember my wallet details, Locally in this browser.
          </div>
          <z-button 
            class="w-full" 
            @click="unlock()">
            Unlock wallet
          </z-button>
        </div>
      </div>
      <div 
        v-else-if="walletType==='pk'" 
        class="max-w-md mx-auto">
        <z-input
          v-model="privateKey"
          placeholder="Enter your private key here"
          label="Private Key"
        />
        <z-alert type="warning">
          This is Zilliqa wallet. Do not send any 
          ERC-20 ZIL tokens to this wallet.
        </z-alert>
        <z-button @click="validateKey()">
          Load wallet
        </z-button>
      </div>
      <Footer>
        <nuxt-link 
          :to="{name: 'index'}" 
          class="text-teal text-sm font-semibold">
          Create New wallet
        </nuxt-link>
      </Footer>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import Footer from '@/components/Footer';
export default {
  name: 'LoadWallet',
  components: {
    Footer
  },
  data() {
    return {
      isFile: false,
      loading: false,
      walletType: '',
      passphrase: '',
      fileName: '',
      privateKey: '',
      encryptedWallet: '',
      canSave: false
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
    validateKey() {
      if (!this.$zil.util.validation.isPrivateKey(this.privateKey)) {
        return this.$notify({
          message: `Invalid private key`,
          type: 'danger'
        });
      } else {
        this.importKey(this.privateKey);
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
        name: this.$route.query.redirect || 'wallet-info'
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
<style scoped>
.radio-btn-wrapper {
  @apply flex flex-wrap mb-1 justify-center font-semibold;
}
.subheading {
  @apply text-grey-darkest mb-8 text-2xl;
}
</style>
