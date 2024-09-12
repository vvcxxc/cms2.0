# ConfirmBox

## 使用文档

确认弹窗

## 示例

<script setup>
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox.tsx'
import { ref } from 'vue'

const handleConfirm = async () => {
  try {
    const result = await ConfirmBox('确定要删除吗？', '删除确认')
    if (result) {
      console.log('用户点击了确认按钮')
      // 执行删除操作
    } else {
      console.log('用户点击了取消按钮')
    }
  } catch (error) {
    console.log('对话框关闭或出现错误:', error)
  }
}
</script>

<Layout>
  <el-button type='primary' @click="handleConfirm">打开</el-button>
</Layout>

```js-vue

<script setup>
import ConfirmBox from '@/components/ConfirmBox/ConfirmBox.tsx'
import { ref } from 'vue'

const handleConfirm = async () => {
  try {
    const result = await ConfirmBox('确定要删除吗？', '删除确认')
    if (result) {
      console.log('用户点击了确认按钮')
      // 执行删除操作
    } else {
      console.log('用户点击了取消按钮')
    }
  } catch (error) {
    console.log('对话框关闭或出现错误:', error)
  }
}
</script>

<template>
  <Layout>
    <el-button @click="handleConfirm">打开</el-button>
  </Layout>
</template>
```

这个示例展示了如何使用 `ConfirmBox` 函数来显示一个带有确认和取消按钮的对话框，并根据用户的操作执行相应的操作。

## 属性

| 属性名        | 类型          | 默认值   | 说明                                          |
| ------------- | ------------- | -------- | --------------------------------------------- |
| `modelValue`  | Boolean       | false    | 控制对话框的显示与隐藏，使用 `v-model` 绑定。 |
| `title`       | String        | ''       | 对话框的标题。                                |
| `width`       | String        | ''       | 对话框的宽度。                                |
| `clickable`   | Boolean       | false    | 遮罩是否可点击。                              |
| `placeholder` | String        | '请输入' | 输入框的占位符。                              |
| `modelValue`  | String/Number | ''       | 输入框的值。                                  |

## 事件

| 事件名              | 参数             | 说明                     |
| ------------------- | ---------------- | ------------------------ |
| `update:modelValue` | `value: boolean` | 更新对话框的显示状态。   |
| `close`             | -                | 关闭对话框时触发。       |
| `confirm`           | -                | 用户确认对话框时触发。   |
| `open`              | -                | 打开对话框时触发。       |
| `beforeClose`       | -                | 关闭对话框前触发的事件。 |
| `click`             | `event: Event`   | 点击输入框时触发的事件。 |
