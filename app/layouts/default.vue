<template>
  <div class="container">
    <Notifications />
    <!-- <div
      v-if="showNoti"
      style="font-size:0.9rem"
      class="bg-teal-600 rounded w-full p-2 text-white
      flex items-center justify-between mt-4">
      <div class="px-6">
        Addresses are now defaulted to the new Zilliqa bech32 standard, your funds are not affected in any way.
        <a
          href="https://blog.zilliqa.com/zilliqa-migrates-to-new-address-format-bf1fa6d7e41d"
          target="_blank"
          class="underline italic"
          rel="nofollow">
          Read full announcement here
        </a>
      </div>
      <i
        class="eva eva-close-circle-outline text-xl pr-2 cursor-pointer"
        @click="hideNoti" />
    </div> -->
    <Navigation />
    <Nuxt />
    <Footer />
    <Onboarding />
  </div>
</template>
<script>
import Navigation from './partials/navigation';
import Footer from './partials/Footer';
import Onboarding from './partials/Onboarding';

export default {
  name: 'Default',
  components: {
    Navigation,
    Footer,
    Onboarding
  },
  data() {
    return {
      showNoti: false
    };
  },
  beforeMount() {
    const noti = localStorage.getItem('hide_noti');
    if (noti && noti == 'true') {
      this.showNoti = false;
    } else {
      this.showNoti = true;
    }
  },
  methods: {
    hideNoti() {
      localStorage.setItem('hide_noti', true);
      this.showNoti = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  max-width: 960px;
  width: 100%;
  padding: 0rem 1rem;
}
</style>
