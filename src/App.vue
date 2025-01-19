<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <ChatSidebar />

    <!-- 内容区域，包括聊天输入框和聊天消息显示 -->
    <div class="content">
      <ChatComponent />
    </div>

  </div>
</template>

<script>
import ChatSidebar from './components/ChatSidebar.vue';
import ChatComponent from './components/ChatComponent.vue'; // 导入 ChatComponent 组件

export default {
  name: "App",
  components: {
    ChatSidebar,
    ChatComponent, // 注册 ChatComponent
  },
};
</script>

<style>
.layout {
  display: flex;
  height: 100vh; /* 撑满屏幕高度 */
}

/* 侧边栏样式 */
.layout > .menu {
  width: 240px; /* 固定侧边栏宽度 */
  height: 100%;
}

/* 内容区域样式 */
.content {
  flex: 1; /* 占据剩余空间 */
  position: relative; /* 作为 ChatComponent 的定位父容器 */
  background-color: #f5f5f5; /* 背景色（可根据需求修改） */
}
</style>
