<template>
  <div class="flex flex-row mobile:flex-col">
    <div class="flex-1 flex-col justify-start text-left">
      <div class="tracking-wide  text-sm font-semibold mb-2">
        Address
      </div>
      <z-input
        :value="Account.bech32Address"
        :hide="false"
        custom-class="rounded-r-none border-r-0"
        disabled>
        <div
          class="flex -mr-px">
          <button
            class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-400 text-gray-500 text-sm"
            @click="showQr='bech32Address'">
            <div class="qr-code-btn">
              <i
                :class="{'selected':showQr==='bech32Address'}"
                class="eva eva-grid-outline"
              />
            </div>
          </button>
        </div>
      </z-input>
      <z-button
        size="small"
        class="rounded w-full mb-2"
        type="default"
        @click="showBase16=!showBase16">
        Reveal Base 16 address (Old Ethereum style address starts with 0x..)
      </z-button>
      <div
        v-if="showBase16"
        class="mt-2">
        <div class="tracking-wide  text-sm font-semibold mb-2">
          Base 16 Address
        </div>
        <z-input
          :value="`${Account.checksummedAddress}`"
          :hide="false"
          custom-class="rounded-r-none border-r-0"
          disabled>
          <div
            class="flex -mr-px">
            <button
              class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-400 text-gray-500 text-sm"
              @click="showQr='address'">
              <div class="qr-code-btn">
                <i
                  :class="{'selected':showQr==='address'}"
                  class="eva eva-grid-outline"
                />
              </div>
            </button>
          </div>
        </z-input>
        <z-alert
          type="danger"
          class="mb-6 mt-2">
          Do not send ERC-20 ZILfunds to this address.
        </z-alert>
      </div>
      <div class="tracking-wide text-sm font-semibold mb-2">
        Public Key
      </div>
      <z-input
        :value="`0x${Account.publicKey}`"
        :hide="false"
        custom-class="rounded-r-none border-r-0"
        disabled>
        <div
          class="flex -mr-px">
          <button
            class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-400 text-gray-500 text-sm"
            @click="showQr='publicKey'">
            <div class="qr-code-btn">
              <i
                :class="{'selected':showQr==='publicKey'}"
                class="eva eva-grid-outline"
              />
            </div>
          </button>
        </div>
      </z-input>
      <div class="tracking-wide  text-sm font-semibold mb-2">
        Private Key
      </div>
      <z-input
        :hide="true"
        :value="`0x${Account.privateKey}`"
        disabled>
        <div
          class="flex -mr-px">
          <button
            class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-400 text-gray-500 text-sm"
            @click="doCopy">
            <div class="qr-code-btn">
              <i
                :class="{'selected':showQr==='privateKey'}"
                class="eva eva-clipboard-outline"
              />
            </div>
          </button>
        </div>
      </z-input>
      <p class=" text-sm italic font-semibold">
        Save your private key somewhere safe. else your funds will be lost forever
      </p>
    </div>
    <div class="flex  mx-8 justify-center items-center flex-col">
      <div class="qr-code">
        <z-qrcode
          :value="showQr==='address' ? Account.checksummedAddress : `0x${Account[showQr]}`"
          :options="{ width: 200, color:{ dark: '#303133'}}" />
      </div>
      <label
        class="block uppercase tracking-wide text-gray-800 text-sm font-bold mb-2"
        for="qr-code">
        {{ key }}
      </label>
      <p class=" text-xs italic font-semibold">
        Scan QR code to import {{ key }}
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'WalletInfo',
  middleware: 'ifKeyExists',
  data() {
    return {
      showQr: 'bech32Address',
      showBase16: false
    };
  },
  computed: {
    key() {
      if (this.showQr === 'bech32Address') {
        return 'Address';
      } else if (this.showQr === 'privateKey') {
        return 'Private Key';
      } else if (this.showQr === 'address') {
        return 'Base 16 address';
      } else {
        return 'Public Key';
      }
    },
    ...mapGetters(['Account'])
  },
  methods: {
    doCopy() {
      this.$copyText(this.Account.privateKey)
        .then(() => {
          this.$notify({
            message: `Private Key succesfully copied to clipboard`,
            type: 'success'
          });
        })
        .catch(() => {
          this.$notify({
            message: `Something went wrong`,
            type: 'danger'
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.qr-code-btn i.eva-grid-outline {
  position: relative;
  top: 2px;
}
</style>
