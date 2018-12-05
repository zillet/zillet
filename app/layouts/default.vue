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
<style>
.container {
  @apply min-h-screen justify-start items-center text-center mx-auto flex flex-col px-4;
}
</style>
