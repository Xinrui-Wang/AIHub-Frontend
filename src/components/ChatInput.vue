<template>
  <div class="chat-input">
    <div class="input-container">
      <textarea
        v-model="inputText"
        class="input-box"
        placeholder="请输入内容..."
      ></textarea>
      <button class="send-btn" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatInput",
  data() {
    return {
      inputText: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.inputText.trim()) {
        console.log("发送消息:", this.inputText);
        this.inputText = "";
      }
    },
  },
};
</script>

<style scoped>
.chat-input {
  position: absolute; /* 相对父元素定位 */
  bottom: 20px; /* 距离底部 20px */
  left: 50%; /* 水平居中对齐 */
  transform: translateX(-50%); /* 调整水平居中偏移 */
  width: 60%; /* 输入框区域的宽度 */
  display: flex;
  justify-content: center; /* 水平方向居中 */
  /*background-color: white; /* 背景色 */
}

.input-container {
  width: 100%; /* 宽度和父容器一致 */
  display: flex;
  align-items: center; /* 垂直方向居中对齐 */
  background-color: #fff; /* 背景色为白色 */
  padding: 10px; /* 设置统一的内边距 */
  border-radius: 25px; /* 圆角边框 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影效果 */
  box-sizing: border-box; /* 包括 padding 在内计算宽度 */
}

.input-box {
  flex: 1; /* 输入框填满剩余空间 */
  height: 40px;
  border: 1px solid #ccc; /* 灰色边框 */
  border-radius: 20px; /* 圆角边框 */
  padding: 0 10px; /* 水平方向内边距 */
  font-size: 14px; /* 字体大小 */
  outline: none; /* 去掉输入框聚焦时的蓝色外框 */
  box-sizing: border-box; /* 包括 padding 在内计算宽度 */
}

.send-btn {
  margin-left: 10px; /* 与输入框的间距 */
  background-color: #4caf50; /* 绿色背景 */
  color: #fff; /* 按钮文字颜色 */
  border: none; /* 去掉边框 */
  border-radius: 20px; /* 圆角效果 */
  padding: 8px 16px; /* 内边距，增大点击区域 */
  cursor: pointer; /* 鼠标悬停时显示手形 */
  font-size: 14px; /* 字体大小 */
  transition: background-color 0.3s; /* 背景颜色变化动画 */
}

.send-btn:hover {
  background-color: #45a049; /* 悬停时背景颜色变化为更深的绿色 */
}
</style>
