import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './config/routing/router'
import './config/tailwindcss/main.css'

createApp(App).use(router).mount('#app')
