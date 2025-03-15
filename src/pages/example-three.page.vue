<template>
  <div
    ref="containerRef"
    tabindex="0"
    class="relative w-full min-h-full block cursor-grab active:cursor-grabbing outline-none"
    @click="handleMouseClick"
    @keydown.up="increaseRotationX"
    @keydown.down="decreaseRotationX"
    @keydown.right="increaseRotationY"
    @keydown.left="decreaseRotationY"
  >
    <div class="absolute top-4 left-0 w-full">
      <div
        class="flex border flex-col mt-4 w-fit px-4 mx-auto rounded-lg pb-6 pt-2"
        :style="{ 
              color: `#${color}`,
              backgroundColor: `#${color}20`,
              borderColor: `#${color}`
            }"
      >
        <div class="text-white text-sm mb-4">
          <h3 class="font-bold mb-2">Instruções:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li>Use as <span :style="{ color: `#${color}` }">setas do teclado</span> para controlar a rotação do cubo</li>
            <li>Clique nos botões <span :style="{ color: `#${color}` }">+/-</span> para ajustar a velocidade de rotação</li>
            <li>Clique no <span :style="{ color: `#${color}` }">cubo</span> ou no botão para mudar sua cor</li>
          </ul>
        </div>

        <div class="flex gap-2">
          <div>
            <h3 class="text-white text-sm mb-2">Velocity Rotation X</h3>
            <div class="flex items-center">
              <button
                @click="decreaseRotationX"
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: `#${color}20`,
                  borderColor: `#${color}`
                }"
                class="border inline-flex aspect-square text-xl h-8 items-center justify-center font-bold p-2 rounded-l-md cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                v-model="rotation.x"
                readonly
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: `#${color}10`,
                  borderColor: `#${color}`
                }"
                class="max-w-[120px] border-y h-8 p-2 px-4 outline-none focus:bg-opacity-20"
              />
              <button
                @click="increaseRotationX"
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: `#${color}20`,
                  borderColor: `#${color}`
                }"
                class="border inline-flex aspect-square text-xl h-8 items-center justify-center font-bold p-2 rounded-r-md cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-white text-sm mb-2">Velocity Rotation Y</h3>
            <div class="flex items-center">
              <button
                @click="decreaseRotationY"
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: `#${color}20`,
                  borderColor: `#${color}`
                }"
                class="border inline-flex aspect-square text-xl h-8 items-center justify-center font-bold p-2 rounded-l-md cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                v-model="rotation.y"
                readonly
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: `#${color}10`,
                  borderColor: `#${color}`
                }"
                class="max-w-[120px] border-y h-8 p-2 px-4 outline-none focus:bg-opacity-20"
              />
              <button
                @click="increaseRotationY"
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: `#${color}20`,
                  borderColor: `#${color}`
                }"
                class="border inline-flex aspect-square text-xl h-8 items-center justify-center font-bold p-2 rounded-r-md cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button 
            @click="changeCubeColor" 
            :style="{ 
              color: `#${color}`,
              backgroundColor: `#${color}20`,
              borderColor: `#${color}`
            }"
            class="border inline-flex font-semibold h-8 items-center justify-center p-2 rounded-md cursor-pointer"
          >
            Change Color
          </button>
          <div 
            class="h-8 w-8 border-2 rounded-full" 
            :style="{ 
              backgroundColor: `#${color}50`, 
              borderColor: `#${color}` 
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { defineComponent, markRaw, onBeforeUnmount, onMounted, ref } from 'vue';
import { useThreeJS } from '../composables/useThreeJS';

defineComponent({
  name: 'ExampleOnePage',
});

const containerRef = ref<HTMLDivElement | null>(null);
const threeJS = useThreeJS();
let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
const rotation = ref<{ x: number; y: number }>({ x: 0.01, y: 0.01 });
const color = ref<string>('53eafd');
const createCube = () => {
  if (!threeJS.scene.value) return;
  const geometry = markRaw(new THREE.BoxGeometry());
  const material = markRaw(
    new THREE.MeshBasicMaterial({ wireframe: true, color: '#53eafd' })
  );
  cube = markRaw(new THREE.Mesh(geometry, material));
  threeJS.scene.value.add(cube);
  return cube;
};

const rotateCube = () => {
  if (cube) {
    cube.rotation.x += rotation.value.x;
    cube.rotation.y += rotation.value.y;
  }
};

const decreaseRotationX = () => {
  rotation.value.x = Number((rotation.value.x - 0.01).toFixed(2));
};

const increaseRotationX = () => {
  rotation.value.x = Number((rotation.value.x + 0.01).toFixed(2));
};

const decreaseRotationY = () => {
  rotation.value.y = Number((rotation.value.y - 0.01).toFixed(2));
};

const increaseRotationY = () => {
  rotation.value.y = Number((rotation.value.y + 0.01).toFixed(2));
};

const changeCubeColor = () => {
  if (cube) {
    cube.material.color.setHex(Math.random() * 0xffffff);
    color.value = cube.material.color.getHexString();
  }
};

const handleMouseClick = (event: MouseEvent) => {
  if (!threeJS.scene.value) return;

  const intersects = threeJS.setupRaycaster(
    event,
    threeJS.scene.value.children
  );

  if (intersects.length > 0) {
    const intersected = intersects[0].object;
    if (intersected === cube) {
      changeCubeColor();
    }
  }
};

const animate = () => {
  rotateCube();
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

  createCube();
  threeJS.startAnimation(animate);
};

const cleanup = () => {
  if (cube) {
    cube.geometry.dispose();
    cube.material.dispose();
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
