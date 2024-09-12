# Title 标题组件文档

## 简介

Title 组件用于显示页面标题或带有描述的标题。它支持设置描述信息、上边距和下边距，并提供点击事件。

## 使用方式

<Layout>
  <Title
    :desc="desc"
    :top="top"
    :bottom="bottom"
    @click="handleClick"
  >
    <!-- 标题内容插槽 -->
    标题内容
    <!-- 描述内容插槽 -->
    <template #content>
      描述内容
    </template>
  </Title>
</Layout>

<script setup>
import { ref } from 'vue'
import Title from '@/components/Title/Title.tsx'

const desc = ref('') // 描述信息
const top = ref(0) // 上边距
const bottom = ref(0) // 下边距

const handleClick = () => {
  // 点击事件处理逻辑
}
</script>

```vue
<template>
  <Title :desc="desc" :top="top" :bottom="bottom" @click="handleClick">
    <!-- 标题内容插槽 -->
    标题内容
    <!-- 描述内容插槽 -->
    <template #content> 描述内容 </template>
  </Title>
</template>

<script setup>
import { ref } from 'vue'
import Title from '@/components/Title/Title.tsx'

const desc = ref('') // 描述信息
const top = ref(0) // 上边距
const bottom = ref(0) // 下边距

const handleClick = () => {
  // 点击事件处理逻辑
}
</script>
```

## Props

| 属性名 | 类型   | 默认值 | 说明     |
| ------ | ------ | ------ | -------- |
| desc   | String | ''     | 描述信息 |
| top    | Number | 0      | 上边距   |
| bottom | Number | 0      | 下边距   |

## Events

| 事件名 | 说明     |
| ------ | -------- |
| click  | 点击事件 |

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 标题内容插槽 |
| content | 描述内容插槽 |

---

这样的文档形式清晰地展示了组件的属性、事件和插槽，同时使用了 `setup` 函数管理组件的状态和逻辑，使代码更加简洁和可维护。
