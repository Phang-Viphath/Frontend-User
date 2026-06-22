import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import toast from './util/toast'
import router from './router'
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).use(toast).mount('#app')
