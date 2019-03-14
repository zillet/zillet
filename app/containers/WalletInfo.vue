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
                  <i 
                    :class="{'selected':showQr==='address'}"
                    class="eva eva-grid-outline"
                  />
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
                  <i 
                    :class="{'selected':showQr==='publicKey'}"
                    class="eva eva-grid-outline"
                  />
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
          <p class="text-grey-darker text-sm italic font-semibold">Save your private key somewhere safe. else your funds will be lost forever</p>
        </div>
        <div class="flex justify-center items-center flex-col">
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
<style scoped lang="scss">
.qr-code-btn {
  @apply flex justify-center items-center;
}
.qr-code {
  width: 200px;
}
i.eva {
  font-size: 1.4rem;
  @apply fill-current text-grey-darkest inline-block;
  &.selected {
    @apply text-teal;
  }
}
</style>
