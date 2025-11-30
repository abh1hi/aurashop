import { createApp } from 'vue'
import './styles/main.css'
import App from './App.vue'
import router from './router'
import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/vue-tel-input.css';

const app = createApp(App)
app.use(router)
app.use(VueTelInput);
app.mount('#app')
