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
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import ButtonBar from "./ChatComponentTopBar.vue";
import { sendMessage } from "@/services/messageService";

export default {
  components: { ButtonBar }, // 引入并注册顶部按钮栏组件

  computed: {
    // 映射 Vuex 状态
    ...mapState({
      selectedModel: (state) => state.selectedModel, // 当前选中的模型
      isLoggedIn: (state) => state.isLoggedIn, // 是否已登录
      sessionId: (state) => state.sessionId, // 当前会话 ID
    }),
  },

  data() {
    return {
      messages: [], // 存储聊天消息
      inputMessage: "", // 存储用户输入内容
      context: [], // 存储对话上下文
    };
  },

  watch: {
    /**
     * 监听路由参数 sessionId 变化
     * 1. 当 sessionId 变化时，若用户已登录：
     *    - 更新 Vuex 中的 sessionId
     *    - 拉取该会话的历史消息
     * 2. 若用户未登录，则跳转回主页
     */
    "$route.params.sessionId": {
      immediate: true, // 组件初始化时立即执行
      handler(newSessionId) {
        console.log("完整路由对象:", this.$route);
        console.log("当前 sessionId 为", newSessionId);
        console.log("isLoggedIn:", this.isLoggedIn);

        if (newSessionId && this.isLoggedIn) {
          this.setSessionId(newSessionId); // 更新 Vuex 中的 sessionId
          this.fetchSessionMessages(newSessionId); // 拉取历史消息
        } else {
          this.$router.push(`/`); // 未登录时跳转到首页
        }
      },
    },

    /**
     * 监听 isLoggedIn（登录状态）的变化
     * 若用户登出，则清空当前会话消息
     */
    isLoggedIn(newVal) {
      console.log("登录状态变化为:", newVal);
      if (!newVal) {
        this.clearSessionMessages();
      }
    },
  },

  mounted() {
    // 组件挂载后，若 Vuex 里已有 sessionId 且当前在首页，则跳转到对应会话
    if (this.sessionId && this.$route.path === "/") {
      this.$router.push(`/s/${this.sessionId}`);
    }
  },

  methods: {
    // 映射 Vuex Mutations
    ...mapMutations(["setSelectedModel", "setSessionId"]),

    /**
     * 切换选中的模型
     * @param {string} model 选择的模型名称
     */
    handleModelChange(model) {
      console.log("更换为模型", model);
      this.setSelectedModel(model);
    },

    /**
     * 发送用户输入的消息
     * 1. 检查用户是否已登录
     * 2. 发送消息到后端，并将返回的 AI 回复存入 messages
     * 3. 处理发送失败的情况
     * 4. 调整输入框高度并滚动到底部
     */
    async sendMessage() {
      if (!this.isLoggedIn) {
        alert("请先登录！");
        return;
      }

      if (this.inputMessage.trim() !== "") {
        const userText = this.inputMessage.trim();

        // 将用户输入的消息加入对话记录
        this.messages.push({ text: userText, sender: "user" });

        // 清空输入框
        this.inputMessage = "";

        const question = { text: userText, images: [], audio: [], video: [] };

        try {
          // 发送消息请求
          const newMessages = await sendMessage(
            this.selectedModel,
            question.text,
            question.images,
            question.audio,
            question.video,
            this.context || "" // 发送当前对话上下文
          );

          // 将模型回复的消息加入对话记录
          this.messages.push({ text: newMessages.message, sender: "system" });

          // 发送用户和模型消息到后端保存
          const userMessageData = {
            sessionId: this.sessionId, // 假设 sessionId 是从 Vuex 或其他地方获取的
            sender: "user",
            message: userText,
          };
          await this.saveMessageToDatabase(userMessageData);

          const systemMessageData = {
            sessionId: this.sessionId,
            sender: "system",
            message: newMessages.message,
          };
          await this.saveMessageToDatabase(systemMessageData);
        } catch (error) {
          console.error("发送请求失败:", error);

          // 发送失败时，给出错误提示
          this.messages.push({
            text: "发送请求失败，请稍后再试。",
            sender: "system",
          });
        }

        // 让输入框恢复初始高度
        this.$nextTick(() => {
          const textarea = document.querySelector(".message-input");
          textarea.style.height = "40px";
        });

        // 滚动到底部，显示最新消息
        this.scrollToBottom();
      }
    },

    // 保存消息到后端数据库
    async saveMessageToDatabase(messageData) {
      try {
        // 发送包含消息数据的请求到后端
        await axios.post(
          `${process.env.VUE_APP_API_URL}/sessions/${messageData.sessionId}/messages`,
          {
            sender: messageData.sender, // "user" 或 "system"
            message: messageData.message, // 消息内容
          }
        );
      } catch (error) {
        console.error("保存消息到数据库失败:", error);
      }
    },
    /**
     * 根据 sessionId 拉取该会话的历史消息
     * @param {string} sessionId 会话 ID
     */
    async fetchSessionMessages(sessionId) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/sessions/${sessionId}/messages`
        );

        // 将返回的消息存入 messages
        this.messages = response.data.map((message) => ({
          text: message.messageContent,
          sender: message.sender,
        }));
      } catch (error) {
        console.error("Failed to fetch session messages:", error);
      }
    },

    /**
     * 滚动聊天窗口到底部
     */
    scrollToBottom() {
      this.$nextTick(() => {
        const chatContainer = this.$refs.messagesList;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },

    /**
     * 处理输入框按下 Shift + Enter 插入换行
     * @param {Event} event 事件对象
     */
    newLine(event) {
      event.preventDefault();
      this.inputMessage += "\n";

      // 调整输入框高度
      this.$nextTick(() => {
        const textarea = document.querySelector(".message-input");
        textarea.style.height = textarea.scrollHeight + "px";
      });
    },

    /**
     * 监听输入框内容变化，动态调整高度
     * @param {Event} event 事件对象
     */
    adjustTextareaHeight(event) {
      const textarea = event.target;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },

    /**
     * 清空当前会话的消息
     */
    clearSessionMessages() {
      this.messages = [];
      this.context = [];
      this.setSessionId(null); // 清空 Vuex 中的 sessionId
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