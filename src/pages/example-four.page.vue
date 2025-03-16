<template>
  <div
    ref="containerRef"
    tabindex="0"
    class="relative w-full min-h-full block cursor-grab active:cursor-grabbing outline-none"
    @keydown.left="movePlayer('left')"
    @keydown.right="movePlayer('right')"
    @keydown.up="movePlayer('up')"
    @keydown.down="movePlayer('down')"
    @keydown.w="moveCamera('up')"
    @keydown.s="moveCamera('down')"
    @keydown.a="moveCamera('left')"
    @keydown.d="moveCamera('right')"
  >
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { defineComponent, markRaw, onBeforeUnmount, onMounted, ref } from 'vue';
import { useThreeJS } from '../composables/useThreeJS';

defineComponent({
  name: 'ExampleFourPage',
});

const containerRef = ref<HTMLDivElement | null>(null);
const threeJS = useThreeJS();
const player = ref<THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>>();
const playerSpeed = 0.1;
const cameraSpeed = 0.1;

const createStorages = () => {
  const geometry = new THREE.BoxGeometry(.4, .4, .4);
  const material = new THREE.MeshPhongMaterial({ 
    color: 'green',
    shininess: 100,
    specular: 0x444444,
    reflectivity: 1
  });
  
  const positions = [
    { x: -4, y: 0, z: 0 },  // Esquerda
    { x: 4, y: 0, z: 0 },   // Direita
  ];
  
  const storages = []
  for(let i = 0; i < positions.length; i++) {
    const storage = new THREE.Mesh(geometry, material);
    storage.position.set(
      positions[i].x,
      positions[i].y,
      positions[i].z
    );
    storages.push(storage);
    threeJS.scene.value?.add(storage);
  }
}


const createPlayer = () => {
  const geometry = new THREE.SphereGeometry(0.2, 8, 8);
  const material = new THREE.MeshPhongMaterial({ 
    color: 0xffff00,
    shininess: 100,
    specular: 0x444444,
    reflectivity: 1
  });
  player.value = markRaw(new THREE.Mesh(geometry, material));
  threeJS.scene.value?.add(player.value);
};

const movePlayer = (direction: 'left' | 'right' | 'up' | 'down') => {
  if (!player.value) return;
  
  switch (direction) {
    case 'up':
      player.value.position.y += playerSpeed;
      break;
    case 'down':
    player.value.position.y -= playerSpeed;
      break;
    case 'left':
    player.value.position.x -= playerSpeed;
      break;
    case 'right':
    player.value.position.x += playerSpeed;
      break;
  }
};

const moveCamera = (direction: 'up' | 'down' | 'left' | 'right') => {
  if (!threeJS.camera.value) return;

  switch (direction) {
    case 'up':
      threeJS.camera.value.position.y += cameraSpeed;
      break;
    case 'down':
      threeJS.camera.value.position.y -= cameraSpeed;
      break;
    case 'left':
      threeJS.camera.value.position.x -= cameraSpeed;
      break;
    case 'right':
      threeJS.camera.value.position.x += cameraSpeed;
      break;
  }

  // Manter a câmera olhando para o centro
  threeJS.camera.value.lookAt(0, 0, 0);
};

const initComponent = () => {
  threeJS.container.value = containerRef.value;
  threeJS.initThreeJS();
  
  // Adicionar luzes
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  threeJS.scene.value?.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0x404040);
  threeJS.scene.value?.add(ambientLight);

  if (threeJS.camera.value) {
    threeJS.camera.value.aspect = threeJS.width.value / threeJS.height.value;
    threeJS.camera.value.fov = 75;
    threeJS.camera.value.near = 0.1;
    threeJS.camera.value.far = 1000;
    threeJS.camera.value.position.z = 5;
    threeJS.camera.value.updateProjectionMatrix();
  }

  if (threeJS.renderer.value) {
    threeJS.renderer.value.setSize(threeJS.width.value, threeJS.height.value);
  }

  // Adicionar animação para ver o efeito reflexivo
  const animate = () => {
    if (player.value) {
      // Limitar o movimento do player
      player.value.position.x = Math.max(-4.5, Math.min(4.5, player.value.position.x));
    }
    
    if (threeJS.camera.value) {
      // Limitar o movimento da câmera
      threeJS.camera.value.position.x = Math.max(-10, Math.min(10, threeJS.camera.value.position.x));
      threeJS.camera.value.position.y = Math.max(-10, Math.min(10, threeJS.camera.value.position.y));
    }
    
    threeJS.renderScene();
  };

  createPlayer();
  createStorages();
  threeJS.startAnimation(animate);
};

const cleanup = () => {
  threeJS.cleanupResources();
};

onMounted(() => {
  initComponent();
});

onBeforeUnmount(() => {
  cleanup();
});
</script>
