<template>
  <div class="container">
    <Notifications />
    <Navigation />
    <Nuxt />
    <Footer />
    <Onboarding />
  </div>
</template>
<script>
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Onboarding from '@/components/Onboarding';

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
