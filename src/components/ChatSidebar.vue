<!-- ChatSidebar -->
<template>
  <el-menu class="menu" default-active="1" :router="false">
    <!-- 新对话按钮 -->
    <el-menu-item index="1" @click="handleCreateNewSession($event)">
      <i class="el-icon-house"></i>
      <span>新对话</span>
      <!-- 修改这里 -->
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
import { mapState, mapMutations, mapActions } from "vuex";

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
      console.log("获取到的会话列表：", this.sessionList);
    } else {
      this.$store.commit("setSessionList", []); // 未登录时清空会话
      console.log("用户未登录，无法加载会话列表");
    }
  },
  methods: {
    ...mapMutations(["setSessionList"]), // 映射 Vuex 的 setSessionList 方法
    ...mapActions(["createNewSession"]), // 映射 Vuex 的 createNewSession 方法

    // 加载会话消息
    loadSessionMessages(sessionId) {
      this.$router.push(`/s/${sessionId}`); // 修改 URL 为 /s/session_id
    },

    // 新对话按钮的点击事件处理函数

    async handleCreateNewSession() {
      event.stopPropagation(); // 阻止事件冒泡
      console.log("新对话按钮被点击");

      const currentSessionId = sessionStorage.getItem("sessionId");
      const hasMessages = currentSessionId
        ? this.$store.dispatch("getSessionHasMessages", currentSessionId)
        : false;

      // 场景1：当前会话存在且为空 → 直接复用
      if (currentSessionId && !hasMessages) {
        this.$router.push(`/s/${currentSessionId}`);
        return;
      }

      // 场景2：需要创建新会话
      try {
        const newSessionId = await this.createNewSession();
        this.$router.push(`/s/${newSessionId}`);
      } catch (error) {
        console.error("创建新会话失败：", error);
        // alert("创建新会话失败，请稍后再试");
      }
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
  justify-content: left;
  color: #333;
  text-align: center;
  font-size: 14px;
  padding: 8px;
}
</style>
