import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import store from "./store/store"; // 导入 Vuex store
import router from './router';  // 引入 Vue Router

const app = createApp(App);
app.use(store); // 挂载 Vuex
app.use(router)  // 使用 Vue Router
app.use(ElementPlus);
app.mount('#app');
