<!-- ChatComponent.vue-->
<template>
  <!-- 聊天容器，整个聊天界面的最外层容器 -->
  <div class="chat-container">
    <!-- 引入顶部按钮栏组件，用于提供额外的功能按钮 -->
    <ButtonBar
      @button2-click="handleButton2"
      @button3-click="handleButton3"
      @model-changed="handleModelChange"
    />

    <!-- 消息列表容器，用于显示聊天消息 -->
    <div ref="messagesList" class="messages-list">
      <!-- 使用 v-for 循环渲染消息列表 -->
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-wrapper"
        :class="message.sender"
      >
        <!-- 如果消息发送者是系统，则显示系统头像 -->
        <img
          v-if="message.sender === 'system'"
          src="/system-avatar.png"
          class="avatar"
          alt="System Avatar"
        />
        <!-- 消息内容盒子，显示消息文本 -->
        <div class="message-box" :class="message.sender">
          {{ message.text }}
        </div>
        <!-- 如果消息发送者是用户，则显示用户头像 -->
        <img
          v-if="message.sender === 'user'"
          src="/user-avatar.png"
          class="avatar"
          alt="User Avatar"
        />
      </div>
    </div>

    <!-- 输入容器，用于输入和发送消息 -->
    <div class="input-container">
      <!-- 输入框，使用 v-model 双向绑定 inputMessage -->
      <textarea
        v-model="inputMessage"
        class="message-input"
        placeholder="Type your message..."
        @input="adjustTextareaHeight"
        @keydown.enter.exact.prevent="sendMessage"
        @keydown.enter.shift.prevent="newLine"
      ></textarea>
      <!-- 发送按钮，点击时触发 sendMessage 方法 -->
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
// 引入顶部按钮栏组件
import ButtonBar from "./ChatComponentTopBar.vue";
// 引入 Vuex 的 mapState 和 mapMutations，用于访问 Vuex 中的状态和 mutations
import { mapState, mapMutations } from "vuex";
// 引入发送消息的服务
import { sendMessage } from "@/services/messageService";
// 引入 axios 用于发送 HTTP 请求
import axios from "axios";

export default {
  // 注册顶部按钮栏组件
  components: { ButtonBar },
  // 计算属性
  computed: {
    // 使用 Vuex 的 mapState 映射 selectedModel 和 isLoggedIn
    ...mapState({
      selectedModel: (state) => state.selectedModel,
      isLoggedIn: (state) => state.isLoggedIn,
    }),
  },
  // 数据
  data() {
    return {
      // 消息数组，存储聊天消息
      messages: [],
      // 输入框的内容
      inputMessage: "",
      // 上下文，用于存储聊天上下文信息
      context: [],
    };
  },
  // 监视 currentSessionId 和 isLoggedIn 的变化
  watch: {
    "$route.params.sessionId": {
      immediate: true, // 组件加载时立即执行一次
      handler(SessionId) {
        console.log("当前sessionId为", SessionId);
        if (SessionId && this.isLoggedIn) {
          this.fetchSessionMessages(SessionId);
        }
        else this.$router.push(`/`);
      },
    },
    // 监听 isLoggedIn 的变化
    isLoggedIn(newVal) {
      if (!newVal) {
        console.log("当前isLoggedIn为", newVal);
        // 如果用户未登录，清空会话内容
        this.clearSessionMessages();
      }
    },
  },
  // 方法
  methods: {
    // 使用 Vuex 的 mapMutations 映射 setSelectedModel
    ...mapMutations(["setSelectedModel"]),
    // 处理模型变化
    handleModelChange(model) {
      // 调用 Vuex 的 setSelectedModel 方法设置选中的模型
      console.log("更换为模型", model); // 检查是否成功获取token
      this.setSelectedModel(model);
    },
    // 发送消息
    async sendMessage() {
      // 如果用户未登录，则提示登录
      if (!this.isLoggedIn) {
        alert("请先登录！");
        return;
      }
      // 如果输入框的内容不为空
      if (this.inputMessage.trim() !== "") {
        // 获取用户输入的文本
        const userText = this.inputMessage.trim();
        // 将用户的消息添加到消息数组中
        this.messages.push({ text: userText, sender: "user" });
        // 清空输入框
        this.inputMessage = "";
        // 构造问题对象
        const question = { text: userText, images: [], audio: [], video: [] };
        try {
          // 调用 sendMessage 服务发送消息
          const newMessages = await sendMessage(
            this.selectedModel,
            question.text,
            question.images,
            question.audio,
            question.video,
            this.context || ""
          );
          // 将系统回复的消息添加到消息数组中
          this.messages.push({ text: newMessages.message, sender: "system" });
        } catch (error) {
          // 捕获错误并打印错误信息
          console.error("发送请求失败:", error);
          // 如果发送失败，则添加一条系统消息提示用户
          this.messages.push({
            text: "发送请求失败，请稍后再试。",
            sender: "system",
          });
        }
        // 在下次 DOM 更新后，调整输入框的高度并滚动到消息列表底部
        this.$nextTick(() => {
          const textarea = document.querySelector(".message-input");
          textarea.style.height = "40px";
        });
        this.scrollToBottom();
      }
    },
    // 获取会话消息
    async fetchSessionMessages(sessionId) {
      try {
        // 使用 axios 发送 GET 请求获取会话消息
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/sessions/${sessionId}/messages`
        );
        // 将获取到的消息转换为统一的格式并赋值给 messages 数组
        this.messages = response.data.map((message) => ({
          text: message.messageContent,
          sender: message.sender,
        }));
      } catch (error) {
        // 捕获错误并打印错误信息
        console.error("Failed to fetch session messages:", error);
      }
    },
    // 滚动到消息列表底部
    scrollToBottom() {
      // 在下次 DOM 更新后，执行滚动操作
      this.$nextTick(() => {
        const chatContainer = this.$refs.messagesList;
        if (chatContainer) {
          // 将滚动条滚动到消息列表的底部
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },
    // 按下 Shift + Enter 时换行
    newLine(event) {
      event.preventDefault();
      this.inputMessage += "\n";
      this.$nextTick(() => {
        const textarea = document.querySelector(".message-input");
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },
    // 调整输入框的高度
    adjustTextareaHeight(event) {
      const textarea = event.target;
      // 先将高度设置为 auto，让浏览器自动计算高度
      textarea.style.height = "auto";
      // 再将高度设置为内容的高度
      textarea.style.height = textarea.scrollHeight + "px";
    },
    // 清空当前会话消息
    clearSessionMessages() {
      this.messages = []; // 清空消息内容
      this.context = []; // 清空上下文内容
    },
  },
};
</script>

<style scoped>
/* 聊天容器的样式 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 消息列表的样式 */
.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f6f5f9;
  display: flex;
  flex-direction: column;
}

/* 消息容器的样式 */
.message-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  max-width: 80%;
}

/* 用户消息的样式 */
.message-wrapper.user {
  justify-content: flex-end;
  align-self: flex-end;
}

/* 系统消息的样式 */
.message-wrapper.system {
  justify-content: flex-start;
  align-self: flex-start;
}

/* 头像的样式 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

/* 消息内容盒子的样式 */
.message-box {
  padding: 10px 15px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  line-height: 1.4;
}

/* 用户消息内容盒子的样式 */
.message-box.user {
  background-color: #007bff;
  color: white;
}

/* 系统消息内容盒子的样式 */
.message-box.system {
  background-color: #f0f0f0;
  color: black;
}

/* 输入容器的样式 */
.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
}

/* 输入框的样式 */
.message-input {
  flex: 1;
  min-height: 40px;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  overflow-y: auto;
  font-size: 14px;
}

/* 发送按钮的样式 */
button {
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 发送按钮的悬停样式 */
button:hover {
  background-color: #0056b3;
}
</style>