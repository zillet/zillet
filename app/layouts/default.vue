<template>
  <div class="container">
    <Notifications />
    <Navigation />
    <div class="w-full">
      <div class="card">
        <Nuxt />
      </div>
    </div>
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
