<script setup lang="ts">
import "animate.css";
</script>

<template>
  <div class="orbit">
    <img src="@/assets/ws_1532186954_thumb.jpg" alt="img1" />
    <img src="@/assets/ws_1583040279_thumb.jpg" alt="img2" />
    <img src="@/assets/ws_1690108129_thumb.jpg" alt="img3" />
    <img src="@/assets/ws_1692399158_thumb.jpg" alt="img4" />
  </div>

  <div class="box">At rules</div>

  <div class="position-box">
    position-box
    <div class="position-box-item static-box">static</div>
    <div class="position-box-item relative-box">relative</div>
    <div class="position-box-item absolute-box">absolute</div>
    <div class="position-box-item fixed-box">fixed</div>
    <div class="position-box-item sticky-box">sticky</div>
  </div>

  <div class="display-box">
    <div class="display-box-title">display-box</div>
    <div class="display-box-grid">
      <div class="display-box-item">1</div>
      <div class="display-box-item">2</div>
      <div class="display-box-item">3</div>
      <div class="display-box-item">4</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.position-box {
  font-size: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  animation: fadeInMove 1s ease forwards;
  margin-bottom: 100px;
  text-align: center;
}
.position-box-item {
  font-size: 24px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 150px;
  text-align: center;
}
/* 1. 默认 static */
// static 则什么也不变；
.static-box {
  position: static;
  background-color: #eee;
}

/* 2. relative */
// position: relative —— 自己相对于自己原位置偏移
.relative-box {
  position: relative;
  top: 20px;
  left: 20px;
  background-color: #c1f0c1;
}

/* 3. absolute */
// absolute 会脱离文档流，并且它的偏移（top/left/right/bottom）是相对于最近的“设置了 position 且不是 static 的父级元素”
.absolute-box {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #fbb;
}

/* 4. fixed */
// position: fixed 是相对于整个视口（浏览器窗口）定位的 , 此例父div的动画会影响fixed子元素的位置
.fixed-box {
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: #aaf;
  z-index: 999;
}

/* 5. sticky */
// 在正常文档流中滚动，当即将滚出视口时，吸附在父容器的指定位置（如 top: 0）。”
.sticky-box {
  position: sticky;
  top: 0;
  background-color: #ffd966;
}

.display-box {
  font-size: 24px;
  padding: 20px;
  background: linear-gradient(rgba(255, 78, 80, 0.8), rgba(249, 212, 35, 0.8));
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  animation: fadeInMove 1s ease forwards;
  margin-bottom: 100px;
  text-align: center;
}

.display-box-title {
  margin-bottom: 20px;
}

.display-box-grid {
  display: flex;
  gap: 10px;
}

.display-box-item {
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
}

.orbit {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(
    rgba(255, 78, 80, 0.8),
    rgba(249, 212, 35, 0.8)
  ); /* 背景渐变 */
  margin: 50px auto;
  border: 2px black solid;
  animation: orbit 20s linear infinite;
}

img {
  position: absolute;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  animation: img 20s linear infinite;

  &:nth-child(1) {
    top: -50px;
    left: 150px;
  }

  &:nth-child(2) {
    top: 150px;
    left: 350px;
  }

  &:nth-child(3) {
    top: 350px;
    left: 150px;
  }

  &:nth-child(4) {
    top: 150px;
    left: -50px;
  }
}

@keyframes orbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes img {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes fadeInMove {
  from {
    opacity: 0; /* 完全透明 */
    transform: translateY(20px); /* 向下偏移 20 像素 */
  }
  to {
    opacity: 1; /* 完全不透明 */
    transform: translateY(0); /* 回到正常位置 */
  }
}

@layer components {
  .box {
    font-size: 24px;
    padding: 20px;
    background: linear-gradient(
      rgba(255, 78, 80, 0.8),
      rgba(249, 212, 35, 0.8)
    ); /* 背景渐变 */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    animation: fadeInMove 1s ease forwards;
    text-align: center; /* 文字水平居中 */
    margin-bottom: 100px;
  }
}
</style>
