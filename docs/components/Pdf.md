# PDFViewer 组件

该组件用于显示 PDF 文件的预览。支持在对话框中展示 PDF 文件内容，并提供关闭和确认功能。

## 示例

<Layout>
  <el-button type='primary' @click="showDialog = true">pdf弹窗 </el-button>
  <PDFViewer v-model="showDialog" pdfSrc="/path/to/pdf/file.pdf" />
</Layout>

<script setup>
import PDFViewer from '@/components/Pdf/index.vue'
import { ref } from 'vue'

const showDialog = ref(false)
</script>

```vue
<template>
  <PDFViewer :v-model="showDialog" pdfSrc="/path/to/pdf/file.pdf" />
</template>

<script setup>
import PDFViewer from '@/components/Pdf/index.vue'
import { ref } from 'vue'

const showDialog = ref(false)
</script>
```

在该示例中，`PDFViewer` 组件被使用，并传递了 `modelValue` 控制对话框的显示状态，以及 `pdfSrc` 属性指定 PDF 文件的路径。

## 属性

| 属性名     | 类型    | 默认值 | 必填 | 描述           |
| ---------- | ------- | ------ | ---- | -------------- |
| modelValue | Boolean | -      | 是   | 控制对话框显示 |
| pdfSrc     | String  | -      | 是   | PDF 文件的路径 |

## 事件

| 事件名            | 参数    | 描述               |
| ----------------- | ------- | ------------------ |
| update:modelValue | Boolean | 更新对话框显示状态 |
| close             | -       | 关闭对话框时触发   |
| confirm           | -       | 确认操作时触发     |
