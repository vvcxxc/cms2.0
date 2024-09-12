# IconButton 图标按钮组件

该组件用于显示带图标的按钮，支持自定义图标、按钮类型、弹出框宽度等属性，并可以响应点击事件。

<Layout>
  <IconButton icon="search" type="primary" @click="handleClick">
    <template #content>
      内容
    </template>
    分组
  </IconButton>

  <IconButton icon="g">
    内容
  </IconButton>
</Layout>

<script setup>
import IconButton from '@/components/IconButton/IconButton.tsx'

const handleClick = (evt) => {
  console.log('点击了图标按钮')
}
</script>

## 示例

```vue
<template>
  <IconButton icon="search" type="primary" @click="handleClick">
    <template #content> 内容 </template>
    搜索
  </IconButton>
  <IconButton icon="g"> 分组 </IconButton>
</template>

<script setup>
import IconButton from '@/components/IconButton/IconButton.tsx'

const handleClick = (evt) => {
  console.log('点击了图标按钮')
}
</script>
```

在该示例中，`IconButton` 组件被使用，并通过属性设置了图标名称为 "search"，按钮类型为 "primary"。当点击按钮时，触发 `click` 事件，调用 `handleClick` 方法。

## 属性

| 属性名       | 类型   | 默认值 | 必填 | 描述         |
| ------------ | ------ | ------ | ---- | ------------ |
| icon         | String | -      | 否   | 图标名称     |
| type         | String | -      | 否   | 按钮类型     |
| popoverWidth | Number | -      | 否   | 弹出框宽度   |
| content      | slots  | -      | 否   | 弹窗         |
| 其他         | any    | -      | 否   | 其他按钮属性 |

## 事件

| 事件名 | 参数  | 描述             |
| ------ | ----- | ---------------- |
| click  | Event | 当点击按钮时触发 |
