<template>
  <div class="relative w-full h-screen">
    <div
      ref="containerRef"
      tabindex="0"
      class="relative w-full h-full block cursor-grab active:cursor-grabbing outline-none"
    >
    </div>
    
    <ul class="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-6 py-2 rounded-b-lg text-xs list-disc">
      <li>Arrastar - Girar câmera</li>
      <li>Scroll - Zoom da câmera</li>
      <li> Setas - Mover jogador</li>
      <li>Espaço - Chutar</li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { Game } from '../classes/game';

defineComponent({
  name: 'ExampleFourPage',
});

const containerRef = ref<HTMLDivElement | null>(null);
let gameInstance: Game | null = null;
let animationFrameId: number | null = null;

const animate = () => {
  if (!gameInstance) return;
  
  gameInstance.update();
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  if (!containerRef.value) return;
  
  // Create game instance
  gameInstance = new Game(containerRef.value);
  
  // Start animation loop
  animate();
});

onUnmounted(() => {
  // Cancel animation frame if it exists
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  
  // Dispose game instance
  if (gameInstance) {
    gameInstance.dispose();
    gameInstance = null;
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.h-screen {
  height: 100vh;
}
</style>
