<template>
  <div class="container">
    <Notifications/>
    <Navigation/>
    <Nuxt/>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation';
export default {
  name: 'Default',
  components: {
    Navigation
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
