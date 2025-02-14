<!-- App.vue -->
<template>
  <div class="layout">
    <!-- 侧边栏，包含菜单等内容 -->
     <chatSidebar/>

    <!-- 内容区域，包括聊天输入框、聊天消息显示等核心功能 -->
    <div class="content">
      <ChatComponent/>
    </div>
  </div>
</template>

<script>
import ChatSidebar from "./components/ChatSidebar.vue";  // 引入侧边栏组件
import ChatComponent from "./components/ChatComponent.vue";  // 引入聊天组件

export default {
  name: "App",
  components: {
    ChatSidebar,  // 注册侧边栏组件
    ChatComponent,  // 注册聊天组件
  },
};
</script>

<style>
.layout {
  display: flex;  /* 使用 flex 布局，使内容区域和侧边栏可以水平排列 */
  height: 100vh;  /* 设置布局撑满屏幕的高度 */
}

/* 侧边栏样式 */
.layout > .menu {
  width: 240px;  /* 设置侧边栏宽度为 240px */
  height: 100%;  /* 使侧边栏高度占满整个页面 */
}

/* 内容区域样式 */
.content {
  flex: 1;  /* 使内容区域占据剩余空间 */
  position: relative;  /* 设置定位，使其可以作为 ChatComponent 的定位父容器 */
  background-color: #f5f5f5;  /* 设置内容区域背景色 */
}
</style>
