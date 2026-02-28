<!-- FancyInput.vue -->
<script setup lang="ts">
// 1. 接收 props
const props = withDefaults(
    defineProps<{
      id: string
      label: string
      placeholder?: string
    }>(),
    {
      placeholder: '请输入内容'  // 给可选属性设置默认值
    }
)


defineSlots<{
  suffix?: (props: { a?: number }) => any
  prefix?: () => any
}>()

// 2. 定义可触发的事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', value: string): void
}>()

// 3. 定义 v-model 值（等价于 props.modelValue + emit update）
const modelValue = defineModel<string>()

// 4. 暴露内部方法给父组件使用
function focusInput() {
  inputRef.value?.focus()
}
defineExpose({
  focusInput
})

// 5. 使用插槽类型定义


// 6. 引用 DOM 元素
import {computed, ref, useAttrs, useSlots, type VNode} from 'vue'
const inputRef = ref<HTMLInputElement>()

// 7. 设置组件名称（defineOptions）
defineOptions({
  name: 'FancyInput',
  inheritAttrs: false,
})


const slots = useSlots()
const hasPrefixSlot = computed(() => !!slots.prefix?.().length)
const hasSuffixSlot = computed(() => !!slots.suffix?.().length)


// 可以获取非props的属性值
const attrs = useAttrs()

</script>

<template>
  <div class="fancy-input">
    <label>{{ props.label }}</label>
    <div class="input-wrapper">
      <!-- prefix 插槽或默认图标 -->
      <div class="prefix">
        <slot name="prefix">
          🔍 <!-- 默认图标 -->
        </slot>
      </div>

      <input
          v-bind="attrs"
          ref="inputRef"
          :value="modelValue"
          :placeholder="props.placeholder"
          @input="e => emit('update:modelValue', (e.target as HTMLInputElement).value)"
          @focus="emit('focus', props.id)"
      />

      <!-- suffix 插槽或默认图标 -->
      <div class="suffix">
        <slot name="suffix" :a="1">
          ✅ <!-- 默认图标 -->
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fancy-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 4px;
}
input {
  flex: 1;
  border: none;
  outline: none;
}
</style>
