<template>
  <div class="footer">
    <div class="footer__links">
      <div class="left">
        <a 
          @click="showDisclaimer=!showDisclaimer">
          Disclaimer
        </a>
      </div>
      <div class="right">
        <a 
          href="https://github.com/man15h/zillet"
          target="_blank"
          rel="noopener noreferrer">
          <i class="eva eva-github mr-1" />
          Github
        </a>
      </div>
    </div>
    <z-modal 
      :visible="showDisclaimer" 
      :autoclose="false"
      title="Disclaimer"
      @close="showDisclaimer=false"> 
      <div class="card">
        <h3 class="font-semibold text-xl mb-8 text-gray-700"> 
          Disclaimer
        </h3>
        <div class="disclaimer--wrapper">
          <p class="font-semibold">
            Always be vigilant about safety and security!
          </p>
          <p>
            <span class="font-semibold">Always backup your keys:</span>
            We do not have access to, nor do we store, your keys to the 
            tokens or funds you have on our software. No data leaves 
            your computer/phone/browser. We only provide a service to 
            make it easy for users to create, save and access information
            that is needed to interact with the blockchain. It is your
            responsibility to securely store and backup your keys.
          </p>
          <p>
            <span class="font-semibold">We are not responsible for any loss:</span>
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
              rounded
              @click="saveConsent">
              Okay, Got it.
            </z-button>
          </div>
        </div>
      </div>
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
<style lang="scss" scoped>
@import '@/assets/css/_mixins.scss';
.disclaimer {
  &--wrapper {
    @apply text-gray-800;
    h3 {
      @apply mb-8;
    }
    p {
      text-align: left;
      @apply leading-normal text-gray-800 mb-4;
    }
  }
  &--footer {
    @apply flex items-center justify-between;
    @include no-select;
  }
}
.footer {
  @apply w-full mt-2;
  &__links {
    @apply flex flex-row justify-between;
    a {
      @apply tracking-wide text-gray-500 cursor-pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.92rem;
      &:hover {
        @apply text-gray-500;
      }
    }
  }
}
</style>
