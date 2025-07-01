<template>
  <div class="container">
    <Notifications />
    <div
      v-if="showNoti"
      class="bg-gray-200 rounded w-full p-2 text-red-500
      flex items-start justify-start mt-4 font-semibold">
      <div class="px-6">
         A new version focused exclusively on ZQ2 (EVM network) support is now live on 
          <a href="https://app.zillet.io" class="text-primary" target="_blank">
          app.zillet.io           
        </a>. Click here for the full 
        <a
          href="https://support.zillet.io/troubleshooting/migrating-balance-and-stakes-from-v1"
          target="_blank"
        class="text-primary"
          rel="nofollow">
          Migration Guide
        </a>
      </div>
    </div>
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
