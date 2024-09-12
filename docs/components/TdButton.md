# TdButton 单元格按钮组件文档

## 简介

TdButton 是一个用于单元格中显示按钮的 Vue 组件。它可以根据传入的文本、图标和配置，展示不同样式和功能的按钮，并支持禁用状态和鼠标悬停效果。

## 使用方式

<Layout>
  <div style="width: 300px;">
    <TdButton
      :text="text"
      icon="add-p"
      tip="按钮文本"
      :disabled="disabled"
    >
      按钮文本
    </TdButton>
  </div>
</Layout>

<script setup>
import { ref } from 'vue'
import TdButton from '@/components/TdButton/TdButton.tsx'

const text = ref('测试') // 按钮文本
const icon = ref('') // 按钮图标
const tip = ref('') // 按钮提示信息
const disabled = ref(false) // 是否禁用按钮
</script>

```vue
<template>
  <div style="width: 300px;">
    <TdButton :text="text" icon="add-p" tip="按钮文本" :disabled="disabled">
      按钮文本
    </TdButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TdButton from '@/components/TdButton/TdButton.tsx'

const text = ref('测试') // 按钮文本
const icon = ref('') // 按钮图标
const tip = ref('') // 按钮提示信息
const disabled = ref(false) // 是否禁用按钮
</script>
```

## Props

| 属性名   | 类型    | 默认值 | 说明                 |
| -------- | ------- | ------ | -------------------- |
| text     | String  | ''     | 按钮文本             |
| icon     | String  | ''     | 按钮图标             |
| tip      | String  | ''     | 按钮提示信息         |
| disabled | Boolean | false  | 是否禁用按钮         |
| hover    | Boolean | false  | 是否显示鼠标悬停效果 |
| style    | Object  | {}     | 自定义样式           |

## Events

| 事件名 | 说明     |
| ------ | -------- |
| click  | 点击事件 |

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 默认内容插槽 |

---

这样的文档形式清晰地展示了组件的属性、事件和插槽，同时使用了 `setup` 函数管理组件的状态和逻辑，使代码更加简洁和可维护。
