// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from 'D:/Code/AIHub-Frontend/src/App.vue';  // 示例视图组件

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/s/:sessionId',
    name: 'session',
    component: () => import('D:/Code/AIHub-Frontend/src/components/ChatComponent.vue'),  // 确保路径正确
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
