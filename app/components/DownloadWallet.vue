<template>
  <z-modal 
    :visible="visible" 
    @close="close">  
    <div class="card">
      <z-textarea 
        :value="pk" 
        readonly/>
      <div class="flex -mx-2 mb-4">
        <div class="w-1/2 px-2">
          <z-button 
            class="w-full"
            @click="$emit('downloadKeystore')">
            <p>Download Keystore</p>
          </z-button>
        </div>
        <div class="w-1/2 px-2">
          <z-button 
            class="w-full"
            @click="$emit('printWallet')">
            <p>Print Wallet</p>
          </z-button>
        </div>
      </div>
      <p class="text-grey-darker mb-2">
        <b>Do not lose it!</b> It cannot be recovered if you lose it.
      </p>
      <p class=" text-grey-darker mb-2">
        <b>Do not share it!</b> Your funds will be stolen if you use this file on a malicious/phishing site.
      </p>
      <p class="text-grey-darker mb-2">
        <b>Make a backup!</b> Secure it like the millions of dollars it may one day be worth.
      </p>
      <z-alert 
        type="danger" 
        class="mt-8">
        This is Zilliqa wallet. Do not send any 
        ERC-20 ZIL tokens to this wallet.
      </z-alert>
      <z-button 
        :disabled="!keySaved"
        class="w-full mt-8"
        type="default"
        @click="close">
        Okay, I've succesfully saved my key.
      </z-button>
    </div> 
  </z-modal>
</template>
<script>
export default {
  name: 'DownloadWallet',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pk: {
      type: String,
      default: ''
    },
    keySaved: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      if (this.keySaved) {
        this.$emit('close');
      } else {
        return this.$notify({
          message: `Kindly save wallet file in secure location first.`,
          type: 'danger'
        });
      }
    }
  }
};
</script>
