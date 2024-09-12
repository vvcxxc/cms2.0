理解了，我会将属性、事件等信息用表格的形式展示出来，让文档更加清晰易读。下面是更新后的文档草稿：

---

# TableFilter 表格筛选组件文档

## 简介

TableFilter 是一个用于实现表格筛选功能的 Vue 组件。它可以让用户轻松地添加、删除和修改表格的筛选条件，提升了用户对表格数据的控制和操作体验。

## 使用方式

<Layout>
  <TableFilter icon='add-p' :columns="columns" :tableRef="tableRef" >
    <IconButton icon="f">点我筛选</IconButton>
  </TableFilter>
</Layout>

<script setup>
import TableFilter from '@/components/TableFilter/TableFilter.tsx'
import IconButton from '@/components/IconButton/IconButton.tsx'
import { ref } from 'vue'
const columns = [
  {
    prop: 'name',
    title: '姓名',
    el: 'input',
    placeholder: '请输入姓名',
  }
]
const tableRef = ref(null)
</script>

```vue
<template>
  <TableFilter icon="add-p" :columns="columns" :tableRef="tableRef">
    <IconButton icon="f">点我筛选</IconButton>
  </TableFilter>
</template>

<script setup>
import TableFilter from '@/components/TableFilter/TableFilter.tsx'
import IconButton from '@/components/IconButton/IconButton.tsx'
import { ref } from 'vue'
const columns = [
  {
    prop: 'name',
    title: '姓名',
    el: 'input',
    placeholder: '请输入姓名',
  },
]
const tableRef = ref(null)
</script>
```

## Props

| 属性名         | 类型   | 默认值 | 说明         |
| -------------- | ------ | ------ | ------------ |
| columns        | Array  | []     | 表格的列配置 |
| tableRef       | Object | null   | 表格的引用   |
| modelValue     | Object | null   | 当前组件的值 |
| text           | String | ''     | 按钮文本     |
| fieldMap       | Object | {}     | 字段映射     |
| options        | Array  | []     | 选项         |
| defaultOptions | Array  | []     | 默认选项     |

## Events

| 事件名            | 说明             |
| ----------------- | ---------------- |
| update:modelValue | 更新组件的值     |
| data              | 发送数据事件     |
| change            | 筛选条件变化事件 |

## 插槽

| 名称    | 说明                     |
| ------- | ------------------------ |
| default | 用于自定义触发筛选的内容 |

## 方法

| 方法名        | 说明         |
| ------------- | ------------ |
| onAddFilter   | 添加筛选条件 |
| onReset       | 重置筛选条件 |
| onSearchTable | 搜索表格数据 |

## 注意事项

- 需要提供合适的 `columns` 配置和 `tableRef` 引用才能正常使用组件。
- 可以根据具体业务需求，通过插槽自定义触发筛选的内容。

---

这样的表格形式更加直观，方便用户查阅组件的属性、事件和方法。
