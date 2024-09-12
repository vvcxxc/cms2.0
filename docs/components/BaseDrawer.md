# BaseDrawer

有些时候, Dialog 组件并不满足我们的需求, 比如你的表单很长, 亦或是你需要临时展示一些文档, Drawer 拥有和 Dialog 几乎相同的 API, 在 UI 上带来不一样的体验.
基础属性与 element-plus 属性相同

## 文档

这个示例展示了一个简单的抽屉组件。当用户点击"打开抽屉"按钮时，`showDrawer` 方法会被调用，显示一个名为 "示例抽屉" 的抽屉，用户可以在抽屉中点击确定或取消按钮，分别触发对应的事件处理函数 `handleConfirm` 和 `closeDrawer`。

## 示例

<script setup>
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer.tsx'
import { ref } from 'vue'

const drawerVisible = ref(false)

const showDrawer = () => {
  drawerVisible.value = true
}

const closeDrawer = () => {
  drawerVisible.value = false
}

const handleConfirm = () => {
  console.log('用户点击了确认按钮')
  closeDrawer()
}
</script>

<Layout>
  <el-button type="primary" @click="showDrawer">打开抽屉</el-button>
  <BaseDrawer width="40%" title="示例抽屉" v-model="drawerVisible" @close="closeDrawer" @confirm="handleConfirm">
    <p>这是抽屉的内容。</p>
  </BaseDrawer>
</Layout>

```js-vue
<template>
  <div>
    <el-button type="primary" @click="showDrawer">打开抽屉</el-button>
    <BaseDrawer title="示例抽屉" v-model="drawerVisible" @close="closeDrawer" @confirm="handleConfirm">
      <p>这是抽屉的内容。</p>
    </BaseDrawer>
  </div>
</template>

<script setup>
import BaseDrawer from './BaseDrawer.vue'
import { ref } from 'vue'

const drawerVisible = ref(false)

const showDrawer = () => {
  drawerVisible.value = true
}

const closeDrawer = () => {
  drawerVisible.value = false
}

const handleConfirm = () => {
  console.log('用户点击了确认按钮')
  closeDrawer()
}
</script>
```

## 属性

| 属性      | 类型    | 默认值 | 说明           |
| --------- | ------- | ------ | -------------- |
| clickable | Boolean | false  | 遮罩是否可点击 |
| title     | String  | ''     | 抽屉标题       |
| width     | String  | ''     | 抽屉宽度       |

## 事件

| 事件              | 说明             |
| ----------------- | ---------------- |
| close             | 关闭抽屉         |
| confirm           | 确认抽屉         |
| update:modelValue | 更新 modelValue  |
| open              | 打开抽屉         |
| beforeClose       | 关闭抽屉前的事件 |
