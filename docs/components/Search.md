# Search 搜索输入组件

该组件用于展示一个搜索输入框，支持用户输入关键字进行搜索，并提供确认搜索功能。

## 示例

<Layout>
  <Search v-model="searchValue" placeholder="搜索内容" :tableRef="tableRef" field="Name" @confirm="handleSearch" />
</Layout>

<script setup>
import Search from '@/components/Search/Search.tsx'
import { ref } from 'vue'

const searchValue = ref('')
const tableRef = ref(null)

const handleSearch = (value) => {
  console.log('用户搜索:', value)
  // 执行搜索操作
  // 此处演示
  if (tableRef.value) {
    tableRef.value.getList({ Name: value })
  }
}
</script>

```vue
<template>
  <Search
    :modelValue="searchValue"
    placeholder="搜索内容"
    :tableRef="tableRef"
    field="Name"
    @confirm="handleSearch"
  />
</template>

<script setup>
import Search from '@/components/Search/Search.tsx'
import { ref } from 'vue'

const searchValue = ref('')
const tableRef = ref(null)

const handleSearch = (value) => {
  console.log('用户搜索:', value)
  // 执行搜索操作
  // 此处演示
  if (tableRef.value) {
    tableRef.value.getList({ Name: value })
  }
}
</script>
```

在该示例中，`Search` 组件被使用，并通过属性传递了搜索框的占位符、表格的引用以及执行搜索操作时指定的字段名。当用户确认搜索时，`confirm` 事件被触发，调用 `handleSearch` 方法执行搜索操作。

## 属性

| 属性名      | 类型   | 默认值       | 必填 | 描述                         |
| ----------- | ------ | ------------ | ---- | ---------------------------- |
| placeholder | String | '请输入搜索' | 否   | 搜索输入框的占位符           |
| modelValue  | String | ''           | 否   | 搜索输入框的值               |
| tableRef    | Object | null         | 否   | 表格的引用，用于执行搜索操作 |
| field       | String | ''           | 否   | 执行搜索操作时指定的字段名   |

## 事件

| 事件名  | 参数   | 描述                                 |
| ------- | ------ | ------------------------------------ |
| confirm | string | 用户确认搜索时触发，参数为搜索关键字 |
