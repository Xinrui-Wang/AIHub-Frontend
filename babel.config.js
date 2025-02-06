// 导出 Babel 配置对象
module.exports = {
  // presets 字段指定了一组 Babel 预设配置，用于控制代码的编译规则
  presets: [
    // Vue CLI 默认提供的 Babel 预设配置
    // 包含必要的插件，以支持现代 JavaScript 特性和 Vue 文件的转译
    '@vue/cli-plugin-babel/preset'
  ]
};
