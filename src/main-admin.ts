import { createApp } from 'vue'
// import './style.css' // Removed to prevent conflict with admin-theme.css
import App from './AppAdmin.vue'
import router from './router/admin' // Distinct Admin Router
import { createPinia } from 'pinia'
import 'material-icons/iconfont/material-icons.css';
import './Admin_Pages/styles/admin-reset.css';
import './Admin_Pages/admin-theme.css';
import './plugins/material-web';

const app = createApp(App)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
}

app.use(createPinia() as any)
app.use(router)
app.mount('#app')
