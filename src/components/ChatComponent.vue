<!-- ChatComponent.vue -->
<template>
  <div class="chat-container">
    <!-- 引入并使用 ButtonBar 组件 -->
    <ButtonBar
      @button2-click="handleButton2"
      @button3-click="handleButton3"
      @model-changed="handleModelChange"
    />

    <!-- 消息列表 -->
    <div ref="messagesList" class="messages-list">
      <!-- 遍历并显示消息 -->
      <!-- 根据消息发送者添加不同的样式 -->
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-box"
        :class="message.sender"
      >
        {{ message.text }}
      </div>
    </div>

    <!-- 输入框容器 -->
    <!-- 双向绑定输入框内容 -->
    <!-- 输入时调整文本框高度 -->
    <div class="input-container">
      <textarea
        v-model="inputMessage"
        class="message-input"
        placeholder="Type your message..."
        @input="adjustTextareaHeight"
      ></textarea>
      <button @click="sendMessage">Send</button>
      <!-- 发送按钮 -->
    </div>
  </div>
</template>

<script>
import ButtonBar from "./ChatComponentTopBar.vue";
import { mapState, mapMutations } from "vuex"; // 引入 mapState 和 mapMutations
import { sendMessage } from "@/services/messageService"; // 引入发送消息的服务


export default {
  components: {
    ButtonBar,
  },
  computed: {
    // 使用 mapState 获取 Vuex 状态
    ...mapState({
      selectedModel: (state) => state.selectedModel,
      isLoggedIn: (state) => state.isLoggedIn, // 获取登录状态
    }),
  },
  data() {
    return {
      messages: [],
      inputMessage: "",
      context: [],
    };
  },
  methods: {
    // 使用 mapMutations 获取 Vuex mutations
    ...mapMutations(["setSelectedModel"]),

    handleModelChange(model) {
      this.setSelectedModel(model); // 使用 mapMutations 中的方法
    },

    async sendMessage() {
      // 检查是否已登录
      if (!this.isLoggedIn) {
        // 提示用户登录
        alert("请先登录！");
        return; // 如果没有登录，直接返回，不发送消息
      }

      if (this.inputMessage.trim() !== "") {
        const userText = this.inputMessage.trim();
        this.messages.push({ text: userText, sender: "user" });
        this.inputMessage = "";

        const question = {
          text: userText,
          images: [],
          audio: [],
          video: [],
        };

        try {
          // 调用 sendMessage 函数发送请求
          const newMessages = await sendMessage(
            this.selectedModel, // 当前选择的模型
            question.text, // 发送的文本消息
            question.images, // 图片（目前为空）
            question.audio, // 音频（目前为空）
            question.video, // 视频（目前为空）
            this.context || "" // 上下文（目前为空）
          );
          this.messages.push({ text: newMessages.message, sender: "system" });
        } catch (error) {
          console.error("发送请求失败:", error);
          this.messages.push({
            text: "发送请求失败，请稍后再试。",
            sender: "system",
          });
        }

        this.$nextTick(() => {
          const textarea = document.querySelector(".message-input");
          textarea.style.height = "40px";
        });

        this.scrollToBottom();
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatContainer = this.$refs.messagesList;
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      });
    },

    adjustTextareaHeight(event) {
      const textarea = event.target;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    },
  },
};
</script>

<style scoped>
/* ChatComponent 样式保持不变 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f6f5f9;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #ddd;
}

.message-input {
  flex: 1;
  min-height: 40px;
  max-height: 150px;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
  box-sizing: border-box;
  overflow-y: auto;
  font-size: 14px;
}

button {
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.message-box {
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}

.message-box.user {
  align-self: flex-end;
  background-color: #d1e7dd;
}

.message-box.system {
  align-self: center;
  background-color: #f8d7da;
}
</style>
