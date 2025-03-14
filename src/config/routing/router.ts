import { createMemoryHistory, createRouter } from 'vue-router'

import HomePage from '@/pages/home.page.vue'
import ExampleOnePage from '@/pages/example-one.page.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/example-1', component: ExampleOnePage },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})