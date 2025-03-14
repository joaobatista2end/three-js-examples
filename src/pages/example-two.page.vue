<template>
  <div 
    ref="containerRef" 
    class="relative w-full min-h-full block cursor-grab active:cursor-grabbing" 
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center bg-black/50 p-3 rounded-lg z-10">
      <button 
        @click="decreaseComplexity" 
        title="Diminuir complexidade"
        class="w-10 h-10 rounded-full bg-white/20 border-none text-white text-xl cursor-pointer flex items-center justify-center transition-colors hover:bg-white/30"
      >
        <span>-</span>
      </button>
      <div class="mx-4 text-white font-sans text-sm min-w-[100px] text-center">
        {{ currentDetail }} segmentos
      </div>
      <button 
        @click="increaseComplexity" 
        title="Aumentar complexidade"
        class="w-10 h-10 rounded-full bg-white/20 border-none text-white text-xl cursor-pointer flex items-center justify-center transition-colors hover:bg-white/30"
      >
        <span>+</span>
      </button>
    </div>
    
    <div class="absolute top-5 right-5 bg-black/50 p-3 rounded-lg z-10">
      <div class="relative inline-block w-full">
        <select 
          v-model="selectedMaterial" 
          @change="changeMaterial"
          class="appearance-none w-full bg-white/10 text-white border border-white/20 rounded px-4 py-2 pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200"
        >
          <option value="normal">Material Normal</option>
          <option value="normal-wireframe">Wireframe</option>
          <option value="basic">Básico (Cor)</option>
          <option value="phong">Phong (Brilho)</option>
          <option value="standard">Standard (PBR)</option>
          <option value="lambert">Lambert (Difuso)</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeUnmount, onMounted, ref, markRaw } from "vue";
import * as THREE from "three";
import { useThreeJS } from "../composables/useThreeJS";

defineComponent({
  name: "ExampleTwoPage",
});

const containerRef = ref<HTMLDivElement | null>(null);
const threeJS = useThreeJS();
let sphere: THREE.Mesh;
const currentDetail = ref(32); // Detalhe inicial
const selectedMaterial = ref("normal");

// Estado para controle do mouse
const isDragging = ref(false);
const previousMousePosition = {
  x: 0,
  y: 0
};

// Criar esfera com material padrão
const createSphere = () => {
  if (!threeJS.scene.value) return;
  
  const geometry = markRaw(new THREE.SphereGeometry(2, currentDetail.value, currentDetail.value));
  const material = createMaterial(selectedMaterial.value);
  sphere = markRaw(new THREE.Mesh(geometry, material));
  threeJS.scene.value.add(sphere);
  return sphere;
};

// Criar material baseado na seleção
const createMaterial = (type: string) => {
  switch(type) {
    case "normal-wireframe":
      return markRaw(new THREE.MeshNormalMaterial({ wireframe: true }));
    case "basic":
      return markRaw(new THREE.MeshBasicMaterial({ 
        color: 0x3498db
      }));
    case "phong":
      return markRaw(new THREE.MeshPhongMaterial({ 
        color: 0x2ecc71, 
        shininess: 100,
        specular: 0xffffff
      }));
    case "standard":
      return markRaw(new THREE.MeshStandardMaterial({ 
        color: 0xe74c3c,
        roughness: 0.3,
        metalness: 0.7
      }));
    case "lambert":
      return markRaw(new THREE.MeshLambertMaterial({ 
        color: 0xf1c40f
      }));
    case "normal":
    default:
      return markRaw(new THREE.MeshNormalMaterial({ wireframe: false }));
  }
};

// Controles de complexidade
const increaseComplexity = (event: MouseEvent) => {
  event.stopPropagation();
  if (!sphere || !threeJS.scene.value) return;
  
  if (currentDetail.value < 128) {
    currentDetail.value *= 2;
    updateSphereGeometry();
  }
};

const decreaseComplexity = (event: MouseEvent) => {
  event.stopPropagation();
  if (!sphere || !threeJS.scene.value) return;
  
  if (currentDetail.value > 8) {
    currentDetail.value /= 2;
    updateSphereGeometry();
  }
};

const updateSphereGeometry = () => {
  if (!sphere || !threeJS.scene.value) return;
  
  const geometry = markRaw(new THREE.SphereGeometry(2, currentDetail.value, currentDetail.value));
  sphere.geometry.dispose();
  sphere.geometry = geometry;
  
  threeJS.renderScene();
};

// Trocar material da esfera
const changeMaterial = () => {
  if (!sphere || !threeJS.scene.value) return;
  
  // Descartar material antigo
  if (sphere.material) {
    (sphere.material as THREE.Material).dispose();
  }
  
  // Criar e aplicar novo material
  sphere.material = createMaterial(selectedMaterial.value);
  
  // Adicionar iluminação se necessário
  addLightingIfNeeded();
  
  // Renderizar
  threeJS.renderScene();
};

// Adicionar iluminação para materiais que precisam de luz
const addLightingIfNeeded = () => {
  if (!threeJS.scene.value) return;
  
  // Verificar se já existe iluminação
  const hasLights = threeJS.scene.value.children.some(
    child => child instanceof THREE.DirectionalLight || child instanceof THREE.AmbientLight
  );
  
  if (!hasLights && ['phong', 'standard', 'lambert'].includes(selectedMaterial.value)) {
    // Adicionar luz ambiente
    const ambientLight = markRaw(new THREE.AmbientLight(0xffffff, 0.5));
    threeJS.scene.value.add(ambientLight);
    
    // Adicionar luz direcional
    const directionalLight = markRaw(new THREE.DirectionalLight(0xffffff, 0.8));
    directionalLight.position.set(5, 5, 5);
    threeJS.scene.value.add(directionalLight);
  }
};

// Eventos de mouse para rotação
const handleMouseDown = (event: MouseEvent) => {
  isDragging.value = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !sphere) return;
  
  // Calcular o delta do movimento
  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;
  
  // Atualizar a rotação da esfera
  sphere.rotation.y += deltaX * 0.01;
  sphere.rotation.x += deltaY * 0.01;
  
  // Render manual para atualizar a cena
  threeJS.renderScene();
  
  // Atualizar posição anterior
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// Renderização manual (sem animação contínua)
const render = () => {
  threeJS.renderScene();
};

const initComponent = () => {
  threeJS.container.value = containerRef.value;
  threeJS.initThreeJS();
  
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
  
  createSphere();
  addLightingIfNeeded();
  
  // Renderização inicial
  render();
};

const cleanup = () => {
  if (sphere) {
    sphere.geometry.dispose();
    if (sphere.material) {
      (Array.isArray(sphere.material) 
        ? sphere.material 
        : [sphere.material]
      ).forEach(material => material.dispose());
    }
  }
  threeJS.cleanupResources();
};

onMounted(() => {
  initComponent();
});

onBeforeUnmount(() => {
  cleanup();
});
</script>
