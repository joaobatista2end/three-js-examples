import { createWebHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/home.page.vue'
import ExampleOnePage from '@/pages/example-one.page.vue'
import ExampleTwoPage from '@/pages/example-two.page.vue'

const routes = [
  { 
    path: '/', 
    component: HomePage,
    meta: { 
      title: 'Início - Demonstrações Three.js'
    }
  },
  { 
    path: '/example-1', 
    component: ExampleOnePage,
    meta: { 
      title: 'Cubo Animado - Three.js'
    }
  },
  { 
    path: '/example-2', 
    component: ExampleTwoPage,
    meta: { 
      title: 'Esfera Interativa - Three.js'
    }
  },
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