<template>
  <div class="create-wallet">
    <div class="card">
      <div class="create-wallet__header">
        <h3 class="mb-6">
          Generate your own Zilliqa wallet instantly!
        </h3>
        <div class="flex flex-row justify-center">
          <div
            aria-flowto="aria5"
            class="flex flex-row px-4 items-center">
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
              By Keystore/JSON File
            </label>
          </div>
          <div
            aria-flowto="aria5"
            class="flex flex-row px-4 items-center">
            <input
              id="mnemonic"
              v-model="walletType"
              type="radio"
              aria-label="Private Key"
              value="mnemonic"
              name="mnemonic">
            <label
              class="block text-grey-darkest ml-2"
              for="mnemonic">
              By Mnemonic Phrase
            </label>
          </div>
        </div>
      </div>
      <div class="create-wallet__body">
        <z-input
          v-model="passphrase"
          :valid="passphrase.length > 7"
          class="w-full"
          label="Set a password"
          placeholder="Do not forget this password" />
        <p class="text-gray-700 -mt-1 text-left text-sm italic text-left">
          Password should be atleast 8 chracter long
        </p>
        <z-button
          :loading="loading"
          :disabled="loading"
          class="my-8"
          rounded
          @click="create">
          Create New Wallet
        </z-button>
        <div class="">
          <span class="text-gray-800">
            This password <span class="font-semibold">encrypts</span> your
            private key. This does not act as a seed to generate your keys.
            You will need this
            <span
              v-if="walletType==='json'"
              class="font-semibold">Password + Keystore File </span>
            <span
              v-if="walletType==='mnemonic'"
              class="font-semibold">Password + Mnemonic Phrase </span>
            to unlock your wallet.
          </span>
          <br>
        </div>
        <p class="text-gray-700 mt-8">
          Already have a wallet?
          <nuxt-link
            :to="{ name: 'index' }"
            class="text-teal-500 font-semibold">
            Access now
          </nuxt-link>
        </p>
      </div>
    </div>
    <DownloadKeystoreFile
      :visible="downloadKeystoreModal"
      :pk="privateKey"
      :key-saved="isKeyDownloaded"
      @print="printPk"
      @download="downloadWalletJson"
      @close="downloadKeystoreModal = false"
    />
    <DownloadMnemonicPhrase
      :visible="downloadMnemonicModal"
      :phrase="phrase"
      :key-saved="isKeyDownloaded"
      @print="printSeed"
      @download="downloadWalletJson"
      @close="downloadMnemonicModal = false"
    />
  </div>
</template>
<script>
import { printKeystore, printMnemonic } from '@/utils/print';
import DownloadKeystoreFile from '@/components/DownloadKeystoreFile';
import DownloadMnemonicPhrase from '@/components/DownloadMnemonicPhrase';
// cube village gate curious enforce blur yard equal weekend bronze voice name
const bip39 = require('bip39');
export default {
  name: 'NewWallet',
  components: {
    DownloadKeystoreFile,
    DownloadMnemonicPhrase
  },
  data() {
    return {
      passphrase: '',
      loading: false,
      downloadKeystoreModal: false,
      downloadMnemonicModal: false,
      address: '',
      encryptedWallet: '',
      isKeyDownloaded: false,
      privateKey: '',
      walletType: 'json',
      phrase: ''
    };
  },
  methods: {
    sleep(milisec) {
      return new Promise(resolve => setTimeout(resolve, milisec));
    },
    async create() {
      this.isKeyDownloaded = false;
      if (!this.passphrase || this.passphrase.length < 8) {
        return this.$notify({
          message: `Password should be atleast 8 chracter long`,
          type: 'danger'
        });
      }
      if (this.walletType === 'json') {
        this.loading = true;
        await this.generatePk();
        this.loading = false;
      } else {
        this.loading = true;
        // generate BIP39
        this.phrase = await bip39.generateMnemonic();
        this.downloadMnemonicModal = true;
        this.passphrase = '';
        this.loading = false;
      }
    },
    async generatePk() {
      this.privateKey = this.$zil.crypto.schnorr.generatePrivateKey();
      this.address = this.$zil.crypto.getAddressFromPrivateKey(this.privateKey);
      try {
        this.encryptedWallet = await this.$zil.crypto.encryptPrivateKey(
          'scrypt',
          this.privateKey,
          this.passphrase
        );
        // await this.downloadWalletJson(address, result);
        this.loading = false;
        this.downloadKeystoreModal = true;
        this.passphrase = '';
      } catch (error) {
        this.loading = false;
        this.passphrase = '';
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
    printSeed() {
      const paperWallet = printMnemonic(this.phrase);
      let paperBody = document.createElement('BODY');
      paperBody.innerHTML = paperWallet;
      var win = window.open('about:blank', '_blank');
      this.isKeyDownloaded = true;
      win.document.body = paperBody;
      setTimeout(() => {
        win.print();
      }, 500);
    },
    printPk() {
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
      const paperWallet = printKeystore(this.address, this.privateKey);
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
      @apply font-semibold text-2xl mb-4 text-gray-800;
    }
    p {
      @apply text-base;
    }
  }
  &__body {
    @apply max-w-2xl;
    margin: auto;
  }
}
</style>
