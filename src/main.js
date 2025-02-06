import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import store from "./store/store"; // 导入 Vuex store

const app = createApp(App);
app.use(store); // 挂载 Vuex
app.use(ElementPlus);
app.mount('#app');
