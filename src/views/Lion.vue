<script setup lang="ts">
import {
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount,
  ref,
  computed,
} from "vue";
import SimpleList from "./Lion.tsx"; // 假设这是一个封装好的 Web Component 或兼容组件
import SimpleList1 from "./Lion1.tsx"; // 假设这是一个封装好的 Web Component 或兼容组件
const count = ref(0);

const messages = ref<string[]>([]);
let socket: WebSocket | null = null;

onBeforeMount(() => {
  console.log("🍏 onBeforeMount");
});

onMounted(() => {
  console.log("🍎 onMounted");
  socket = new WebSocket("ws://localhost:13012/ws");

  socket.onopen = () => {
    console.log("✅ WebSocket 连接成功");
    socket?.send("Hello from Vue");
  };

  socket.onmessage = (event) => {
    messages.value.push(event.data);
  };

  socket.onerror = (err) => {
    console.error("❗ WebSocket 错误", err);
  };

  socket.onclose = () => {
    console.warn("⚠️ WebSocket 已关闭");
  };
});

onBeforeUpdate(() => {
  console.log("🔄 onBeforeUpdate");
});

onUpdated(() => {
  console.log("✅ onUpdated");
});

onBeforeUnmount(() => {
  console.log("🧨 onBeforeUnmount");
  socket?.close();
});

onUnmounted(() => {
  console.log("🍐 onUnmounted");
});

const show = ref(true);
const currentComp = computed(() => (show.value ? SimpleList : SimpleList1));
</script>

<template>
  <div>
    <h2>水果列表：</h2>
    <button @click="show = !show">切换组件</button>
    <component :is="currentComp" />
  </div>

  <div>
    <h2>更新测试</h2>
    <p>当前计数：{{ count }}</p>
    <button @click="count++">+1</button>
  </div>
  <h2>📡 实时消息</h2>
  <ul>
    <li v-for="msg in messages" :key="msg">{{ msg }}</li>
  </ul>
</template>
