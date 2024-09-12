# Tab 标签页组件

## 该组件用于展示多个标签页，并支持切换标签页功能。

## 示例 1

<Layout>
  <Tab :data="tabData" v-model:active="activeTab" size="small" @tab="handleTabChange">
    <TabPane v-for="item in tabData" :key="item.name" :name="item.name" :label="item.label">
      <component :is="item.component"/>
    </TabPane>
  </Tab>
</Layout>

<script setup>
import Tab from '@/components/Tab/Tab.tsx'
import TabPane from '@/components/Tab/TabPane.tsx'
import { ref, h } from 'vue'

const activeTab = ref('')
const tabData = ref([
  { name: 'tab1', label: '标签页1', component: h('div', null, '1') },
  { name: 'tab2', label: '标签页2', component: h('div', null, '2') },
  { name: 'tab3', label: '标签页3', component: h('div', null, '3') },
])

const handleTabChange = (tabName) => {
  activeTab.value = tabName
}
</script>

```vue
<template>
  <Tab
    :data="tabData"
    v-model:active="activeTab"
    size="small"
    @tab="handleTabChange"
  >
    <template #default>
      <TabPane
        v-for="item in tabData"
        :key="item.name"
        :name="item.name"
        :label="item.label"
      >
        <item.component />
      </TabPane>
    </template>
  </Tab>
</template>

<script setup>
import Tab from '@/components/Tab/Tab.tsx'
import TabPane from '@/components/Tab/TabPane.tsx'
import { ref, h } from 'vue'

const activeTab = ref('')
const tabData = ref([
  { name: 'tab1', label: '标签页1', component: h('div', null, '1') },
  { name: 'tab2', label: '标签页2', component: h('div', null, '2') },
  { name: 'tab3', label: '标签页3', component: h('div', null, '3') },
])

const handleTabChange = (tabName) => {
  activeTab.value = tabName
}
</script>
```

## 示例 2

<Layout>
  <Tab :data="tabData" v-model:active="activeTab" size="small" @tab="handleTabChange">

  </Tab>
</Layout>

```vue
<template>
  <Tab
    :data="tabData"
    v-model:active="activeTab"
    size="small"
    @tab="handleTabChange"
  ></Tab>
</template>

<script setup>
import Tab from '@/components/Tab/Tab.tsx'
import TabPane from '@/components/Tab/TabPane.tsx'
import { ref, h } from 'vue'

const activeTab = ref('')
const tabData = ref([
  { name: 'tab1', label: '标签页1', component: h('div', null, '1') },
  { name: 'tab2', label: '标签页2', component: h('div', null, '2') },
  { name: 'tab3', label: '标签页3', component: h('div', null, '3') },
])

const handleTabChange = (tabName) => {
  activeTab.value = tabName
}
</script>
```

在该示例中，`Tab` 组件用于展示多个标签页，通过 `data` 属性传入标签页的数据数组，通过 `v-model:active` 实现对当前激活标签页的控制。标签页的内容通过默认插槽传入，每个标签页对应一个 `TabPane` 组件，并传入相应的组件作为内容。

## 属性

| 属性名 | 类型          | 默认值 | 必填 | 描述                       |
| ------ | ------------- | ------ | ---- | -------------------------- |
| data   | Array         | []     | 否   | 标签页数据数组             |
| size   | String        | ''     | 否   | 标签页尺寸                 |
| active | String/Number | ''     | 否   | 当前激活的标签页名称或索引 |
| type   | String        | 'list' | 否   | 标签页类型                 |

## 事件

| 事件名 | 参数   | 描述                                 |
| ------ | ------ | ------------------------------------ |
| tab    | String | 切换标签页时触发，参数为标签页的名称 |

## 插槽

| 名称 | 描述       |
| ---- | ---------- |
| 默认 | 标签页内容 |

## TabPane 标签页组件

该组件用于定义单个标签页。

## 属性

| 属性名 | 类型   | 默认值 | 必填 | 描述       |
| ------ | ------ | ------ | ---- | ---------- |
| label  | String | -      | 是   | 标签页标题 |
| name   | String | -      | 是   | 标签页名称 |
| ...    | -      | -      | -    | 其他属性   |

## 插槽

| 名称 | 描述       |
| ---- | ---------- |
| 默认 | 标签页内容 |
