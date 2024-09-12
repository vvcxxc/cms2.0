# Empty 空数据组件

该组件用于在页面中展示暂无数据的提示信息。

## 属性

| 属性名 | 类型   | 默认值     | 必填 | 描述         |
| ------ | ------ | ---------- | ---- | ------------ |
| text   | String | '暂无数据' | 否   | 提示信息文本 |

## 示例

<Empty text="暂无数据，请稍后再试" />

<script setup>
import Empty from '@/components/Empty/Empty.tsx'
</script>

```vue
<template>
  <Empty text="暂无数据，请稍后再试" />
</template>

<script setup>
import Empty from '@/components/Empty/Empty.tsx'
</script>
```

在该示例中，`Empty` 组件被使用，并通过属性设置了提示信息文本为 "暂无数据，请稍后再试"。
