<template>
  <div class="max-w-screen-lg h-screen mx-auto pb-4 flex flex-col">
    <div class="flex justify-between items-center mx-auto py-2 w-full">
      <h3 class="text-2xl font-bold bg-black text-white px-4 py-2 font-thin">
        @jbgs.dev - {{ currentTitle }}
      </h3>
      <ul class="flex gap-x-4 font-thin">
        <li><router-link to="/" class="font-light hover:underline">Início</router-link></li>
        <li><router-link to="/example-1" class="font-light hover:underline">Animação e Transformações</router-link></li>
        <li><router-link to="/example-2" class="font-light hover:underline">Texturas e Segmentos</router-link></li>
      </ul>
    </div>

    <div class="flex-1 w-full">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentTitle = computed(() => {
  // Exibir apenas o título principal, sem o sufixo "- Three.js"
  const fullTitle = route.meta.title as string || 'Demonstrações Three.js';
  return fullTitle.split(' - ')[0];
});
</script>
