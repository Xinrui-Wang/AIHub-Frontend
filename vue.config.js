// 从 @vue/cli-service 中导入 defineConfig 方法，它用于定义 Vue CLI 的配置
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // transpileDependencies 是一个 Vue CLI 特定的配置项，
  // 它用于指定哪些依赖需要被转译（比如 ES6+ 转为兼容旧浏览器的版本）
  transpileDependencies: true
})
