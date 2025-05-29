AIHub 智能聊天平台

https://img.shields.io/badge/Vue-3.3-green](https://vuejs.org/)
https://img.shields.io/badge/Vuex-4.0-blue](https://vuex.vuejs.org/)
https://img.shields.io/badge/Axios-1.5-red](https://axios-http.com/)

一个基于 Vue3 的智能聊天 Web 应用，支持多会话管理、富文本消息、多 AI 模型切换，提供类 ChatGPT 的交互体验。

!public/screenshot.png <!-- 需替换实际截图路径 -->

✨ 核心功能
多会话管理

创建/删除/切换独立会话

浏览器本地存储会话历史

智能聊天

支持 Markdown 实时渲染

自适应高度输入框（支持 `Shift+Enter` 换行）

多模态消息支持（文本/图片/音频/视频）

用户系统

JWT Token 认证

登录状态持久化

扩展能力

多 AI 模型快速切换（Kimi/GPT-3.5/GPT-4）

可扩展的顶部操作栏

🛠 技术栈

前端框架
Vue3 + Vue Router + Vuex

核心库
`marked`：Markdown 解析

`axios`：HTTP 请求封装

`vuex-persistedstate`：状态持久化

工具链
Vue CLI

ESLint + Prettier

🚀 快速开始

环境要求
Node.js ≥16.x

npm ≥9.x

安装步骤

bash
克隆仓库
git clone https://github.com/your-username/AIHub-Frontend.git

安装依赖
npm install

配置环境变量（创建 .env 文件）
cp .env.example .env

启动开发服务器
npm run serve

环境变量配置

ini
.env
VUE_APP_API_URL=http://localhost:8000  # 后端 API 地址
VUE_APP_DEFAULT_MODEL=kimi             # 默认 AI 模型

📂 项目结构

text
src/
├── components/     # 可复用组件
├── ChatComponent.vue

├── ChatInput.vue

└── ...

├── store/          # Vuex 状态管理
└── store.js

├── services/       # API 服务封装
└── messageService.js

└── router/         # 路由配置
    └── index.js

🧩 扩展计划
[ ] 社区讨论功能

[ ] 聊天记录导出

[ ] 实时打字机效果

⚠️ 注意事项
需配合后端 API 服务使用（参考 https://github.com/your-username/AIHub-Backend）

生产环境需配置 HTTPS 和 CORS

建议使用 Chrome 90+ 或 Firefox 88+ 浏览器

🤝 参与贡献

欢迎提交 Issue 或 PR！请遵守 CONTRIBUTING.md

主要改进点：
格式标准化：统一使用规范的 Markdown 标题层级（# > ## > ###）

代码块优化：为所有代码块添加语言标识（bash/javascript/text）

路径修正：使用相对路径 public/screenshot.png 作为截图占位

列表增强：使用任务列表格式 - [ ] 表示待办事项

链接可点击化：为所有 URL 添加 ` 格式的 Markdown 链接

空格优化：在中英文混排处添加空格提升可读性

只需将上述内容保存为 README.md 并放置在项目根目录即可。实际使用时请记得：
替换 your-username 为您的 GitHub 用户名

添加真实的系统截图

补充 CONTRIBUTING.md` 文件（如果需要）
