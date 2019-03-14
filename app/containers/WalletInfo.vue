<template>
  <div class="max-w-xl w-full">
    <div 
      id="walert" 
      class="card">
      <!-- <h3 class="header"> 
        Wallet Information
      </h3> -->
      <div class="xl:flex lg:flex">
        <div class="lg:w-3/4 xl:w-3/4 sm:w-full py-2 flex flex-col justify-start text-left px-6">
          <z-input
            :value="`0x${getAccount.address}`"
            :hide="false"
            disabled
            label="Address">
            <div 
              class="flex -mr-px">
              <button 
                class="flex items-center leading-normal 
                bg-white rounded rounded-l-none h-12 px-3
                border border-grey-lighter text-grey-dark text-sm"
                @click="showQr='address'">
                <div class="qr-code-btn">
                  <svg 
                    id="Layer_1"
                    :class="{'text-teal':showQr==='address'}"
                    class="fill-current text-grey-darkest inline-block" 
                    data-name="Layer 1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 15 15"><path 
                      id="a" 
                      class="cls-1" 
                      d="M3.06.5h8.88a2.85,2.85,0,0,1,1.54.27,1.81,1.81,0,0,1,.75.75,2.85,2.85,0,0,1,.27,1.54v8.88a2.85,2.85,0,0,1-.27,1.54,1.81,1.81,0,0,1-.75.75,2.85,2.85,0,0,1-1.54.27H3.06a2.85,2.85,0,0,1-1.54-.27,1.81,1.81,0,0,1-.75-.75A2.85,2.85,0,0,1,.5,11.94V3.06A2.85,2.85,0,0,1,.77,1.52,1.81,1.81,0,0,1,1.52.77,2.85,2.85,0,0,1,3.06.5ZM3,2A1,1,0,0,0,2,3V6A1,1,0,0,0,3,7H6A1,1,0,0,0,7,6V3A1,1,0,0,0,6,2ZM8,2V3H9V2Zm2,0V3h1V2ZM9,3V4h1V3Zm1,1V5h1V4ZM8,5V6H9V5ZM9,6V7h1V6Zm3,0V7h1V6Zm0-2V5h1V4ZM11,4V5h1V4Zm1-2V3h1V2ZM11,6V7h1V6ZM8,4V5H9V4Zm3-1V4h1V3ZM9,8A1,1,0,0,0,8,9v3a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1ZM3,8A1,1,0,0,0,2,9v3a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V9A1,1,0,0,0,6,8ZM3,9H6v3H3ZM3,3H6V6H3ZM9,9h3v3H9ZM4,4V5H5V4Zm6,6v1h1V10ZM4,10v1H5V10Z"/></svg>
                </div>
              </button>
            </div>
          </z-input>
          <z-input
            :value="`0x${getAccount.publicKey}`"
            :hide="false"
            disabled
            label="Public Key">
            <div 
              class="flex -mr-px">
              <button 
                class="flex items-center leading-normal 
                bg-white rounded rounded-l-none h-12 px-3
                border border-grey-lighter text-grey-dark text-sm"
                @click="showQr='publicKey'">
                <div class="qr-code-btn">
                  <svg 
                    id="Layer_1"
                    :class="{'text-teal':showQr==='publicKey'}"
                    class="fill-current text-grey-darkest inline-block" 
                    data-name="Layer 1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 15 15"><path 
                      id="a" 
                      class="cls-1" 
                      d="M3.06.5h8.88a2.85,2.85,0,0,1,1.54.27,1.81,1.81,0,0,1,.75.75,2.85,2.85,0,0,1,.27,1.54v8.88a2.85,2.85,0,0,1-.27,1.54,1.81,1.81,0,0,1-.75.75,2.85,2.85,0,0,1-1.54.27H3.06a2.85,2.85,0,0,1-1.54-.27,1.81,1.81,0,0,1-.75-.75A2.85,2.85,0,0,1,.5,11.94V3.06A2.85,2.85,0,0,1,.77,1.52,1.81,1.81,0,0,1,1.52.77,2.85,2.85,0,0,1,3.06.5ZM3,2A1,1,0,0,0,2,3V6A1,1,0,0,0,3,7H6A1,1,0,0,0,7,6V3A1,1,0,0,0,6,2ZM8,2V3H9V2Zm2,0V3h1V2ZM9,3V4h1V3Zm1,1V5h1V4ZM8,5V6H9V5ZM9,6V7h1V6Zm3,0V7h1V6Zm0-2V5h1V4ZM11,4V5h1V4Zm1-2V3h1V2ZM11,6V7h1V6ZM8,4V5H9V4Zm3-1V4h1V3ZM9,8A1,1,0,0,0,8,9v3a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1ZM3,8A1,1,0,0,0,2,9v3a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V9A1,1,0,0,0,6,8ZM3,9H6v3H3ZM3,3H6V6H3ZM9,9h3v3H9ZM4,4V5H5V4Zm6,6v1h1V10ZM4,10v1H5V10Z"/></svg>
                </div>
              </button>
            </div>
          </z-input>
          <z-input
            :hide="true"
            :value="`0x${getAccount.privateKey}`"
            disabled
            label="Private Key">
            <div 
              class="flex -mr-px">
              <button 
                class="flex items-center leading-normal 
                bg-white rounded rounded-l-none h-12 px-3
                border border-grey-lighter text-grey-dark text-sm"
                @click="showQr='privateKey'">
                <div class="qr-code-btn">
                  <svg 
                    id="Layer_1"
                    :class="{'text-teal':showQr==='privateKey'}"
                    class="fill-current text-grey-darkest inline-block" 
                    data-name="Layer 1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 15 15"><path 
                      id="a" 
                      class="cls-1" 
                      d="M3.06.5h8.88a2.85,2.85,0,0,1,1.54.27,1.81,1.81,0,0,1,.75.75,2.85,2.85,0,0,1,.27,1.54v8.88a2.85,2.85,0,0,1-.27,1.54,1.81,1.81,0,0,1-.75.75,2.85,2.85,0,0,1-1.54.27H3.06a2.85,2.85,0,0,1-1.54-.27,1.81,1.81,0,0,1-.75-.75A2.85,2.85,0,0,1,.5,11.94V3.06A2.85,2.85,0,0,1,.77,1.52,1.81,1.81,0,0,1,1.52.77,2.85,2.85,0,0,1,3.06.5ZM3,2A1,1,0,0,0,2,3V6A1,1,0,0,0,3,7H6A1,1,0,0,0,7,6V3A1,1,0,0,0,6,2ZM8,2V3H9V2Zm2,0V3h1V2ZM9,3V4h1V3Zm1,1V5h1V4ZM8,5V6H9V5ZM9,6V7h1V6Zm3,0V7h1V6Zm0-2V5h1V4ZM11,4V5h1V4Zm1-2V3h1V2ZM11,6V7h1V6ZM8,4V5H9V4Zm3-1V4h1V3ZM9,8A1,1,0,0,0,8,9v3a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1ZM3,8A1,1,0,0,0,2,9v3a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V9A1,1,0,0,0,6,8ZM3,9H6v3H3ZM3,3H6V6H3ZM9,9h3v3H9ZM4,4V5H5V4Zm6,6v1h1V10ZM4,10v1H5V10Z"/></svg>
                </div>
              </button>
            </div>
          </z-input>
          <p class="text-grey-darker text-sm italic font-semibold">Save your private key somewhere safe. else your funds will be lost forever</p>
        </div>
        <div class="lg:w-1/4 xl:w-1/4 sm:w-full flex flex-col">
          <div class="qr-code">
            <z-qrcode 
              :value="`0x${getAccount[showQr]}`" 
              :options="{ width: 200, color:{ dark: '#303133'}}"/>
          </div>
          <label
            class="block uppercase tracking-wide text-grey-darkest text-sm font-bold mb-2" 
            for="qr-code">
            {{ key }}
          </label>
          <p class="text-grey-darker text-xs italic font-semibold">Scan QR code to import {{ key }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'WalletInfo',
  data() {
    return {
      showQr: 'address'
    };
  },
  computed: {
    key() {
      return this.showQr === 'address'
        ? 'Address'
        : this.showQr === 'privateKey'
          ? 'Private Key'
          : 'Public Key';
    },
    ...mapGetters(['getAccount'])
  }
};
</script>
<style scoped>
.qr-code-btn {
  height: 20px;
  width: 20px;
}
.qr-code {
  width: 200px;
  margin: auto;
}
</style>
