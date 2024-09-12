# Flow 流程显示标签组件

该组件用于显示流程标签，支持根据传入的数据渲染标签。

## 属性

| 属性名     | 类型    | 默认值 | 必填 | 描述         |
| ---------- | ------- | ------ | ---- | ------------ |
| modelValue | Array   | []     | 否   | 流程数据数组 |
| disabled   | Boolean | false  | 否   | 是否禁用组件 |

## 事件

| 事件名 | 参数 | 描述             |
| ------ | ---- | ---------------- |
| click  | -    | 当点击标签时触发 |

## 示例

<Layout>
  <Flow v-model="flowData" :disabled="isDisabled" @click="handleClick" />
</Layout>

<script setup>
import { ref } from 'vue'
import Flow from '@/components/Flow/Flow.tsx'

const flowData = ref([
  { name: '流程1', description: '这是流程1' },
  { name: '流程2', description: '这是流程2' },
  { name: '流程3', description: '这是流程3' },
])
const isDisabled = ref(false)

const handleClick = () => {
  console.log('点击了流程标签')
}
</script>

```vue
<template>
  <Flow v-model="flowData" :disabled="isDisabled" @click="handleClick" />
</template>

<script setup>
import Flow from '@/components/Flow/Flow.tsx'

const flowData = ref([
  { name: '流程1', description: '这是流程1' },
  { name: '流程2', description: '这是流程2' },
  { name: '流程3', description: '这是流程3' },
])
const isDisabled = ref(false)

const handleClick = () => {
  console.log('点击了流程标签')
}
</script>
```

在该示例中，`Flow` 组件被使用，并通过属性传递了流程数据数组 `flowData` 和禁用状态 `isDisabled`。当点击标签时，触发 `click` 事件，调用 `handleClick` 方法。
