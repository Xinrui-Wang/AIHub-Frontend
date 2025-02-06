<!-- LoginModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @mousedown.stop>
      <button @click="closeModal" class="close-btn">×</button>

      <h2>登录您的账户</h2>

      <form @submit.prevent="handleLogin">
        <label for="emailOrPhone">邮箱/手机号</label>
        <input
          id="emailOrPhone"
          v-model="emailOrPhone"
          type="text"
          placeholder="请输入邮箱或手机号"
          :class="{ 'input-error': error && !emailOrPhone }"
          :disabled="isLoading"
        />

        <label for="password">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="请输入密码"
          :class="{ 'input-error': error && !password }"
          :disabled="isLoading"
        />

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          <span v-if="isLoading">正在登录...</span>
          <span v-else>登录</span>
        </button>
      </form>

      <div class="extra-actions">
        <button @click="register" class="link-btn">注册</button>
        <button @click="forgotPassword" class="link-btn">忘记密码</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex"; // 导入 Vuex 的 mapActions

export default {
  data() {
    return {
      emailOrPhone: "", // 存储用户输入的邮箱或手机号
      password: "", // 存储用户输入的密码
      error: "", // 错误信息，显示在表单下方
      isLoading: false, // 控制登录请求的加载状态
    };
  },
  methods: {
    ...mapActions([
      "updateUserInfo", // Vuex action，更新用户信息
      "updateToken", // Vuex action，更新 token
      "updateLoginStatus", // Vuex action，更新登录状态
    ]),

    // 处理登录逻辑
    handleLogin() {
      // 检查邮箱/手机号和密码是否为空
      if (!this.emailOrPhone || !this.password) {
        this.error = "邮箱/手机号和密码不能为空";
        return;
      }

      // 校验邮箱格式或手机号格式
      const isEmail = /\S+@\S+\.\S+/.test(this.emailOrPhone); // 正则表达式检查邮箱格式
      const isPhoneNumber = /^\d{11}$/.test(this.emailOrPhone); // 正则表达式检查手机号格式

      // 如果既不是邮箱也不是手机号，显示错误信息
      if (!isEmail && !isPhoneNumber) {
        this.error = "请输入有效的邮箱或手机号";
        return;
      }

      // 启动加载状态
      this.isLoading = true;
      this.error = ""; // 清空错误信息

      // 构建请求体
      const requestPayload = {
        password: this.password, // 密码
      };

      // 根据输入的是邮箱还是手机号，动态构造请求体
      if (isEmail) {
        requestPayload.userEmail = this.emailOrPhone;
      } else if (isPhoneNumber) {
        requestPayload.userPhoneNumber = this.emailOrPhone;
      }

      // 发送登录请求
      axios
        .post("http://localhost:3000/users/login", requestPayload)
        .then((response) => {
          const userInfo = response.data.user; // 获取用户信息
          const token = response.data.token; // 获取JWT Token

          if (userInfo && token) {
            // 存储用户信息和Token到localStorage
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            localStorage.setItem("token", token);

            // 使用 Vuex 更新 userInfo 和 token
            this.updateUserInfo(userInfo); // 更新用户信息
            this.updateToken(token); // 更新 token
            this.updateLoginStatus(true); // 设置登录状态

            // 向父组件发送登录成功事件
            this.$emit("login-success", userInfo);

            // 关闭弹窗
            this.closeModal();
          } else {
            this.error = "用户名或密码错误"; // 登录失败时的错误提示
          }
        })
        .catch((error) => {
          console.error("登录请求失败：", error);
          this.error = "登录失败，请检查网络连接或稍后再试"; // 显示网络错误提示
        })
        .finally(() => {
          this.isLoading = false; // 请求结束，取消加载状态
        });
    },

    // 关闭弹窗的方法
    closeModal() {
      this.$emit("close"); // 向父组件发送关闭弹窗事件
    },

    // 注册按钮的逻辑
    register() {
      console.log("注册逻辑触发");
    },

    // 忘记密码按钮的逻辑
    forgotPassword() {
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
  text-decoration: none; /* 鼠标悬停时去掉下划线 */
}
</style>
