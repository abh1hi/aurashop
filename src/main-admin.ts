import { createApp } from 'vue'
import './style.css'
import App from './AppAdmin.vue'
import router from './router/admin' // Distinct Admin Router
import { createPinia } from 'pinia'

const app = createApp(App)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
}

app.use(createPinia() as any)
app.use(router)
app.mount('#app')
