<script setup lang="ts">
import { ref, onMounted } from "vue";
import { sleep } from "@/utils/Utils.ts";

const user = ref<{ name: string } | null>(null);

onMounted(async () => {
  await sleep(1000);
  user.value = { name: "张三" };
});

defineExpose({ user });
</script>

<template>
  <div v-if="user">{{ user.name }}</div>
  <div v-else>加载中...</div>
</template>
