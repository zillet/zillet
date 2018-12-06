<template>
  <div class="max-w-xl w-full">
    <div 
      class="card">
      <h3 class="header"> 
        Generate your own Zilliqa wallet instantly!
      </h3>
      <z-input
        v-model="passphrase"
        :valid="passphrase.length > 7"
        class="w-full mx-auto max-w-md"
        label="Enter a password"
        placeholder="Do not forget this password"/>
      <p class="text-grey-darker max-w-md mx-auto -mt-2 mb-4 text-xs italic text-left">
        Password should be atleast 8 chracter long
      </p>
      <z-button 
        :loading="loading" 
        :disabled="loading"
        @click="create">
        Create New Wallet
      </z-button>
      <div class="max-w-md mx-auto">
        <span class="text-sm text-grey-darkest">
          This password <b>encrypts</b> your private key. 
          This does not act as a seed to generate your keys. 
          <b>You will need this password + your private key to unlock your wallet.</b>
        </span>
        <br >
        <div class="footer">
          <nuxt-link 
            :to="{name: 'index'}" 
            class="text-teal text-sm">
            How to create a wallet
          </nuxt-link>
          &nbsp;
          &nbsp;
          ·  
          &nbsp;
          &nbsp;
          <nuxt-link 
            :to="{name: 'access-wallet'}" 
            class="text-teal text-sm">
            Already have wallet
          </nuxt-link>
        </div>
      </div>
    </div>   
  </div>

</template>
<script>
export default {
  name: 'NewWallet',
  data() {
    return {
      passphrase: '',
      isVisible: false,
      loading: false
    };
  },
  methods: {
    getWalletFilename(address) {
      return 'UTC--' + new Date().toJSON() + '.0--' + address + '.json';
    },
    downloadWalletJson(address, walletJson) {
      let filename = this.getWalletFilename(address);
      let element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(walletJson)
      );
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    async create() {
      if (!this.passphrase || this.passphrase.length < 8) {
        return this.$notify({
          message: `Password should be atleast 8 chracter long`,
          type: 'danger'
        });
      } else {
        this.loading = true;
        const pk = this.$zil.crypto.generatePrivateKey();
        const address = this.$zil.crypto.getAddressFromPrivateKey(pk);
        try {
          const result = await this.$zil.crypto.encryptPrivateKey(
            'scrypt',
            pk,
            this.passphrase
          );
          await this.downloadWalletJson(address, result);
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      }
    }
  }
};
</script>
<style>
</style>
