<script setup lang="ts">
import "animate.css";
import { ref } from "vue";

const a = {};
</script>

<template>
  <div class="div">div</div>
  <button class="div">button</button>
  <div class="animate__animated animate__bounce animate__infinite div">
    bounce
  </div>
  <div class="div">scss</div>
  <div v-heartbeat="{ count: 2, className: 'heartbeat' }" class="div">
    directive heartbeat
  </div>
</template>

<style lang="scss" scoped>
.div {
  font-family:
    "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace; /* 字体 */
  font-size: 20px; /* 字体大小 */
  width: 1600px; /* 宽度为 80% */
  height: 100px; /* 高度为 100% */
  background: linear-gradient(
    rgba(255, 78, 80, 0.8),
    rgba(249, 212, 35, 0.8)
  ); /* 背景渐变 */
  background-color: red; /* 背景色 */
  border: 2px solid black; /* 边框 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* ✅ 阴影，提升层次感 */

  /** flex不生效 **/
  overflow: hidden; /* 可选：visible / hidden / scroll */
  text-overflow: ellipsis; /* 可选：clip / ellipsis */
  white-space: nowrap; /* 可选：normal / nowrap */

  /* 让文字水平+垂直居中 */
  display: flex; /* 让 div 成为 flex container */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  text-align: center; /* 文字水平居中 */
  margin: 0 auto; /* 让整个 div 水平居中 */
  padding: 16px; /* 防止文字紧贴边缘 */

  /* ✅ 过渡动画增强交互体验 */
  transition: all 0.3s ease;

  /* ✅ 可选鼠标悬停效果 */
  cursor: pointer;
  margin-bottom: 20px; /* 增加和下一个元素的间距 */
}

.div:hover {
  background-color: darkred; /* 悬停变色 */
  transform: scale(1.03); /* 微缩放 */
}
</style>
