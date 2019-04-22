<template>
  <div class="create-wallet">
    <div class="card">
      <div class="create-wallet__header">
        <h3> 
          Generate your own Zilliqa wallet instantly!
        </h3>
      </div>
      <div class="create-wallet__body">
        <z-input
          v-model="passphrase"
          :valid="passphrase.length > 7"
          class="w-full"
          label="Enter a password"
          placeholder="Do not forget this password"/>
        <p class="text-grey-darker max-w-md mx-auto -mt-2 mb-4 text-sm italic text-left font-semibold">
          Password should be atleast 8 chracter long
        </p>
        <z-button 
          :loading="loading" 
          :disabled="loading"
          rounded
          @click="create">
          Create New Wallet
        </z-button>
        <div class="">
          <span class="text-grey-darkest">
            This password <b>encrypts</b> your private key. 
            This does not act as a seed to generate your keys. 
            <b>You will need this password + your private key to unlock your wallet.</b>
          </span>
          <br >
        </div>
        <p class="font-semibold text-gray-700 mt-8">Already have a wallet? 
          <nuxt-link 
            :to="{name: 'index'}"
            class="text-teal">Access now
          </nuxt-link>
        </p>
      </div>
    </div>
    {{ downloadModal }}
    <DownloadWallet 
      :visible="downloadModal" 
      :pk="privateKey" 
      :key-saved="isKeyDownloaded"
      @printWallet="print" 
      @downloadKeystore="downloadWalletJson"
      @close="downloadModal = false" />
  </div>
</template>
<script>
import { printWallet } from '@/utils/printWallet';
import DownloadWallet from '@/components/DownloadWallet';
export default {
  name: 'NewWallet',
  components: {
    DownloadWallet
  },
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
      this.isKeyDownloaded = false;
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
          this.passphrase = '';
        } catch (error) {
          this.loading = false;
          this.passphrase = '';
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
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
.create-wallet {
  @apply w-full;
  &__header {
    @apply mb-8;
    h3 {
      @apply font-bold text-2xl mb-4 text-gray-700;
    }
    p {
      @apply text-base;
    }
  }
  &__body {
    @apply max-w-md;
    margin: auto;
  }
}
</style>
