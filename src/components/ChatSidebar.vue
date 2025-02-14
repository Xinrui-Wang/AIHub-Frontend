<!-- ChatSidebar.vue -->
<template>
  <el-menu class="menu" default-active="1" :router="false">
    <!-- 新对话按钮 -->
    <el-menu-item index="1">
      <i class="el-icon-house"></i>
      <span>新对话</span>
    </el-menu-item>

    <!-- 社区入口按钮 -->
    <el-menu-item index="2">
      <i class="el-icon-message"></i>
      <span>社区入口</span>
    </el-menu-item>

    <!-- 设置按钮 -->
    <el-menu-item index="3">
      <i class="el-icon-setting"></i>
      <span>设置</span>
    </el-menu-item>

    <!-- 横线分隔 -->
    <div class="divider"></div>

    <!-- 动态生成会话列表 -->
    <template v-for="(session, index) in sessionList" :key="session.sessionId">
      <el-menu-item :index="String(index + 4)">
        <el-button
          class="session-button"
          type="text"
          @click="loadSessionMessages(session.sessionId)"
        >
          {{ session.sessionName }}
        </el-button>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ChatSidebar",
  computed: {
    ...mapState({
      userId: (state) => state.userInfo.id, // 获取 Vuex 中的 userId
      sessionList: (state) => state.sessionList, // 获取 Vuex 中的 sessionList
    }),
  },
  mounted() {
    // 当组件挂载后，检查用户是否已登录
    if (this.userId) {
      this.$store.dispatch("fetchSessionList"); // 使用 action 从 Vuex 中直接管理会话请求
      // 确保 fetchSessionList 完成后再打印 sessionList
      console.log("获取到的会话列表：", this.sessionList);
    } else {
      this.$store.commit("setSessionList", []); // 未登录时清空会话
      console.log("用户未登录，无法加载会话列表");
    }
  },
  methods: {
    loadSessionMessages(sessionId) {
      // 通过 Vue Router 动态修改 URL
      this.$router.push(`/s/${sessionId}`); // 修改 URL 为 /s/session_id
    },
  },
};
</script>

<style scoped>
.menu {
  width: 240px;
  height: 100%;
  background-color: #f5f5f5;
}

.el-menu-item {
  color: #000;
}

.el-menu-item:hover {
  background-color: #e0e0e0;
}

.el-menu-item.is-active {
  color: #000;
}

.divider {
  height: 1px;
  background-color: #dcdcdc;
  margin: 8px 0;
}

.session-button {
  width: 100%;
  justify-content: center;
  color: #333;
  text-align: center;
  font-size: 14px;
  padding: 8px;
}
</style>