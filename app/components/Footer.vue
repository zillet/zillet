<template>
  <div class="footer">
    <slot v-if="this.$slots.default" />
    <nuxt-link 
      v-else
      :to="{name: 'access-wallet'}" 
      class="text-teal text-sm font-semibold">
      Already have wallet
    </nuxt-link>
    &nbsp;
    &nbsp;
    ·  
    &nbsp;
    &nbsp;
    <a 
      class="text-teal text-sm font-semibold cursor-pointer"
      @click="showDisclaimer=!showDisclaimer">
      Disclaimer
    </a>
    <z-modal 
      v-if="showDisclaimer" 
      title="Disclaimer"> 
      <template v-slot:header>
        <h3 class="header modal"> Disclaimer</h3>
      </template>
      <div class="disclaimer--wrapper">
        <p>
          <strong>Always be vigilant about safety and security!</strong>
        </p>
        <p>
          <strong>Always backup your keys:</strong>
          We do not have access to, nor do we store, your keys to the 
          tokens or funds you have on our software. No data leaves 
          your computer/phone/browser. We only provide a service to 
          make it easy for users to create, save and access information
          that is needed to interact with the blockchain. It is your
          responsibility to securely store and backup your keys.
        </p>
        <p>
          <strong>We are not responsible for any loss:</strong>
          The Zilliqa blockchain as well as the software are under active 
          development. There is always the possibility of something 
          unexpected happening that causes your tokens or funds to be lost. 
          Please do not use the software for more than what you are willing 
          to lose, and please be careful. By using the software, you agree
          that each of developer of this software and Zilliqa Research Pte Ltd. 
          assume no responsibility or liability for any error, omission, delay, 
          damages, costs, loss or expense (together “Losses”) incurred 
          by you from the use of the software. You acknowledge that you
          may suffer a Loss from the use of the software and that the use 
          of the software is at your own risk.
        </p>
      </div>
      <template v-slot:footer>
        <div class="disclaimer--footer">
          <div 
            class="cursor-pointer" 
            @click="hasConsent=!hasConsent">
            <input 
              :checked="hasConsent" 
              type="checkbox"> &nbsp; &nbsp;Yes, I agree with these terms and conditions.
          </div>
          <div>
            <z-button 
              size="small"
              @click="saveConsent">
              Okay, Got it.
            </z-button>
          </div>
        </div>
      </template>
    </z-modal>
  </div>
</template>
<script>
export default {
  name: 'Footer',
  data() {
    return {
      showDisclaimer: false,
      hasConsent: false
    };
  },
  watch: {
    hasConsent: {
      handler(value) {
        localStorage.setItem('_user_consent', value);
      }
    }
  },
  beforeMount() {
    this.showDisclaimer =
      localStorage.getItem('_user_consent') == 'true' ? false : true;
    this.hasConsent =
      localStorage.getItem('_user_consent') == 'true' ? true : false;
  },
  methods: {
    saveConsent() {
      if (this.hasConsent) {
        this.showDisclaimer = false;
      } else {
        return this.$notify({
          message: `Kindly check the checkbox first`,
          type: 'danger'
        });
      }
    }
  }
};
</script>
<style lang="scss">
@import '@/assets/css/_mixins.scss';
.disclaimer {
  &--wrapper {
    @apply text-grey-darkest;
    h3 {
      @apply mb-8;
    }
    p {
      text-align: left;
      @apply leading-normal text-grey-darkest mb-4;
    }
  }
  &--footer {
    @apply flex items-center justify-between;
    @include no-select;
  }
}
</style>
