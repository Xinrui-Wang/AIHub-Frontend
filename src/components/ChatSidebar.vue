<template>
  <el-menu class="menu" default-active="1" :router="false">
    <!-- 新对话按钮 -->
    <el-menu-item index="1" @click="handleCreateNewSession">
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

    <div class="divider"></div>

    <!-- 会话列表 -->
    <template
      v-for="(session, index) in sessionListWithState"
      :key="session.sessionId"
    >
      <el-menu-item :index="String(index + 4)" class="session-item">
        <span
          class="session-name"
          @click="loadSessionMessages(session.sessionId)"
        >
          {{ session.sessionName }}
        </span>

        <!-- 操作按钮 & 二级卡片 -->
        <el-popover
          v-model:visible="session.showActionCard"
          placement="bottom-end"
          trigger="manual"
          :visible-arrow="false"
          popper-class="session-action-card"
          @show="handlePopoverShow(session.sessionId)"
        >
          <template #reference>
            <!-- 三点按钮（优化样式版） -->
            <el-button
              class="action-trigger"
              @click.stop="toggleActionCard(session.sessionId)"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                class="three-dots-icon"
              >
                <circle cx="8" cy="4" r="1.5" fill="currentColor"></circle>
                <circle cx="8" cy="8" r="1.5" fill="currentColor"></circle>
                <circle cx="8" cy="12" r="1.5" fill="currentColor"></circle>
              </svg>
            </el-button>
          </template>

          <el-button
            type="danger"
            size="small"
            @click="confirmDeleteSession(session.sessionId)"
          >
            <i class="el-icon-delete"></i> 删除会话
          </el-button>
        </el-popover>
      </el-menu-item>
    </template>
  </el-menu>

  <!-- 删除确认对话框 -->
  <el-dialog
    v-model="showDeleteConfirm"
    title="确认删除"
    width="400px"
    :close-on-click-modal="false"
  >
    <span>删除后会话将不可恢复，确认删除吗？</span>
    <template #footer>
      <el-button @click="showDeleteConfirm = false">取消</el-button>
      <el-button type="danger" @click="executeDelete">确认删除</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ChatSidebar",
  data() {
    return {
      showDeleteConfirm: false,
      deletingSessionId: null,
      clickLock: false,
      localSessionStates: {},
      activePopoverId: null,
    };
  },
  computed: {
    ...mapState({
      userId: (state) => state.userInfo.id,
      sessionList: (state) => state.sessionList,
    }),
    sessionListWithState() {
      return this.sessionList.map((session) => ({
        ...session,
        showActionCard:
          this.localSessionStates[session.sessionId]?.showActionCard || false,
      }));
    },
  },
  mounted() {
    if (this.userId) {
      this.$store.dispatch("fetchSessionList");
    }
  },
  beforeUnmount() {
    this.removeOutsideClickListener();
  },
  methods: {
    ...mapMutations(["setSessionList"]),
    ...mapActions(["createNewSession", "deleteSession"]),

    // 处理Popover显示事件
    handlePopoverShow(sessionId) {
      this.activePopoverId = sessionId;
      this.addOutsideClickListener();
    },

    // 添加全局点击监听
    addOutsideClickListener() {
      document.addEventListener("click", this.handleOutsideClick);
    },

    // 移除全局点击监听
    removeOutsideClickListener() {
      document.removeEventListener("click", this.handleOutsideClick);
    },

    // 处理外部点击
    handleOutsideClick(event) {
      const isClickInside =
        event.target.closest(".session-action-card") ||
        event.target.closest(".action-trigger");

      if (!isClickInside && this.activePopoverId) {
        this.closeActionCard(this.activePopoverId);
        this.removeOutsideClickListener();
        this.activePopoverId = null;
      }
    },

    // 关闭指定卡片
    closeActionCard(sessionId) {
      this.localSessionStates = {
        ...this.localSessionStates,
        [sessionId]: { showActionCard: false },
      };
    },

    // 切换操作卡片
    toggleActionCard(sessionId) {
      if (this.clickLock) return;

      this.clickLock = true;
      this.localSessionStates = {
        ...this.localSessionStates,
        [sessionId]: {
          showActionCard: !this.localSessionStates[sessionId]?.showActionCard,
        },
      };

      setTimeout(() => {
        this.clickLock = false;
      }, 300);
    },

    // 确认删除
    confirmDeleteSession(sessionId) {
      this.deletingSessionId = sessionId;
      this.showDeleteConfirm = true;
      this.closeAllActionCards();
    },

    // 关闭所有卡片
    closeAllActionCards() {
      Object.keys(this.localSessionStates).forEach((sessionId) => {
        this.localSessionStates[sessionId].showActionCard = false;
      });
      this.removeOutsideClickListener();
    },

    // 执行删除
    async executeDelete() {
      try {
        await this.deleteSession(this.deletingSessionId);
        this.$message.success("删除成功");

        if (sessionStorage.getItem("sessionId") === this.deletingSessionId) {
          this.$router.push("/");
        }
      } catch (error) {
        this.$message.error("删除失败: " + error.message);
      } finally {
        this.showDeleteConfirm = false;
      }
    },

    loadSessionMessages(sessionId) {
      this.$router.push(`/s/${sessionId}`);
    },

    async handleCreateNewSession(event) {
      event?.stopPropagation();
      console.log("新对话按钮被点击");

      const currentSessionId = sessionStorage.getItem("sessionId");
      const hasMessages = currentSessionId
        ? await this.$store.dispatch("getSessionHasMessages", currentSessionId)
        : false;

      if (currentSessionId && !hasMessages) {
        this.$router.push(`/s/${currentSessionId}`);
        return;
      }

      try {
        const newSessionId = await this.createNewSession();
        this.$router.push(`/s/${newSessionId}`);
      } catch (error) {
        console.error("创建新会话失败：", error);
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

.menu .el-menu-item,
.menu .el-menu-item span {
  color: #333 !important;
}

.menu .el-menu-item:hover,
.menu .el-menu-item:hover span {
  color: #409eff !important;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px !important;
}

.session-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 12px;
}

.action-trigger {
  padding: 0;
  margin-left: 8px;
  width: 24px;
  height: 24px;
  color: #999;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-trigger:hover {
  color: #666;
  background-color: #eee;
  border-radius: 4px;
}

.three-dots-icon {
  transition: transform 0.2s;
}

.action-trigger:hover .three-dots-icon {
  transform: scale(1.2);
}

.divider {
  height: 1px;
  background-color: #dcdcdc;
  margin: 8px 0;
}
</style>

<style>
.session-action-card {
  padding: 8px !important;
  min-width: 100px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: none;
}

.session-action-card .el-button {
  width: 100%;
  justify-content: flex-start;
  padding: 8px 12px;
  transition: all 0.2s;
}

.session-action-card .el-button:hover {
  transform: translateX(3px);
}
</style>