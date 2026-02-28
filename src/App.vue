<template>
  <ConfigProvider :locale="zhCN">
    <RouterView></RouterView>
  </ConfigProvider>
</template>

<style scoped></style>

<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
// reactive 整体赋值会失去响应式 使用Object.assign()方法进行深拷贝
// import {reactive, readonly, ref, watch, watchEffect, shallowReadonly, toRaw, markRaw, customRef} from "vue";
// import {usePermission} from "./store/Permission.ts";

// const complex = reactive({
//   name: "张三",
//   age: 20,
//   address: "北京市海淀区",
//   car: {
//     brand: "benz",
//     color: "red"
//   }
// })
//
// // ref
// watch(ref(1), (newValue, oldValue) => {
//   console.log(newValue, oldValue)
// })
//
// // ref对象
// watch(ref({
//   name: "张三",
//   age: 20,
//   address: "北京市海淀区"
// }), () => {
// }, {deep: true, immediate: true});
//
// // reactive
// watch(complex, () => {
// }, {deep: true, immediate: true})
//
// // getter函数
// watch(() => {
//   return complex.age
// }, () => {
// })
//
// // getter函数,  监听对象属性deep: true
// watch(() => {
//   return complex.car
// }, () => {
// }, {deep: true, immediate: true})
//
// // 监听数组
// watch([() => complex.name, () => complex.car.brand], () => {
// }, {deep: true, immediate: true})
//
// // 不需要明确监听哪些数据,只关心结果变化
// watchEffect(() => {
// })
//
// const permissionStore = usePermission();
// permissionStore.$subscribe((mutation, state) => {
//   console.log(mutation, state)
//   localStorage.setItem("permission", JSON.stringify(state))
// })

// props emits
// mitt pubsub 第三方自定义事件$event
// v-model 就是动态的value 和 input事件  <el-input v-model:name="name" v-model:age="age"/>
// $event对于原生事件来说是事件对象而对于自定义事件来说则是所传递的数据
// $attrs  当前组件的父组件传给当当前组件的子组件
// $refs 包含所有子组件的实例对象,子组件需要defineExpose后父组件才能获取 $parent same way to $refs
// 祖孙组件之间通信 provide/inject
// shadowRef shadowReactive  只关注整体的替换,不关注细节的变化,适合复杂的结构
// readonly shadowReadonly
// readonly(complex)
// shallowReadonly(complex)
// toRaw markRaw
// toRaw(complex)
// markRaw(complex)

// customRef
// customRef((track, trigger) => {
//   return {
//     get() {
//       // 监听数据变化
//       track()
//       return 1
//     },
//     set() {
//       // 通知数据变化了
//       trigger()
//     }
//   }
// })
// teleport 组件的移动到别的位置
// suspense 懒加载组件, 类似于react的Suspense组件, 用于显示加载中状态
</script>

<style lang="scss">
/* 可放入 App.vue 或全局样式中 */
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1);
  }
}

.heartbeat {
  animation: heartbeat 0.6s ease-in-out;
}
</style>
