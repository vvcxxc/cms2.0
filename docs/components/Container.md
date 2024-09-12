# Container 容器

该组件用于显示一个通用的页面头部，可以包含标题和搜索功能。

## 示例

<Layout>
  <Container
  title="通用头部示例"
  :placeholder="'搜索内容'"
  :modelValue="searchValue"
  @confirm="handleSearch">

      <!-- 这里放其他内容 -->

  </Container>
</Layout>

<script setup>
import { ref } from 'vue'
import Container from '@/components/Container/Container.tsx'

const searchValue = ref('')

const handleSearch = (value) => {
  console.log('用户搜索:', value)
  // 执行搜索操作
}
</script>

```vue
<template>
  <Container
    title="通用头部示例"
    :placeholder="'搜索内容'"
    :modelValue="searchValue"
    @confirm="handleSearch"
  >
    <!-- 这里放其他内容 -->
  </Container>
</template>

<script>
import { ref } from 'vue'
import Container from '@/components/Container/Container.tsx'

export default {
  components: {
    Container,
  },
  setup() {
    const searchValue = ref('')

    const handleSearch = (value) => {
      console.log('用户搜索:', value)
      // 执行搜索操作
    }

    return {
      searchValue,
      handleSearch,
    }
  },
}
</script>
```

在该示例中，`UniversalHeader` 组件被使用，并通过属性传递了标题、搜索框的占位符以及搜索框的值。当用户确认搜索时，`confirm` 事件被触发，调用 `handleSearch` 方法执行搜索操作。

## 属性

| 属性名      | 类型    | 默认值       | 必填 | 描述               |
| ----------- | ------- | ------------ | ---- | ------------------ |
| title       | String  | -            | 是   | 头部标题           |
| placeholder | String  | '请输入搜索' | 否   | 搜索输入框的占位符 |
| modelValue  | String  | ''           | 否   | 搜索输入框的值     |
| isSearch    | Boolean | true         | 否   | 是否显示搜索输入框 |

## 事件

| 事件名  | 参数          | 描述                           |
| ------- | ------------- | ------------------------------ |
| confirm | value: String | 当用户按下回车键确认搜索时触发 |
