<template>
 <div class="w-full h-screen relative">
    <router-view />
 </div>
</template>
  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  </script>
  