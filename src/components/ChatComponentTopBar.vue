<!-- ChatComponentTopBar.vue -->
<template>
  <div class="button-container">
    <!-- 下拉按钮 -->
    <div class="dropdown">
      <!-- 触发下拉菜单的按钮，绑定点击事件 -->
      <button class="dropdown-btn" @click="toggleDropdown">
        {{ selectedModel }} <span class="arrow">&#9662;</span>
      </button>
      <div v-if="dropdownVisible" class="dropdown-list">
        <div
          v-for="(model, index) in models"
          :key="index"
          class="dropdown-item"
          @click="selectModel(model)"
        >
          {{ model }}
        </div>
      </div>
    </div>

    <!-- 其他按钮 -->
    <button @click="handleButton2">按钮 2</button>

    <!-- 登录/个人资料按钮 -->
    <div class="profile-container">
      <button v-if="!isLoggedIn" @click="showLoginModal" class="btn-primary">
        登录
      </button>
      <button v-else @click="toggleProfileMenu" class="btn-primary">
        {{ userInfo.nickname || "个人资料" }}
      </button>

      <div v-if="profileMenuVisible" class="profile-popup">
        <div class="profile-info">
          <img
            :src="userInfo.avatar || defaultAvatar"
            alt="Avatar"
            class="avatar"
          />
          <span>{{ userInfo.nickname || "未登录" }}</span>
        </div>
        <div class="profile-actions">
          <button @click="viewProfile">查看资料</button>
          <button @click="logout">退出登录</button>
        </div>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal
      v-if="isLoginModalVisible"
      @close="isLoginModalVisible = false"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script>
// 引入 Vuex 的 mapState 和 mapActions
import axios from "axios";
// import modelsConfig from "@/config/modelsConfig";
import LoginModal from "./LoginModal.vue";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      // models: modelsConfig.models, // 模型列表，来自配置文件
      // selectedModel: modelsConfig.defaultModel, // 默认选中的模型
      dropdownVisible: false, // 控制下拉菜单的显示与隐藏
      isLoginModalVisible: false, // 控制登录弹窗的显示与隐藏
      defaultAvatar: "https://via.placeholder.com/40", // 默认头像
    };
  },
  components: {
    LoginModal, // 注册登录弹窗组件
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo, // 从 Vuex 获取 userInfo
      isLoggedIn: (state) => state.isLoggedIn, // 从 Vuex 获取登录状态
      profileMenuVisible: (state) => state.profileMenuVisible, // 从 Vuex 获取个人资料弹窗显示状态
      selectedModel: (state) => state.selectedModel, // 从 Vuex 获取选中的模型
      models: (state) => state.models, // 从 Vuex 获取 models 数组
    }),
  },
  mounted() {
    this.checkAutoLogin(); // 组件加载时检查自动登录
  },
  methods: {
    ...mapActions([
      "updateUserInfo", // Vuex action 用于更新用户信息
      "updateToken", // Vuex action 用于更新 token
      "updateLoginStatus", // Vuex action 用于更新登录状态
      "toggleProfileMenu", // Vuex action 用于切换个人资料弹窗显示状态
      "updateSelectedModel", // Vuex action 用于更新选中的模型
    ]),

    checkAutoLogin() {
      const jwtToken = this.$store.state.token; // 使用 Vuex 中的 token
      console.log("JWT Token from Vuex:", jwtToken); // 检查是否成功获取token
      if (jwtToken) {
        this.verifyToken(jwtToken); // 调用验证token的函数
      } else {
        console.log("No JWT Token found in Vuex");
      }
    },
    verifyToken(token) {
      console.log("Verifying Token...");
      axios
        .get(`${process.env.VUE_APP_API_URL}/users/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userInfo = response.data.user;
          const token = response.data.token;

          if (userInfo && token) {
            console.log("Token verified successfully:", userInfo, token);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            localStorage.setItem("token", token);

            this.updateUserInfo(userInfo); // 更新 Vuex 中的 userInfo
            this.updateToken(token); // 更新 Vuex 中的 token
            this.updateLoginStatus(true); // 设置登录状态
          }
        })
        .catch((error) => {
          console.error("Token verification failed:", error);
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          // this.$router.push("/");
        });
    },

    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },

    selectModel(model) {
      this.updateSelectedModel(model); // 更新选中的模型
      this.dropdownVisible = false;
      this.$emit("model-changed", model); // 向父组件发送模型改变事件
    },

    handleButton2() {
      this.$emit("button2-click"); // 触发自定义事件
    },

    showLoginModal() {
      this.isLoginModalVisible = true; // 显示登录弹窗
    },

    handleLoginSuccess(userInfo) {
      console.log("登录成功，接收用户信息:", userInfo);
      this.updateLoginStatus(true); // 更新登录状态
      this.updateUserInfo(userInfo); // 更新用户信息
      this.isLoginModalVisible = false; // 关闭登录弹窗
    },

    toggleProfileMenu() {
      this.$store.commit(
        "setProfileMenuVisible",
        !this.$store.state.profileMenuVisible
      );
    },

    viewProfile() {
      console.log("查看个人资料");
    },

    logout() {
      console.log("用户退出登录");
      this.$store.dispatch("updateToken", ""); // 清空 token
      this.$store.dispatch("updateUserInfo", { nickname: "", avatar: "" }); // 清空用户信息
      this.$store.dispatch("updateLoginStatus", false); // 设置未登录状态
      this.$store.commit("setSessionList", []); // 清空会话列表
      this.$store.commit("setProfileMenuVisible", false); // 隐藏个人资料弹窗
    },
  },
};
</script>

<style scoped>
/* 按钮容器，设置容器的布局和样式 */
.button-container {
  display: flex;
  justify-content: space-around; /* 子元素水平均匀分布 */
  padding: 10px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #ddd;
}

/* 下拉菜单容器 */
.dropdown {
  position: relative; /* 设置为相对定位，以便下拉列表定位 */
}

/* 下拉按钮样式 */
.dropdown-btn {
  padding: 10px 20px;
  background-color: #007bff; /* 按钮背景色 */
  border: 1px solid #ddd; /* 按钮边框 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标悬浮时显示指针 */
  display: flex;
  justify-content: space-between; /* 按钮内部元素分布 */
  align-items: center;
}

/* 下拉箭头样式 */
.arrow {
  margin-left: 5px;
}

/* 下拉列表样式 */
.dropdown-list {
  position: absolute; /* 绝对定位，显示在按钮下方 */
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

/* 每个下拉项的样式 */
.dropdown-item {
  padding: 10px 20px;
  cursor: pointer;
}

/* 鼠标悬停时高亮显示 */
.dropdown-item:hover {
  background-color: #007bff;
  color: white;
}

/* 按钮基本样式 */
button {
  padding: 10px 20px;
  background-color: #007bff; /* 按钮背景色 */
  color: white; /* 按钮文字颜色 */
  border: none;
  border-radius: 5px; /* 按钮圆角 */
  cursor: pointer;
}

/* 按钮悬停样式 */
button:hover {
  background-color: #0056b3;
}

/* 个人资料容器样式 */
.profile-container {
  position: relative; /* 相对定位 */
}

/* 个人资料弹窗样式 */
.profile-popup {
  position: absolute;
  top: 100%; /* 弹窗显示在个人资料按钮下方 */
  left: 0;
  width: 200px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 10;
}

/* 个人资料信息区域样式 */
.profile-info {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

/* 头像样式 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px;
}

/* 个人资料按钮的样式 */
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 按钮之间的间隔 */
  padding: 10px 0;
}

/* 个人资料按钮的悬停效果 */
.profile-actions button {
  background: none;
  border: none;
  color: #007bff; /* 按钮文字颜色 */
  text-align: left;
  padding: 5px 10px;
  cursor: pointer;
}

/* 悬停效果 */
.profile-actions button:hover {
  background-color: #f1f1f1;
}

/* 主按钮样式 */
.btn-primary {
  padding: 10px 20px;
  background-color: #007bff;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>