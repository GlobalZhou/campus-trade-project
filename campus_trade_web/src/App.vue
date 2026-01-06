<template>
  <router-view></router-view>
</template>

<style>
/* 1. 彻底清除浏览器默认的边距 */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* 防止出现多余的横向滚动条 */
}

/* 2. 核心修正：强制根节点铺满全屏，不留任何空白 */
#app {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  max-width: none !important; /* 强制取消可能的宽度限制 */
  display: block !important;    /* 确保它不是 flex 居中模式 */
  text-align: left;             /* 确保内容从左侧开始 */
}

/* 全局背景色 */
body {
  background-color: #f0f2f5;
}
</style>