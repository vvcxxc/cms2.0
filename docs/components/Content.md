# Content 内容组件

## 示例

<Layout>
  <Content title="通用内容示例">
    <div style="width:100%;height:500px">
      <!-- 这里放内容 -->
      我是内容
    </div>
  </Content>
</Layout>

<script setup>
import Content from '@/components/Content/Content.tsx'
</script>

```vue
<template>
  <Content title="通用内容示例">
    <div style="width:100%;height:500px">
      <!-- 这里放内容 -->
      我是内容
    </div>
  </Content>
</template>

<script setup>
import Content from '@/components/Content/Content.tsx'

export default {
  components: {
    Content,
  },
}
</script>
```

在该示例中，`Content` 组件被使用，并通过属性传递了标题。在组件内部，可以通过插槽放置其他内容。

该组件用于显示通用的内容区域，包含标题和内容。

## 属性

| 属性名 | 类型   | 默认值 | 必填 | 描述     |
| ------ | ------ | ------ | ---- | -------- |
| title  | String | '标题' | 否   | 内容标题 |
