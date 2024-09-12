# BaseInput

基础 input，不包含样式

## 示例

<script setup>
import BaseInput from '@/components/BaseInput/BaseInput.tsx'
import { ref } from 'vue'
const value = ref('')
</script>

<Layout>
  <BaseInput v-model="value" placeholder="请输入" style="border: 1px solid #ccc"/>
</Layout>

```js-vue
<template>
  <Layout>
    <Base v-model="value" style="border: 1px solid #ccc"/>
  </Layout>
</template>
<script>
  import BaseDrawer from '@/components/BaseInput/BaseInput.tsx'
  import { ref } from 'vue'
  const value = ref('')
</script>

```

## 属性

| 属性        | 类型          | 默认值   | 说明           |
| ----------- | ------------- | -------- | -------------- |
| modelValue  | String/Number | ''       | 输入框的值     |
| placeholder | String        | '请输入' | 输入框的占位符 |

## 事件

| 事件              | 说明                   |
| ----------------- | ---------------------- |
| update:modelValue | 更新输入框的值         |
| click             | 点击输入框时触发的事件 |
