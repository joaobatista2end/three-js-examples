<template>
  <div ref="containerRef" class="three-container" @click="handleMouseClick"></div>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeUnmount, onMounted, ref, markRaw } from "vue";
import * as THREE from "three";
import { useThreeJS } from "../composables/useThreeJS";

defineComponent({
  name: "ExampleOnePage",
});

const containerRef = ref<HTMLDivElement | null>(null);
const threeJS = useThreeJS();
let cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;

const createCube = () => {
  if (!threeJS.scene.value) return;
  const geometry = markRaw(new THREE.BoxGeometry());
  const material = markRaw(new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  cube = markRaw(new THREE.Mesh(geometry, material));
  threeJS.scene.value.add(cube);
  return cube;
};

const rotateCube = () => {
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
};

const changeCubeColor = () => {
  if (cube) {
    cube.material.color.setHex(Math.random() * 0xffffff);
  }
};

const handleMouseClick = (event: MouseEvent) => {
  if (!threeJS.scene.value) return;
  
  const intersects = threeJS.setupRaycaster(event, threeJS.scene.value.children);
  
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

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
  display: block;
  position: relative;
}
</style>
