<template>
  <div class="container">
    <Notifications />
    <Navigation />
    <Nuxt />
    <Footer />
  </div>
</template>
<script>
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default {
  name: 'Default',
  components: {
    Navigation,
    Footer
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
