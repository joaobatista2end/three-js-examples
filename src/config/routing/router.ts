import { createRouter, createWebHistory } from 'vue-router'

import ExampleThreePage from '@/pages/example-three.page.vue'
import ExampleTwoPage from '@/pages/example-two.page.vue'
import HomePage from '@/pages/home.page.vue'
import ExampleFourPage from '../../pages/example-four.page.vue'
const routes = [
  { 
    path: '/', 
    component: HomePage,
    meta: { 
      title: 'Início - Demonstrações Three.js'
    }
  },
  { 
    path: '/example-2', 
    component: ExampleTwoPage,
    meta: { 
      title: 'Esfera Interativa - Three.js'
    }
  },
  { 
    path: '/example-3', 
    component: ExampleThreePage,
    meta: { 
      title: 'Controlando a Rotação e Cor - Three.js'
    }
  },
  {
    path: '/example-4', 
    component: ExampleFourPage,
    meta: { 
      title: 'Colisão - Three.js'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string || 'Demonstrações Three.js';
  next();
});

export { router }

