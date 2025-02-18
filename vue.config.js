const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/',  // 确保 publicPath 设置正确
  devServer: {
    historyApiFallback: true,  // 启用 history 模式
  },
});

