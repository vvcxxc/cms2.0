# BaseDialog

在保留当前页面状态的情况下，告知用户并承载相关操作。
基础属性与 element-plus 属性相同

## 示例

<script setup>
  import BaseDialog from '@/components/BaseDialog/index.vue'
  import { ref } from 'vue'
  const visible = ref(false)

</script>
<Layout>
  <el-button type='primary' @click="visible=true">打开</el-button>
  <BaseDialog
    v-model="visible"
    @close="visible = false"
    @confirm="visible = true"
    width="500"
    height="300">
    我是对话框
  </BaseDialog>
</Layout>

```js-vue
<template>
  <el-button type='primary' @click="visible=true">打开</el-button>
  <BaseDialog
    v-model="visible"
    @close="visible = false"
    @confirm="visible = true"
    width="500"
    height="300">
    我是对话框
  </BaseDialog>
</template>

<script setup>
  import BaseDialog from '@/components/BaseDialog/index.vue'
  import { ref } from 'vue'
  const visible = ref(false)
</script>

```

## 属性

| 属性          | 类型     | 说明                                 |
| ------------- | -------- | ------------------------------------ |
| className     | 计算属性 | 设置对话框的自定义类名。             |
| attrs         | 计算属性 | 获取传递给对话框组件的所有属性。     |
| props         | 属性定义 | 对话框组件的 props 对象。            |
| footer        | 计算属性 | 检测是否存在对话框底部的自定义内容。 |
| currentHeight | 计算属性 | 当前对话框的高度。                   |

## 事件

| 事件    | 说明         |
| ------- | ------------ |
| close   | 关闭对话框。 |
| confirm | 确认对话框。 |
| open    | 打开对话框。 |
