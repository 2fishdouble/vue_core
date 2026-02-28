<script setup lang="ts">
import FancyInput from '@/components/FancyInput.vue'
import {ref} from 'vue'
import CustomElInput from "@/components/CustomElInput.vue"
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Watermark } from 'ant-design-vue'

const name = ref('')
const inputRef = ref()


const handleFocus = (id: string) => {
  console.log('聚焦了', id)
}
const elInputRef = ref()
const msg = ref('hello world')

// 可以拿到事件
setTimeout(() => {
  // 异步任务可能elInputRef已经没了，需要判断一下
  elInputRef.value?.clear()
}, 1000)




// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()


const mode = ref('default')

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<template>
  <FancyInput
      id="1"
      name="username"
      v-model="name"
      label="用户名"
      placeholder="请输入"
      ref="inputRef"
      @focus="handleFocus"
  >
    <template #prefix>👤</template>
    <template #suffix="{a = 1}">✅ {{a}}</template>
  </FancyInput>

  <button @click="inputRef.focusInput()">手动聚焦</button>

  <CustomElInput v-model="msg" ref="elInputRef" placeholder="请输入">
    <template #prefix>👤</template>
    <template #prepend>
      <div>prepend</div>
    </template>
    <template #append>
      <div>append</div>
    </template>
    <template #suffix>✅</template>
  </CustomElInput>

  <Watermark content="ant-design-vue">
    <div style="border: 1px solid #ccc">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editorRef"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="valueHtml"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="handleCreated"
      />
    </div>
  </Watermark>


</template>
<style scoped>
</style>