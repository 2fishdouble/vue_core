<script setup lang="ts">
import {ElInput, type InputProps} from 'element-plus'
import {
  h,
  computed,
  getCurrentInstance,
  useAttrs,
  useSlots,
  type ComponentInternalInstance
} from 'vue'

// 正确方式：使用 useModel 接收 v-model 绑定值
const modelValue = defineModel<string>()

const props = defineProps<Partial<InputProps>>()
const attrs = useAttrs()
const slots = useSlots()
const vm = getCurrentInstance() as ComponentInternalInstance

function changeRef(inputInstance: any) {
  vm.exposed = inputInstance || {}
  // getComponentPublicInstance
  // vm.exposeProxy = inputInstance || {}
}

// 渲染 VNode，确保注入 v-model
const vnode = computed(() =>
    h(
        ElInput,
        {
          ...attrs,
          ...props,
          modelValue: modelValue.value,
          'onUpdate:modelValue': (val: string) => (modelValue.value = val),
          ref: changeRef
        },
        slots
    )
)
</script>

<template>
  <component :is="vnode"/>
</template>
