# Text 文本组件文档

## 简介

Text 是一个用于显示文本内容的 Vue 组件。它支持文本截断、自定义标签、行数限制、提示信息以及样式设置。

## 使用方式

<Text>
  <Text
    :truncated="truncated"
    :tag="tag"
    :lineClamp="lineClamp"
    :tip="tip"
    :fontSize="fontSize"
    :color="color"
    @click="handleClick"
  >
    <!-- 文本内容插槽 -->
    我是文本内容
  </Text>
</Text>

<script setup>
import { ref } from 'vue'
import Text from '@/components/Text/Text.tsx'

const truncated = ref(false) // 是否文本截断
const tag = ref('span') // 自定义标签，默认为 span
const lineClamp = ref(1) // 行数限制，默认为 1
const tip = ref('1111') // 提示信息
const fontSize = ref('') // 字体大小
const color = ref('') // 文本颜色

const handleClick = () => {
  // 点击事件处理逻辑
}
</script>

```vue
<template>
  <Text
    :truncated="truncated"
    :tag="tag"
    :lineClamp="lineClamp"
    :tip="tip"
    :fontSize="fontSize"
    :color="color"
    @click="handleClick"
  >
    <!-- 文本内容插槽 -->
    我是文本内容
  </Text>
</template>

<script setup>
import { ref } from 'vue'
import Text from '@/components/Text/Text.tsx'

const truncated = ref(false) // 是否文本截断
const tag = ref('span') // 自定义标签，默认为 span
const lineClamp = ref(1) // 行数限制，默认为 1
const tip = ref('') // 提示信息
const fontSize = ref('') // 字体大小
const color = ref('') // 文本颜色

const handleClick = () => {
  // 点击事件处理逻辑
}
</script>
```

## Props

| 属性名    | 类型    | 默认值 | 说明                    |
| --------- | ------- | ------ | ----------------------- |
| truncated | Boolean | false  | 是否文本截断            |
| tag       | String  | 'span' | 自定义标签，默认为 span |
| lineClamp | Number  | 1      | 行数限制，默认为 1      |
| tip       | String  | ''     | 提示信息                |
| fontSize  | String  | ''     | 字体大小                |
| color     | String  | ''     | 文本颜色                |

## Events

| 事件名 | 说明     |
| ------ | -------- |
| click  | 点击事件 |

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 文本内容插槽 |

---

这样的文档形式清晰地展示了组件的属性、事件和插槽，同时使用了 `setup` 函数管理组件的状态和逻辑，使代码更加简洁和可维护。
