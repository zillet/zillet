<template>
  <div
    id="walert"
    class="card">
    <!-- <h3 class="header">
        Wallet Information
      </h3> -->
    <div class="xl:flex lg:flex">
      <div class="lg:w-3/4 xl:w-3/4 sm:w-full flex flex-col justify-start text-left">
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
          Address
        </div>
        <z-input
          :value="`0x${getAccount.address}`"
          :hide="false"
          disabled>
          <div
            class="flex -mr-px">
            <button
              class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-200 text-gray-500 text-sm"
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
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
          Public Key
        </div>
        <z-input
          :value="`0x${getAccount.publicKey}`"
          :hide="false"
          disabled>
          <div
            class="flex -mr-px">
            <button
              class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-200 text-gray-500 text-sm"
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
        <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2">
          Private Key
        </div>
        <z-input
          :hide="true"
          :value="`0x${getAccount.privateKey}`"
          disabled>
          <div
            class="flex -mr-px">
            <button
              class="flex items-center leading-normal
                bg-white rounded rounded-l-none h-12 px-3
                border border-gray-200 text-gray-500 text-sm"
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
        <p class="text-gray-700 text-sm italic font-semibold">
          Save your private key somewhere safe. else your funds will be lost forever
        </p>
      </div>
      <div class="flex justify-center items-center flex-col">
        <div class="qr-code">
          <z-qrcode
            :value="`0x${getAccount[showQr]}`"
            :options="{ width: 200, color:{ dark: '#303133'}}" />
        </div>
        <label
          class="block uppercase tracking-wide text-gray-800 text-sm font-bold mb-2"
          for="qr-code">
          {{ key }}
        </label>
        <p class="text-gray-700 text-xs italic font-semibold">
          Scan QR code to import {{ key }}
        </p>
      </div>
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
  },
  methods: {
    doCopy() {
      this.$copyText(this.getAccount.privateKey)
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
