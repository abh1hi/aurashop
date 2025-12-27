import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'
import 'material-icons/iconfont/material-icons.css';
import './theme.css';
import './plugins/material-web';

const app = createApp(App)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
}

app.use(createPinia() as any)
app.use(router)
app.use(VueTelInput)
app.mount('#app')
