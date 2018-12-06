<template>
  <div class="container">
    <notifications/>
    <z-nav/>
    <nuxt/>
  </div>
</template>
<script>
import Navigation from '@/components/Navigation';
export default {
  name: 'Default',
  components: {
    'z-nav': Navigation
  }
};
</script>
