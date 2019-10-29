<template>
  <div class="footer">
    <div class="footer__links">
      <div class="left">
        <a
          href="https://github.com/zillet/zillet"
          target="_blank"
          rel="noopener noreferrer">
          <i class="eva eva-github mr-1" />
          v0.2.7
        </a>
        <a
          href="https://twitter.com/zilletio"
          target="_blank"
          rel="noopener noreferrer">
          <i class="eva eva-twitter mr-1 text-lg" />
          Twitter
        </a>
        <a
          href="mailto:support@zillet.io"
          target="_blank"
          rel="noopener noreferrer">
          <i class="eva eva-email-outline mr-1 text-lg" />
          Email Support
        </a>
      </div>
      <div class="right">
        <a
          href="//t.me/burgersingh"
          target="_blank"
          rel="noopener noreferrer">
          Report Issue
        </a>
        <a
          href="//support.zillet.io"
          target="_blank"
          rel="noopener noreferrer">
          Help Center
        </a>
        <a
          @click="showDisclaimer=!showDisclaimer">
          Disclaimer
        </a>
        <!-- <a class="border-l border-gray-600">
          v0.2.6
        </a> -->
      </div>
    </div>
    <z-modal
      :visible="isReporting"
      title="Disclaimer"
      custom-class="p-8"
      @close="isReporting=false">
      <h3 class="font-semibold text-xl mb-8 text-gray-700">
        Report Issue
      </h3>
    </z-modal>
    <z-modal
      :visible="showDisclaimer"
      title="Disclaimer"
      custom-class="p-8"
      @close="showDisclaimer=false">
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
        <z-button
          size="small"
          rounded
          @click="showDisclaimer=false">
          Okay, Got it.
        </z-button>
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
      hasConsent: false,
      isReporting: false
    };
  },
  watch: {
    hasConsent: {
      handler(value) {
        localStorage.setItem('_user_consent', value);
      }
    }
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
  @apply w-full mt-2 flex items-center;
  &__links {
    @apply flex flex-row justify-between w-full mb-2;
    @include mobile {
      @apply flex-col items-center;
    }
    a {
      @apply tracking-wide text-gray-500 cursor-pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.92rem;
      &:hover {
        @apply text-gray-300;
      }
    }
    .right,
    .left {
      @apply flex flex-row;
      @include mobile {
        @apply mb-4;
      }
      a {
        @apply px-2;
      }
    }
  }
}
</style>
