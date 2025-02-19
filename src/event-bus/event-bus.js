import { createApp } from 'vue'; // Vue 3 的导入方式
const app = createApp({}); // 创建 Vue 应用实例
const eventBus = {}; //  Vue 3 中不再使用 new Vue() 创建事件总线，通常使用mitt库或者发布订阅模式实现
app.config.globalProperties.$eventBus = eventBus; // 将 eventBus 挂载到全局属性