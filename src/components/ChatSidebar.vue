<template>
  <el-menu
    class="menu"
    default-active="1"        
    :router="false"
  >
    <el-menu-item index="1">
      <i class="el-icon-house"></i>
      <span>新对话</span>
    </el-menu-item>
    <el-menu-item index="2">
      <i class="el-icon-message"></i>
      <span>社区入口</span>
    </el-menu-item>
    <el-menu-item index="3">
      <i class="el-icon-setting"></i>
      <span>设置</span>
    </el-menu-item>
  </el-menu>
</template>

  
  <script>
  export default {
    name: "ChatSidebar",
  };
  </script>
  
  <style scoped>
.menu {
  width: 240px;
  height: 100%;
  background-color: #f5f5f5;  /* 设置背景色为偏灰色 */
}

/* 修改菜单项文字颜色 */
.el-menu-item {
  color: #000; /* 文字颜色设置为黑色 */
}

/* 鼠标悬停时，菜单项灰度加深 */
.el-menu-item:hover {
  background-color: #e0e0e0; /* 设置鼠标悬停时的背景色为更深的灰色 */
}

/* 激活菜单项的文字颜色 */
.el-menu-item.is-active {
  color: #000; /* 激活时文字颜色为金黄色 */
}
</style>

  