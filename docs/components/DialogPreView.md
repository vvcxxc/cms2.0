# DialogPreView 对话框预览组件

该组件用于显示对话框预览，可以展示图表或者图片列表。

## 示例

<Layout>
  <el-button @click="dialogVisible = true" type='primary'>echart打开</el-button>

<DialogPreView
title="对话框预览示例"
:isChart="true"
:chartOptions="chartOptions"
:picList="picList"
v-model="dialogVisible"
@close="handleClose"
@confirm="handleConfirm"></DialogPreView>

```vue
<template>
  <Layout>
    <DialogPreView
      title="对话框预览示例"
      :isChart="isChart"
      :chartOptions="chartOptions"
      :picList="picList"
      v-model:visible="dialogVisible"
      @close="handleClose"
      @confirm="handleConfirm"
    >
    </DialogPreView>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import DialogPreView from '@/components/DialogPreView/DialogPreView.vue'

const dialogVisible = ref(false)
const isChart = ref(true)
const chartOptions = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
})
const picList = ref([])

const handleClose = () => {
  console.log('对话框关闭')
}

const handleConfirm = () => {
  console.log('确认按钮被点击')
}
</script>
```

<el-button @click="dialogVisible1 = true" type='primary'>图片打开</el-button>
<DialogPreView
title="对话框预览示例"
:isChart="false"
:chartOptions="chartOptions"
:picList="picList"
v-model="dialogVisible1"
@close="handleClose"
@confirm="handleConfirm"></DialogPreView>
</Layout>

<script setup>
import { ref } from 'vue'
import DialogPreView from '@/components/DialogPreView/DialogPreView.tsx'
const ROOT_PATH = 'https://echarts.apache.org/examples';
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const isChart = ref(true)
const chartOptions = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
})
const picList = ref(['https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280'])


const handleClose = () => {
  console.log('对话框关闭')
}

const handleConfirm = () => {
  console.log('确认按钮被点击')
}
</script>

```vue
<template>
  <Layout>
    <DialogPreView
      title="对话框预览示例"
      :isChart="isChart"
      :chartOptions="chartOptions"
      :picList="picList"
      v-model:visible="dialogVisible"
      @close="handleClose"
      @confirm="handleConfirm"
    >
    </DialogPreView>
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import DialogPreView from '@/components/DialogPreView/DialogPreView.vue'

const dialogVisible = ref(false)
const isChart = ref(true)
const chartOptions = ref({})
const picList = ref([
  'https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280',
])

const handleClose = () => {
  console.log('对话框关闭')
}

const handleConfirm = () => {
  console.log('确认按钮被点击')
}
</script>
```

## 属性

| 属性名       | 类型            | 默认值 | 必填 | 描述           |
| ------------ | --------------- | ------ | ---- | -------------- |
| title        | String          | '预览' | 否   | 对话框标题     |
| isChart      | Boolean         | false  | 否   | 是否为图表预览 |
| chartOptions | Object          | {}     | 否   | 图表配置项     |
| picList      | Array\<string\> | []     | 否   | 图片列表       |

## 事件

| 事件名            | 参数    | 描述                             |
| ----------------- | ------- | -------------------------------- |
| update:modelValue | Boolean | 当对话框的显示状态发生改变时触发 |
| close             | -       | 当对话框关闭时触发               |
| confirm           | -       | 当确认按钮被点击时触发           |
