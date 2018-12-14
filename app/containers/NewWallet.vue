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
          <!-- <nuxt-link 
            :to="{name: 'index'}" 
            class="text-teal text-sm">
            How to create a wallet
          </nuxt-link>
          &nbsp;
          &nbsp;
          ·  
          &nbsp;
          &nbsp; -->
          <nuxt-link 
            :to="{name: 'access-wallet'}" 
            class="text-teal text-sm">
            Already have wallet
          </nuxt-link>
        </div>
      </div>
    </div>
    <z-modal v-if="downloadModal">   
      <h3 class="header modal"> 
        Save Your Private Key
      </h3>
      <z-text-area 
        :value="privateKey" 
        readonly/>
      <z-button 
        :loading="loading" 
        :disabled="loading"
        class="w-64"
        @click="downloadWalletJson">
        <p>Download Keystore</p>
      </z-button>
      <z-button 
        :loading="loading" 
        :disabled="loading"
        class="w-64"
        @click="print">
        <p>Print Wallet</p>
      </z-button>
      <p class="text-sm text-grey-darker mb-4">
        <b>Do not lose it!</b> It cannot be recovered if you lose it.
      </p>
      <p class="text-sm text-grey-darker mb-4">
        <b>Do not share it!</b> Your funds will be stolen if you use this file on a malicious/phishing site.
      </p>
      <p class="text-sm text-grey-darker mb-4">
        <b>Make a backup!</b> Secure it like the millions of dollars it may one day be worth.
      </p>
      <z-button 
        :disabled="!isKeyDownloaded"
        class="w-full"
        type="default"
        @click="downloadModal=false">
        Okay, I've succesfully saved my key.
      </z-button>
    </z-modal>
  </div>
</template>
<script>
import { printWallet } from '@/utils/printWallet';

export default {
  name: 'NewWallet',
  data() {
    return {
      passphrase: '',
      isVisible: false,
      loading: false,
      downloadModal: false,
      address: '',
      encryptedWallet: '',
      isKeyDownloaded: false,
      privateKey: ''
    };
  },
  methods: {
    async create() {
      if (!this.passphrase || this.passphrase.length < 8) {
        return this.$notify({
          message: `Password should be atleast 8 chracter long`,
          type: 'danger'
        });
      } else {
        this.loading = true;
        this.privateKey = this.$zil.crypto.schnorr.generatePrivateKey();
        this.address = this.$zil.crypto.getAddressFromPrivateKey(
          this.privateKey
        );
        try {
          this.encryptedWallet = await this.$zil.crypto.encryptPrivateKey(
            'scrypt',
            this.privateKey,
            this.passphrase
          );
          // await this.downloadWalletJson(address, result);
          this.loading = false;
          this.downloadModal = true;
          this.passphrase = false;
        } catch (error) {
          this.loading = false;
          this.passphrase = false;
        }
      }
    },
    getWalletFilename(address) {
      return 'UTC--' + new Date().toJSON() + '.0--' + address + '.json';
    },
    downloadWalletJson() {
      let filename = this.getWalletFilename(this.address);
      let element = document.createElement('a');
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' +
          encodeURIComponent(this.encryptedWallet)
      );
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      this.isKeyDownloaded = true;
    },
    print() {
      var addressCanvas = document.createElement('CANVAS');
      var pkCanvas = document.createElement('CANVAS');
      const addressQr = this.$qr.toDataURL(
        addressCanvas,
        `0x${this.address}`,
        { width: 150 },
        error => {
          if (error) {
            throw error;
          }
        }
      );
      const pkQr = this.$qr.toDataURL(
        pkCanvas,
        `0x${this.privateKey}`,
        { width: 150 },
        error => {
          if (error) {
            throw error;
          }
        }
      );
      const paperWallet = printWallet(this.address, this.privateKey);
      let paperBody = document.createElement('BODY');
      paperBody.setAttribute('id', 'paper-wallet');
      paperBody.innerHTML = paperWallet;
      document.body.appendChild(paperBody);
      let addressDiv = document.getElementById('addresscanvas');
      addressDiv.appendChild(addressCanvas);
      let pkDiv = document.getElementById('pkcanvas');
      pkDiv.appendChild(pkCanvas);
      paperBody = document.getElementById('paper-wallet');
      var win = window.open('about:blank', '_blank');
      win.document.body = paperBody;
      setTimeout(() => {
        win.print();
      }, 1000);
    }
  }
};
</script>
<style scoped>
.modal {
  @apply mb-6;
}
</style>
