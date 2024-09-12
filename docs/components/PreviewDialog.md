# PreviewDialog 预览对话框组件

该组件用于显示预览内容，支持在对话框中展示指定 URL 的内容，并提供关闭功能。

## 示例

<Layout>
  <el-button type='primary' @click="showDialog = true">弹窗 </el-button>
  <PreviewDialog v-model="showDialog" url="https://www.shengyc.com/" />
</Layout>

<script setup>
import PreviewDialog from '@/components/PreviewDialog/index.vue'
import { ref } from 'vue'

const showDialog = ref(false)
</script>

```vue
<template>
  <PreviewDialog v-model="showDialog" url="https://www.shengyc.com/" />
</template>

<script setup>
import PreviewDialog from '@/components/PreviewDialog/index.vue'
import { ref } from 'vue'

const showDialog = ref(false)
</script>
```

在该示例中，`PreviewDialog` 组件被使用，并传递了 `modelValue` 控制对话框的显示状态，以及 `url` 属性指定预览内容的 URL。

## 属性

| 属性名         | 类型    | 默认值                 | 必填 | 描述                           |
| -------------- | ------- | ---------------------- | ---- | ------------------------------ |
| modelValue     | Boolean | -                      | 是   | 控制对话框显示                 |
| url            | String  | 'http://www.baidu.com' | 否   | 预览内容的 URL                 |
| append-to-body | Boolean | true                   | 否   | 是否将对话框插入到 body 元素内 |
| width          | Number  | 1200                   | 否   | 对话框宽度                     |
| show-close     | Boolean | true                   | 否   | 是否显示关闭按钮               |

## 事件

| 事件名            | 参数    | 描述               |
| ----------------- | ------- | ------------------ |
| update:modelValue | Boolean | 更新对话框显示状态 |
| close             | -       | 关闭对话框时触发   |
