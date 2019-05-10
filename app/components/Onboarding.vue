<template>
  <z-modal
    :visible="visible"
    :autoclose="false"
    class="onboarding"
    custom-class="max-w-4xl"
    @close="$emit('close')">
    <div class="card">
      <transition
        name="fade"
        mode="out-in">
        <div
          :key="currentIndex"
          class="onboarding__step">
          <div class="onboarding__illustration">
            <img :src="image">
          </div>
          <div class="onboarding__guide">
            <h3 class="onboarding__title">
              {{ steps[currentIndex].heading }}
            </h3>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-html="steps[currentIndex].text" />
            <z-alert
              v-if="steps[currentIndex].warning"
              type="danger"
              class="mt-8">
              {{ steps[currentIndex].warning }}
            </z-alert>
            <div class="flex justify-between w-full">
              <z-button
                v-if="isBack"
                rounded
                type="default"
                class="w-full mt-12 mb-0 flex mr-4"
                @click="privStep">
                <i class="mr-2 eva eva-arrow-back-outline font-bold" />  Back
              </z-button>
              <z-button
                rounded
                class="w-full mt-12 mb-0 flex"
                style="min-width:190px;"
                @click="nextStep">
                {{ nextBtnText }}  <i class="ml-2 eva eva-arrow-forward-outline font-bold" />
              </z-button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </z-modal>
</template>
<script>
export default {
  name: 'Onboarding',
  data() {
    return {
      visible: false,
      currentIndex: 0,
      steps: [
        {
          heading: 'Welcome to Zillet.io',
          text: `Please take a moment to read through this short
           introduction. It’s very important for your own security
           that you understand these warnings. Ignoring this step will
            highly increase the chances of your funds being lost
            or stolen, in which case we won’t be able to help you.
             Skip at your own risk.`,
          image: 'welcome_to_zillet.svg'
        },
        {
          heading: 'What is Zillet?',
          text: `Zillet is a free, open-source, client-side interface.
          Zillet allows you to interact directly with the Zilliqa blockchain,
          while you remain in full control of your keys and funds.
          <br /> <br />
          Please think about this carefully. YOU are the one who is
          in control. Zillet is not a bank or exchange. We don't hold your
          keys, your funds, or your information. This means  <span class="font-semibold>we can't
          access accounts, recover keys, reset passwords, or reverse
          transactions</span>.`,
          warning: 'You And Only You Are Responsible For Your Security.',
          image: 'what_is_zillet.svg'
        },
        {
          heading: 'Where are my funds stored?',
          text: `Your tokens and coins are not on Zillet. Just like
          they aren't on your hardware wallet, or on blockchain explorers.
          All funds are on the blockchain itself. This means that we do
          not control them. We are a doorway that allows you to interact
          with the blockchain in a convenient way.`,
          warning: 'Zillet Does Not Control Your Funds. You Do!',
          image: 'where_are_funds.svg'
        },
        {
          heading: 'What if I lose my keys or password?',
          text: `We can not recover your information for you. If you lose your
          information, it's <span class="font-semibold">GONE FOREVER</span>.
          Zillet doesn't store any data. After you've received your keys and set
          up a password, we strongly suggest you:
          <br /><br />
          1. Write Your Keys And Password Down. Keep Them Safe.
          <br /> <div class="mt-2" />
          2. Don't Store Your Keys And Password on Your Computer or Phone.`,
          warning: `We Can't Restore Your Keys or Reset Your Password`,
          image: 'keys_lost.svg'
        },
        {
          heading: 'Some helpful tips',
          text: `<div class="flex flex-col">
            <div class="py-4 px-8 bg-gray-200 rounded">
              <p class="font-semibold mb-1">
                Never give your Private Key to anyone
              </p>
              <p>
                That includes your keystore file and mnemonic phrase.
              </p>
            </div>
            <div class="py-4 px-8 bg-gray-200 rounded mt-2">
              <p class="font-semibold mb-1">
                Don't trust any free ETH
              </p>
              <p>
                If they're giving away free ETH, it's not real. If they
                email you saying they're us, it's not real. If they ask
                for your private key, it's not real.
              </p>
            </div>
            <div class="py-4 px-8 bg-gray-200 rounded mt-2">
              <p class="font-semibold mb-1">
                Bookmark our website
              </p>
              <p>
                You must double-check the URL and Bookmark the website.
                It should say <code>https://zillet.io</code> in your URL bar.
              </p>
            </div>
          </div>`,
          image: 'tips.svg'
        },
        {
          heading: `All this sounds hard. What's the upside?`,
          text: `The purpose of cryptocurrency is to allow people to manage their
          funds in a anonymous and secure way, from any location, without relying
           on third parties.
          <br /><br />
          On the blockchain, your digital assets are not controlled by any bank
          or government. You are the only one who has access to your funds and
          you can instantly transfer them to any other address on the blockchain
          without depending on authorizations, permissions, or limits.
          <br /><br />
          Your public address and your private key are the only pieces of information
           you need to hold and manage your funds from anywhere in the world.`,
          image: 'what_is_upside.svg'
        },
        {
          heading: `Congratulations!`,
          text: `Thanks for reading through our introduction! Now you're ready to
          dive in. If you want to know more, please head to our
          <a href="//support.zillet.io" class="text-primary"
          target="_blank" rel="noreferer nofollow"> Help Center</a>. We are
          here to help you have the most secure and most convenient experience possible!`,
          image: 'congratulations.svg'
        }
      ]
    };
  },
  computed: {
    isBack() {
      return this.currentIndex > 0 ? true : false;
    },
    isNext() {
      return this.currentIndex < this.steps.length - 1 ? true : false;
    },
    image() {
      try {
        return require(`@/assets/illustrations/${
          this.steps[this.currentIndex].image
        }`);
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    nextBtnText() {
      if (this.isBack && this.isNext) {
        return 'Next';
      } else if (this.isBack && !this.isNext) {
        return 'Get Started';
      } else {
        return 'Continue';
      }
    }
  },
  beforeMount() {
    const hasOnboarded = localStorage.getItem('has_onboarded');
    if (hasOnboarded != 'true') {
      this.visible = true;
    }
  },
  methods: {
    nextStep() {
      if (this.isNext) {
        this.currentIndex += 1;
      } else {
        localStorage.setItem('has_onboarded', true);
        this.visible = false;
      }
    },
    privStep() {
      this.currentIndex -= 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.onboarding {
  &__title {
    @apply font-bold text-3xl mb-8 text-gray-800;
    letter-spacing: 0.01rem;
  }
  &__step {
    @apply flex py-8;
  }
  &__illustration {
    @apply w-1/2 px-12 flex items-center;
    max-width: 350px;
  }
  &__guide {
    @apply w-1/2 px-12 flex items-start flex-col justify-center text-left flex-1;
  }
}
.fade-enter-active {
  position: relative;
  top: 0;
  opacity: 1;
  transition: all 0.3s;
}
.fade-leave-active {
  opacity: 0;
  // transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  position: relative;
  top: 20px;
}
</style>
