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
        class="flex border flex-col mt-4 px-4 mx-auto rounded-lg pb-4 pt-2 max-w-2xl"
        :style="{ 
          color: `#${color}`,
          backgroundColor: `#${color}20`,
          borderColor: `#${color}`
        }"
      >
        <div class="text-white text-sm mb-4 grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-bold mb-2">Instruções:</h3>
            <ul class="list-disc list-inside space-y-1 text-xs">
              <li>Use as <span :style="{ color: `#${color}` }">setas do teclado</span> para controlar a rotação</li>
              <li>Clique nos botões <span :style="{ color: `#${color}` }">+/-</span> para ajustar a velocidade</li>
            </ul>
          </div>
          <div class="flex flex-col">
            <div class="flex gap-2 items-center mb-2">
              <button 
                @click="changeCubeColor" 
                :style="{ color: `#${color}`, backgroundColor: `#${color}20`, borderColor: `#${color}` }"
                class="border text-sm h-7 px-3 rounded-md cursor-pointer"
              >
                Mudar Cor
              </button>
              <div 
                class="h-7 w-7 border-2 rounded-full" 
                :style="{ backgroundColor: `#${color}50`, borderColor: `#${color}` }"
              ></div>
            </div>
            <div class="flex gap-2">
              <button
                v-for="shape in shapes"
                :key="shape.type"
                @click="changeShape(shape.type)"
                :style="{ 
                  color: `#${color}`,
                  backgroundColor: currentShape === shape.type ? `#${color}40` : `#${color}20`,
                  borderColor: `#${color}`
                }"
                class="border text-sm flex-1 h-7 rounded-md cursor-pointer"
              >
                {{ shape.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <div v-for="(_, axis) in rotation" :key="axis" class="flex-1">
              <div class="text-white text-xs mb-1">Rotation {{ axis.toUpperCase() }}</div>
              <div class="flex items-center">
                <button
                  @click="axis === 'x' ? decreaseRotationX : decreaseRotationY"
                  :style="{ color: `#${color}`, backgroundColor: `#${color}20`, borderColor: `#${color}` }"
                  class="border inline-flex h-7 w-7 items-center justify-center font-bold rounded-l-md cursor-pointer"
                >-</button>
                <input
                  type="number"
                  v-model="rotation[axis]"
                  readonly
                  :style="{ color: `#${color}`, backgroundColor: `#${color}10`, borderColor: `#${color}` }"
                  class="w-16 border-y h-7 px-2 outline-none text-sm"
                />
                <button
                  @click="axis === 'x' ? increaseRotationX : increaseRotationY"
                  :style="{ color: `#${color}`, backgroundColor: `#${color}20`, borderColor: `#${color}` }"
                  class="border inline-flex h-7 w-7 items-center justify-center font-bold rounded-r-md cursor-pointer"
                >+</button>
              </div>
            </div>
          </div>

          <div v-if="showSegmentControls" class="space-y-2">
            <div v-for="(control, key) in segmentControls" :key="key" class="flex-1">
              <div class="text-white text-xs mb-1">{{ control?.label }}</div>
              <div class="flex items-center">
                <button
                  @click="updateSegments(key as keyof Segments, -1)"
                  :style="{ color: `#${color}`, backgroundColor: `#${color}20`, borderColor: `#${color}` }"
                  class="border inline-flex h-7 w-7 items-center justify-center font-bold rounded-l-md cursor-pointer"
                >-</button>
                <input
                  type="number"
                  v-model="segments[key as keyof Segments]"
                  readonly
                  :style="{ color: `#${color}`, backgroundColor: `#${color}10`, borderColor: `#${color}` }"
                  class="w-16 border-y h-7 px-2 outline-none text-sm"
                />
                <button
                  @click="updateSegments(key as keyof Segments, 1)"
                  :style="{ color: `#${color}`, backgroundColor: `#${color}20`, borderColor: `#${color}` }"
                  class="border inline-flex h-7 w-7 items-center justify-center font-bold rounded-r-md cursor-pointer"
                >+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three';
import { BoxGeometry, ConeGeometry, CylinderGeometry, SphereGeometry } from 'three';
import { computed, defineComponent, markRaw, onBeforeUnmount, onMounted, ref } from 'vue';
import { useThreeJS } from '../composables/useThreeJS';

defineComponent({
  name: 'ExampleOnePage',
});

const containerRef = ref<HTMLDivElement | null>(null);
const threeJS = useThreeJS();
let cube: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
const rotation = ref<{ x: number; y: number }>({ x: 0.01, y: 0.01 });
const color = ref<string>('53eafd');
const currentShape = ref('box');

type Segments = {
  width: number;
  height: number;
  depth: number;
  radius: number;
  widthSegments: number;
  heightSegments: number;
  radialSegments: number;
};

const segments = ref<Segments>({
  width: 1,
  height: 1,
  depth: 1,
  radius: 1,
  widthSegments: 32,
  heightSegments: 32,
  radialSegments: 32
});

const shapes = [
  { type: 'box', label: 'Cubo' },
  { type: 'sphere', label: 'Esfera' },
  { type: 'cylinder', label: 'Cilindro' },
  { type: 'cone', label: 'Cone' }
];

const segmentControls = computed(() => {
  switch (currentShape.value) {
    case 'box':
      return {
        width: { label: 'Largura' },
        height: { label: 'Altura' },
        depth: { label: 'Profundidade' }
      } as const;
    case 'sphere':
      return {
        widthSegments: { label: 'Segmentos H' },
        heightSegments: { label: 'Segmentos V' }
      } as const;
    case 'cylinder':
    case 'cone':
      return {
        radialSegments: { label: 'Segmentos R' },
        heightSegments: { label: 'Segmentos H' }
      } as const;
    default:
      return {} as const;
  }
});

const showSegmentControls = computed(() => Object.keys(segmentControls.value).length > 0);

const updateSegments = (key: keyof Segments, delta: number) => {
  segments.value[key] = Math.max(1, segments.value[key] + delta);
  updateGeometry();
};

const changeShape = (shape: string) => {
  currentShape.value = shape;
  
  // Reset segments based on shape type
  switch (shape) {
    case 'box':
      segments.value = {
        ...segments.value,
        width: 1,
        height: 1,
        depth: 1
      };
      break;
    case 'sphere':
      segments.value = {
        ...segments.value,
        radius: 1,
        widthSegments: 32,
        heightSegments: 32
      };
      break;
    case 'cylinder':
    case 'cone':
      segments.value = {
        ...segments.value,
        radius: 1,
        radialSegments: 32,
        heightSegments: 1
      };
      break;
  }
  
  updateGeometry();
};

const createGeometry = () => {
  switch (currentShape.value) {
    case 'box':
      return new BoxGeometry(
        segments.value.width,
        segments.value.height,
        segments.value.depth
      );
    case 'sphere':
      return new SphereGeometry(
        segments.value.radius,
        segments.value.widthSegments,
        segments.value.heightSegments
      );
    case 'cylinder':
      return new CylinderGeometry(
        segments.value.radius,
        segments.value.radius,
        2,
        segments.value.radialSegments,
        segments.value.heightSegments
      );
    case 'cone':
      return new ConeGeometry(
        segments.value.radius,
        2,
        segments.value.radialSegments,
        segments.value.heightSegments
      );
    default:
      return new BoxGeometry();
  }
};

const updateGeometry = () => {
  if (!cube || !threeJS.scene.value) return;
  
  const newGeometry = createGeometry();
  cube.geometry.dispose();
  cube.geometry = newGeometry;
};

const createCube = () => {
  if (!threeJS.scene.value) return;
  const geometry = markRaw(createGeometry());
  const material = markRaw(
    new THREE.MeshBasicMaterial({ wireframe: true, color: `#${color.value}` })
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
