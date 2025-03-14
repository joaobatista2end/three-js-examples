<template>
  <div class="py-8">
    <h1 class="text-3xl font-bold mb-8 border-b border-black pb-4">Demonstrações de Three.js com Vue 3</h1>
    
    <div class="bg-gray-100 border border-gray-300 p-8">
      <h2 class="text-xl font-bold mb-4 border-b border-gray-400 pb-2">Sobre o Projeto</h2>
      <p class="mb-4">
        Este projeto demonstra como criar um composable para reutilizar código Three.js entre componentes.
        O composable <code class="bg-gray-200 px-2 py-1">useThreeJS</code> encapsula a funcionalidade comum,
        permitindo que cada componente se concentre apenas na lógica específica.
      </p>
      <p class="font-mono text-sm">
        Tecnologias: Vue 3, TypeScript, Tailwind CSS e Three.js
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';

defineComponent({
  name: 'HomePage',
});
</script>
