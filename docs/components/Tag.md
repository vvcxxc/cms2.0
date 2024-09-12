# Tag 标签组件文档

## 简介

Tag 是一个用于显示标签或者下拉选择的 Vue 组件。它可以根据传入的数据和配置，展示不同样式和功能的标签，提供丰富的用户交互体验。

## 使用方式

<Layout>
  单标签
  <div v-for='v in [1,2,3,4]' style="width: 150px; margin-bottom: 5px;">
    <Tag>标签{{v}}</Tag>
  </div>
多个显示tip
<Tag :data="[
    {label: '标签一', value: 1},
    {label: '标签二', value: 2},
  ]">标签一</Tag>

单个显示 tip
<Tag :showTip="true" :data="[
  {label: '标签一', value: 1},
  {label: '标签二', value: 2},
]">标签一</Tag>

单个显示 tip,超出显示+
<Tag :max="3" :showTip="true" :data="[
  {label: '标签一', value: 1},
  {label: '标签二', value: 2},
  {label: '标签三', value: 3},
  {label: '标签四', value: 4},
]"></Tag>
选择 tag
<br/>
<Tag v-model="v" :options="[
  {label: '标签一', value: 1},
  {label: '标签二', value: 2},
  {label: '标签三', value: 3},
  {label: '标签四', value: 4},
]">标签一</Tag>
</Layout>

<script setup>
import Tag from '@/components/Tag/Tag.tsx'
import {ref } from 'vue'
const v = ref(1)

</script>

```vue
<template>
  单标签
  <div v-for="v in [1, 2, 3, 4]" style="width: 150px; margin-bottom: 5px;">
    <Tag>标签{{ v }}</Tag>
  </div>
  多个显示tip
  <Tag
    :data="[
      { label: '标签一', value: 1 },
      { label: '标签二', value: 2 },
    ]"
    >标签一</Tag
  >

  单个显示 tip
  <Tag
    :showTip="true"
    :data="[
      { label: '标签一', value: 1 },
      { label: '标签二', value: 2 },
    ]"
    >标签一</Tag
  >

  单个显示 tip,超出显示+
  <Tag
    :max="3"
    :showTip="true"
    :data="[
      { label: '标签一', value: 1 },
      { label: '标签二', value: 2 },
      { label: '标签三', value: 3 },
      { label: '标签四', value: 4 },
    ]"
  ></Tag>
  选择 tag
  <br />
  <Tag
    v-model="v"
    :options="[
      { label: '标签一', value: 1 },
      { label: '标签二', value: 2 },
      { label: '标签三', value: 3 },
      { label: '标签四', value: 4 },
    ]"
    >标签一</Tag
  >
</template>

<script setup>
import Tag from '@/components/Tag/Tag.tsx'
import { ref } from 'vue'
const v = ref(1)
</script>
```

## Props

| 属性名       | 类型          | 默认值  | 说明                   |
| ------------ | ------------- | ------- | ---------------------- |
| data         | Array/Object  | null    | 标签数据               |
| options      | Array         | null    | 下拉选项               |
| modelValue   | String/Number | ''      | 组件的值               |
| trigger      | String        | 'hover' | 触发方式               |
| showClose    | Boolean       | false   | 是否显示关闭按钮       |
| showTip      | Boolean       | false   | 是否显示提示           |
| valueKey     | String        | 'value' | 数据值对应的键名       |
| labelKey     | String        | 'label' | 标签显示文本对应的键名 |
| defaultValue | String        | ''      | 默认值                 |
| max          | Number        | 999     | 最大值                 |

## Events

| 事件名            | 说明         |
| ----------------- | ------------ |
| click             | 点击事件     |
| update:modelValue | 更新组件的值 |
| change            | 值变化事件   |
| mouseenter        | 鼠标移入事件 |
| update:data       | 更新数据事件 |

## 方法

| 方法名          | 说明                   |
| --------------- | ---------------------- |
| onCommand       | 选项命令事件           |
| onClose         | 关闭标签事件           |
| onVisibleChange | 下拉选择可见性变化事件 |
| onClick         | 点击事件               |
| onMouseenter    | 鼠标移入事件           |

## 插槽

| 名称    | 说明         |
| ------- | ------------ |
| default | 默认内容插槽 |

---

这样的表格形式能够更清晰地展示组件的各项属性、事件、方法和插槽，便于用户快速查阅和使用。

```

```
