<template>
  <div>
    <MainContainer>
      <template v-slot:title>
        Generate your own Zilliqa wallet instantly!
      </template>
      <!-- //header -->
      <div class="flex flex-row mobile:flex-col justify-center mb-8">
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
            class="block cursor-pointer text-grey-darkest ml-2"
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
            class="block cursor-pointer text-grey-darkest ml-2"
            for="mnemonic">
            By Mnemonic Phrase
          </label>
        </div>
      </div>
      <!-- // body -->
      <div class="flex justify-start flex-col w-full items-start">
        <z-input
          v-model="passphrase"
          :valid="passphrase.length > 7"
          class="w-full"
          :label="walletType==='json' ? 'Set a password' : 'Set a password (Optional)'"
          placeholder="Do not forget this password" />
        <p
          v-if="walletType==='json'"
          class="text-gray-700 -mt-1 text-left text-sm italic text-left">
          Password should be atleast 8 chracter long
        </p>
        <p
          v-else
          class="text-gray-700 -mt-1 text-left text-sm italic text-left">
          This password field is optional for Mnemonic Phrase.
        </p>
      </div>
      <z-button
        :loading="loading"
        :disabled="loading"
        class="mt-6 w-full"
        rounded
        @click="create">
        Create New Wallet
      </z-button>
      <template v-slot:articles>
        <ZLink
          v-if="walletType==='mnemonic'"
          to="/security/mnemonic-phrase-password"
          external>
          Should I include password in Mnemonic phrase
        </ZLink>
        <span v-if="walletType==='mnemonic'">
          and
        </span>
        <ZLink
          to="/getting-started/how-to-create-a-wallet"
          external>
          How to Create a Wallet
        </ZLink>
      </template>
      <template v-slot:warning>
        <p>
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
        </p>
      </template>
      <template v-slot:footer>
        Already have a wallet?
        <nuxt-link
          :to="{ name: 'index' }"
          class="link font-semibold">
          Access now
        </nuxt-link>
      </template>
    </MainContainer>
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
import DownloadKeystoreFile from '@/components/create/DownloadKeystoreFile';
import DownloadMnemonicPhrase from '@/components/create/DownloadMnemonicPhrase';
// cube village gate curious enforce blur yard equal weekend bronze voice name
const bip39 = require('bip39');
import {
  getAddressFromPrivateKey,
  encryptPrivateKey,
  schnorr,
  toBech32Address
} from '@zilliqa-js/crypto';

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
      if (
        (!this.passphrase || this.passphrase.length < 8) &&
        this.walletType === 'json'
      ) {
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
      this.privateKey = schnorr.generatePrivateKey();
      this.address = getAddressFromPrivateKey(this.privateKey);
      try {
        this.encryptedWallet = await encryptPrivateKey(
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
      const bech32Address = toBech32Address(this.address);
      var addressCanvas = document.createElement('CANVAS');
      var pkCanvas = document.createElement('CANVAS');
      const addressQr = this.$qr.toDataURL(
        addressCanvas,
        bech32Address,
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
      const paperWallet = printKeystore(bech32Address, this.privateKey);
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
