<template>
  <div class="button-container">
    <!-- 下拉按钮 -->
    <div class="dropdown">
      <!-- 触发下拉菜单的按钮，绑定点击事件 -->
      <button class="dropdown-btn" @click="toggleDropdown">
        <!-- 显示当前选中的模型 -->
        {{ selectedModel }} <span class="arrow">&#9662;</span>
      </button>
      <!-- 下拉列表，仅在 dropdownVisible 为 true 时显示 -->
      <div v-if="dropdownVisible" class="dropdown-list">
        <!-- 遍历模型列表，生成下拉项 -->
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
      <!-- 未登录时显示登录按钮 -->
      <button v-if="!isLoggedIn" @click="showLoginModal" class="btn-primary">
        登录
      </button>
      <!-- 已登录时显示个人资料按钮，显示用户名或“个人资料” -->
      <button v-else @click="toggleProfileMenu" class="btn-primary">
        {{ userInfo.username || "个人资料" }}
      </button>

      <!-- 个人资料弹窗 -->
      <div v-if="profileMenuVisible" class="profile-popup">
        <div class="profile-info">
          <!-- 用户头像，如果没有则使用默认头像 -->
          <img
            :src="userInfo.avatar || defaultAvatar"
            alt="Avatar"
            class="avatar"
          />
          <span>{{ userInfo.username }}</span>
        </div>
        <div class="profile-actions">
          <!-- 查看资料和退出登录按钮 -->
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
// 导入模型配置文件和登录弹窗组件
import modelsConfig from "@/config/modelsConfig"; // 引入配置文件
import LoginModal from "./LoginModal.vue"; // 确保路径正确

export default {
  data() {
    return {
      models: modelsConfig.models, // 模型列表，来自配置文件
      selectedModel: modelsConfig.defaultModel, // 默认选中的模型
      dropdownVisible: false, // 控制下拉菜单的显示与隐藏
      isLoginModalVisible: false, // 控制登录弹窗的显示与隐藏
      isLoggedIn: false, // 用户登录状态，默认未登录
      profileMenuVisible: false, // 控制个人资料弹窗的显示与隐藏
      userInfo: { username: "小明", avatar: "" }, // 初始用户信息，用户名为“小明”
      defaultAvatar: "https://via.placeholder.com/40", // 默认头像
    };
  },
  components: {
    LoginModal // 注册登录弹窗组件
  },
  methods: {
    toggleDropdown() {
      // 切换下拉菜单的可见状态
      this.dropdownVisible = !this.dropdownVisible;
    },
    selectModel(model) {
      // 选择一个模型并关闭下拉菜单
      this.selectedModel = model;
      this.dropdownVisible = false;
      this.$emit("model-changed", model); // 向父组件发送模型改变事件
    },
    handleButton2() {
      // 处理按钮2的点击事件，触发自定义事件
      this.$emit("button2-click");
    },
    showLoginModal() {
      // 显示登录弹窗
      this.isLoginModalVisible = true;
    },
    handleLoginSuccess(userInfo) {
      // 登录成功后处理，更新用户信息并关闭登录弹窗
      this.isLoggedIn = true;
      this.userInfo = userInfo;
      this.isLoginModalVisible = false;
    },
    handleLogin() {
      // 模拟登录，通常应该请求后台接口进行验证
      console.log("点击登录按钮");
      setTimeout(() => {
        // 模拟登录成功，设置用户信息
        this.isLoggedIn = true;
        this.userInfo = { username: "小明", avatar: "" };
        console.log("用户已登录");
      }, 1);  // 模拟异步操作
    },
    toggleProfileMenu() {
      // 切换个人资料弹窗的可见状态
      this.profileMenuVisible = !this.profileMenuVisible;
    },
    viewProfile() {
      // 处理查看个人资料按钮的点击事件
      console.log("查看个人资料");
    },
    logout() {
      // 处理退出登录的逻辑
      console.log("用户退出登录");
      this.isLoggedIn = false;
      this.profileMenuVisible = false;
      this.userInfo = { username: "", avatar: "" }; // 清空用户信息
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
