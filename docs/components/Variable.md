# 变量组件文档

## 简介

变量组件用于选择或输入变量值。它提供了选择变量的功能，并支持多选和单选模式。

## 使用方法

输入框类型为 `默认`
<Layout>
<Variable
    v-model="variableValue"
    :isClose="true"
    :clearable="true"
    :isMultiple="false"
  />
</Layout>

输入框类型为 `input`
<Layout>
<Variable
    v-model="variableValue"
    :isClose="true"
    :clearable="true"
    :isMultiple="false"
    type="input"
  />
</Layout>

输入框类型为 `select`
<Layout>
<Variable
    v-model="variableValue"
    :isClose="true"
    :clearable="true"
    :isMultiple="false"
    type="select"/>
</Layout>

<script setup>
import Variable from '@/components/Variable/Variable.tsx'
import {ref} from 'vue'
const variableValue = ref('') // 绑定的变量值

</script>

```vue
<template>
  <Variable
    v-model="variableValue"
    :isClose="true"
    :clearable="true"
    :isMultiple="false"
    type="input"
  />
</template>

<script setup>
import Variable from '@/components/Variable/Variable.tsx'
import { ref } from 'vue'

const variableValue = ref('') // 绑定的变量值
</script>
```

## 属性

| 属性名称   | 类型          | 默认值 | 描述                                         |
| ---------- | ------------- | ------ | -------------------------------------------- |
| modelValue | String/Number | -      | 绑定的变量值                                 |
| isClose    | Boolean       | false  | 是否显示关闭图标（仅对 `input` 类型有效）    |
| clearable  | Boolean       | false  | 是否可清除输入内容（仅对 `input` 类型有效）  |
| dataSource | Array         | []     | 数据源（仅对多选模式有效）                   |
| isMultiple | Boolean       | false  | 是否支持多选模式                             |
| index      | Number        | 0      | 数据源索引（仅对多选模式有效）               |
| field      | String        | ''     | 数据源字段名称（仅对多选模式有效）           |
| type       | String        | ''     | 输入框类型，可选值为 `'input'` 或 `'select'` |

## 事件

| 事件名称          | 描述                   |
| ----------------- | ---------------------- |
| update:modelValue | 变量值更新时触发的事件 |
| update:dataSource | 数据源更新时触发的事件 |
| change            | 变量值变化时触发的事件 |

## 插槽

| 插槽名称 | 描述             |
| -------- | ---------------- |
| 默认插槽 | 替换默认内容     |
| text     | 替换上传按钮文本 |

## 方法

变量组件不暴露任何自定义方法。

## 样式

变量组件提供了基本样式，可以使用 CSS 进行自定义。以下是一个示例：

```scss
.variable {
  font-size: 16px;
  color: #333;
}
```

---

该文档提供了 "变量" 组件的详细介绍，包括属性、事件、插槽、方法和样式选项。
