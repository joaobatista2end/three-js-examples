import { ref, markRaw } from 'vue';
import * as THREE from 'three';

export const useThreeJS = () => {
  // Referências e variáveis
  const container = ref<HTMLDivElement | null>(null);
  const width = ref<number>(0);
  const height = ref<number>(0);
  
  // Objetos Three.js como refs
  const scene = ref<THREE.Scene | null>(null);
  const camera = ref<THREE.PerspectiveCamera | null>(null);
  const renderer = ref<THREE.WebGLRenderer | null>(null);
  let animationId: number;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Funções de configuração da tela
  const getScreenSize = () => {
    if (!container.value) {
      console.error("Não foi possível obter o container");
      return;
    }
    
    width.value = container.value.clientWidth;
    height.value = container.value.clientHeight;
  };

  // Funções de inicialização
  const initScene = () => {
    scene.value = markRaw(new THREE.Scene());
    return scene.value;
  };

  const initCamera = () => {
    camera.value = markRaw(new THREE.PerspectiveCamera(75, width.value / height.value, 0.1, 1000));
    camera.value.position.z = 5;
    return camera.value;
  };

  const initRenderer = () => {
    renderer.value = markRaw(new THREE.WebGLRenderer({ antialias: true }));
    renderer.value.setSize(width.value, height.value);
    container.value?.appendChild(renderer.value.domElement);
    return renderer.value;
  };

  // Funções de animação
  const startAnimation = (animateCallback: () => void) => {
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      animateCallback();
    };
    
    animate();
  };

  const renderScene = () => {
    if (scene.value && camera.value && renderer.value) {
      renderer.value.render(scene.value, camera.value);
    }
  };

  // Funções de interação
  const getMousePosition = (event: MouseEvent) => {
    if (!container.value) return;

    const rect = container.value.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    return mouse;
  };

  const setupRaycaster = (event: MouseEvent, objects: THREE.Object3D[]) => {
    getMousePosition(event);
    if (camera.value) {
      raycaster.setFromCamera(mouse, camera.value);
      return raycaster.intersectObjects(objects);
    }
    return [];
  };

  // Limpeza de recursos
  const cleanupResources = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (renderer.value) {
      renderer.value.dispose();
    }
  };

  // Função de inicialização principal
  const initThreeJS = () => {
    getScreenSize();
    initScene();
    initCamera();
    initRenderer();
    return { 
      scene: scene.value, 
      camera: camera.value, 
      renderer: renderer.value 
    };
  };

  return {
    container,
    width,
    height,
    scene,
    camera,
    renderer,
    raycaster,
    mouse,
    getScreenSize,
    initScene,
    initCamera,
    initRenderer,
    startAnimation,
    renderScene,
    getMousePosition,
    setupRaycaster,
    cleanupResources,
    initThreeJS
  };
}; 