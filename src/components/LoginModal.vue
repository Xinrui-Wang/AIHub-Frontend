<template>
  <!-- 背景遮罩层，点击空白区域时关闭弹窗 -->
  <div class="modal-overlay" @click.self="closeModal">
    <!-- 弹窗内容区域 -->
    <div class="modal-content">
      <!-- 关闭按钮，点击时触发关闭弹窗的方法 -->
      <button @click="closeModal" class="close-btn">×</button>

      <!-- 弹窗标题 -->
      <h2>登录您的账户</h2>

      <!-- 登录表单，表单提交时调用 handleLogin 方法 -->
      <form @submit.prevent="handleLogin">
        <!-- 用户名输入框 -->
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="请输入用户名"
          :class="{ 'input-error': error && !username }"
          :disabled="isLoading"
        />

        <!-- 密码输入框 -->
        <label for="password">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="请输入密码"
          :class="{ 'input-error': error && !password }"
          :disabled="isLoading"
        />

        <!-- 错误信息 -->
        <div v-if="error" class="error-message">{{ error }}</div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="btn-primary"
          :disabled="isLoading"
          @click="handleLoginDebounced"
        >
          <span v-if="isLoading">正在登录...</span>
          <span v-else>登录</span>
        </button>
      </form>

      <!-- 注册和忘记密码按钮 -->
      <div class="extra-actions">
        <button @click="register" class="link-btn">注册</button>
        <button @click="forgotPassword" class="link-btn">忘记密码</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

// 防抖函数实现
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export default {
  data() {
    return {
      username: "", // 用户名输入
      password: "", // 密码输入
      error: "", // 错误信息
      isLoading: false, // 添加加载状态
    };
  },
  methods: {
    handleLogin() {
      // 校验用户名和密码是否为空
      if (!this.username || !this.password) {
        this.error = "用户名和密码不能为空";
        return;
      }

      // 开始加载状态
      this.isLoading = true;
      this.error = ""; // 清空错误信息

      // 发送登录请求
      axios
        .post("http://localhost:3000/api/login", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.data.success) {
            // 登录成功逻辑
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            this.$emit("login-success", response.data.user);
            this.closeModal(); // 关闭弹窗
          } else {
            // 显示后端返回的错误信息
            this.error = response.data.message || "用户名或密码错误";
          }
        })
        .catch((error) => {
          // 网络错误处理
          console.error("登录请求失败：", error);
          this.error = "登录失败，请检查网络连接或稍后再试";
        })
        .finally(() => {
          // 无论成功与否，取消加载状态
          this.isLoading = false;
        });
    },
    // 包装 handleLogin 方法，防止快速连续点击
    handleLoginDebounced: debounce(function () {
      this.handleLogin();
    }, 1000), // 防抖延迟 1 秒
    closeModal() {
      // 关闭弹窗
      this.$emit("close");
    },
    register() {
      // 注册方法，实际的注册逻辑未实现
      console.log("注册逻辑触发");
    },
    forgotPassword() {
      // 忘记密码方法，实际的密码恢复逻辑未实现
      console.log("忘记密码逻辑触发");
    },
  },
};
</script>

<style scoped>
/* 背景遮罩层样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明黑色背景 */
  display: flex;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  z-index: 1000; /* 确保弹窗显示在最上层 */
}

/* 弹窗内容区域样式 */
.modal-content {
  position: relative; /* 相对定位，使关闭按钮能够在内容区域内定位 */
  background: white;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  text-align: center; /* 文本居中 */
}

/* 错误消息的样式 */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* 输入框错误时的样式 */
.input-error {
  border: 1px solid red; /* 输入框边框变为红色 */
}

/* 输入框样式 */
input {
  display: block;
  width: 80%; /* 输入框宽度占父容器的80% */
  padding: 10px;
  margin: 10px 0; /* 输入框之间的间距 */
  border-radius: 4px; /* 圆角 */
  border: 1px solid #ddd; /* 灰色边框 */
}

/* 按钮样式 */
button {
  padding: 10px 20px;
  background-color: #007bff; /* 蓝色背景 */
  color: white;
  border: none;
  border-radius: 5px; /* 圆角 */
  cursor: pointer;
}

/* 按钮鼠标悬停样式 */
button:hover {
  background-color: #0056b3; /* 鼠标悬停时背景变深 */
}

/* 按钮加载状态样式 */
button:disabled {
  background-color: #cccccc; /* 禁用时按钮变灰 */
  cursor: not-allowed;
}

/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

/* 关闭按钮鼠标悬停样式 */
.close-btn:hover {
  color: #000; /* 鼠标悬停时颜色变为黑色 */
}

/* 注册和忘记密码按钮样式 */
.extra-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between; /* 按钮间距平分 */
}

/* 超链接按钮样式 */
.link-btn {
  background: none;
  border: none;
  color: #007bff; /* 蓝色文字 */
  text-decoration: underline; /* 下划线 */
  cursor: pointer;
}

/* 超链接按钮鼠标悬停样式 */
.link-btn:hover {
  color: #0056b3; /* 鼠标悬停时文字颜色变深 */
  text-decoration: none; /* 鼠标悬停时移除下划线 */
}
</style>
