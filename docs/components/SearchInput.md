# SelectInput 选择输入组件

该组件用于展示一个带有选择按钮的输入框，同时可以展示选择的标签。

## 示例

<Layout>
  <SelectInput v-model="selectedValues" @click="handleClick" />
</Layout>

<script setup>
import SelectInput from '@/components/SelectInput/SelectInput.tsx'
import { ref } from 'vue'

const selectedValues = ref([])

const handleClick = () => {
  // 处理点击选择按钮的逻辑
}
</script>

```vue
<template>
  <SelectInput v-model="selectedValues" @click="handleClick" />
</template>

<script setup>
import SelectInput from '@/components/SelectInput/SelectInput.tsx'
import { ref } from 'vue'

const selectedValues = ref([])

const handleClick = () => {
  // 处理点击选择按钮的逻辑
}
</script>
```

在该示例中，`SelectInput` 组件被使用，并通过 `v-model` 双向绑定了选择输入框的值。当点击选择按钮时，会触发 `click` 事件，调用 `handleClick` 方法处理点击事件。

## 属性

| 属性名     | 类型  | 默认值 | 必填 | 描述           |
| ---------- | ----- | ------ | ---- | -------------- |
| modelValue | Array | []     | 否   | 选择输入框的值 |

## 事件

| 事件名            | 参数  | 描述                     |
| ----------------- | ----- | ------------------------ |
| click             | -     | 点击选择按钮时触发       |
| update:modelValue | Array | 更新选择输入框的值时触发 |
