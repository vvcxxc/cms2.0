# 上传组件文档

## 简介

上传组件提供了一个方便的方式来将文件上传到服务器。它利用了 Element Plus 中的 `el-upload` 组件，并提供了自定义选项。

## 使用方法

<Layout>
  <Upload
    accept=".pdf,.doc,.docx"
    showFileList
    :msg="uploadMessage"
    @success="handleUploadSuccess"
  >
    <el-button type='primary'> 点击上传文件 </el-button>
  </Upload>
</Layout>

<script setup>
import Upload from '@/components/Upload/index.vue'

const uploadMessage = '文件上传成功'

const handleUploadSuccess = (data) => {
  console.log('文件已上传:', data)
}
</script>

```vue
<template>
  <Upload
    accept=".pdf,.doc,.docx"
    showFileList
    :msg="uploadMessage"
    @success="handleUploadSuccess"
  >
    <el-button type="primary"> 点击上传文件 </el-button>
  </Upload>
</template>

<script setup>
import Upload from '@/components/Upload/index.vue'

const uploadMessage = '文件上传成功'

const handleUploadSuccess = (data) => {
  console.log('文件已上传:', data)
}
</script>
```

## 插槽

| 名称    | 描述             |
| ------- | ---------------- |
| default | 默认插槽内容     |
| text    | 上传按钮文本插槽 |

## 属性

| 名称         | 类型   | 默认值 | 描述                               |
| ------------ | ------ | ------ | ---------------------------------- |
| accept       | 字符串 |        | 指定文件类型，多个类型使用逗号分隔 |
| showFileList | 布尔值 | false  | 是否在上传后显示文件列表           |
| msg          | 字符串 |        | 上传成功后显示的提示信息           |

## 事件

| 名称    | 描述                     |
| ------- | ------------------------ |
| success | 文件上传成功时触发的事件 |

## 方法

上传组件不暴露任何自定义方法。

## 样式

上传组件提供了基本样式，可以使用 CSS 进行自定义。以下是一个示例：

```scss
.upload {
  font-size: 25px;
  color: #777;
}
```
