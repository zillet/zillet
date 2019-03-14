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
          that each of XXX_COMPANY and Zilliqa Research Pte Ltd. assume no 
          responsibility or liability for any error, omission, delay, 
          damages, costs, loss or expense (together “Losses”) incurred 
          by you from the use of the software. You acknowledge that you
          may suffer a Loss from the use of the software and that the use 
          of the software is at your own risk.
        </p>
        <p>
          <strong>MIT License</strong>
          <br >
          Copyright (c) YEAR XXX_COMPANY
          Permission is hereby granted, free of charge, to any person 
          obtaining a copy of this software and associated documentation 
          files (the "Software"), to deal in the Software without
          restriction, including without limitation the rights to use, 
          copy, modify, merge, publish, distribute, sublicense, and/or 
          sell copies of the Software, and to permit persons to whom the 
          Software is furnished to do so, subject to the following 
          conditions:
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
          OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
          NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
          HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
          WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
          FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
          OTHER DEALINGS IN THE SOFTWARE.
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
  beforeMount() {
    this.showDisclaimer =
      localStorage.getItem('_user_consent') == 'true' ? false : true;
  },
  methods: {
    saveConsent() {
      if (this.hasConsent) {
        localStorage.setItem('_user_consent', true);
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
