# DyForm 动态表单组件

该组件用于生成动态表单，可以根据传入的配置项渲染不同的表单项。

## 示例

<Layout>
  <DyForm
    labelWidth="100px"
    labelPosition="left"
    ref='formRef'
    v-model:formData="formData"
    :formItemProps="formItemProps"
    :inLine="false"
  />
  <el-button @click="valid" type='primary'>提交</el-button>
</Layout>
  
<script setup>
import { ref, h } from 'vue'
import DyForm from '@/components/DyForm/DyForm.tsx'

const formRef = ref()
const formData = ref({})
const formItemProps = ref([
{
label: '姓名',
prop: 'name',
el: 'input',
placeholder: '请输入姓名',
rules: [{ required: true, message: '姓名', trigger: 'blur' }],
},
{
label: '编码',
prop: 'code',
el: 'input',
placeholder: '请输入编码',
rules: [
{ required: true, message: '不能为空或空白字符！', trigger: 'blur' },
],
},
{
label: '地址',
prop: 'addr',
el: 'select',
placeholder: '请选择',
options: [{
label: '广东',
value: '222'
}]
},
{
label: '公司',
prop: 'company',
el: (props, {attrs}) => h('div', null, '盛原成'),
}
])

const handleUpdateFormData = (data) => {
console.log('表单数据已更新:', data)
}

const valid = () => {
formRef.value?.validate()
}

// 可根据需要设置 formData 和 formItemProps
</script>

```vue
<template>
  <Layout>
    <DyForm
      labelWidth="100px"
      labelPosition="left"
      ref="formRef"
      v-model:formData="formData"
      :formItemProps="formItemProps"
      :inLine="false"
    />
    <el-button @click="valid" type="primary">提交</el-button>
    />
  </Layout>
</template>

<script setup>
import { ref } from 'vue'
import DyForm from '@/components/DyForm/DyForm.tsx'

const formRef = ref()
const formData = ref({})
const formItemProps = ref([
  {
    label: '姓名',
    prop: 'name',
    el: 'input',
    placeholder: '请输入姓名',
    rules: [{ required: true, message: '姓名', trigger: 'blur' }],
  },
  {
    label: '编码',
    prop: 'code',
    el: 'input',
    placeholder: '请输入编码',
    rules: [
      { required: true, message: '不能为空或空白字符！', trigger: 'blur' },
    ],
  },
    {
    label: '地址',
    prop: 'addr',
    el: 'select',
    placeholder: '请选择',
    options: [{
      label: 'xxx'
      value: '222'
    }]

  },
])

const handleUpdateFormData = (data) => {
  console.log('表单数据已更新:', data)
}

const valid = () => {
  formRef.value?.validate()
}
</script>
```

在该示例中，`DyForm` 组件被使用，并通过属性传递了表单数据对象 `formData` 和表单项配置数组 `formItemProps`。当表单数据对象发生改变时，触发 `update:formData` 事件，调用 `handleUpdateFormData` 方法更新表单数据。

## 属性

| 属性名        | 类型    | 默认值  | 必填 | 描述               |
| ------------- | ------- | ------- | ---- | ------------------ |
| labelWidth    | String  | '100px' | 否   | 表单项标签宽度     |
| labelPosition | String  | 'left'  | 否   | 表单项标签位置     |
| formData      | Object  | {}      | 否   | 表单数据对象       |
| formItemProps | Array   | []      | 否   | 表单项配置数组     |
| inLine        | Boolean | false   | 否   | 是否为行内表单布局 |

## 表单项配置属性（formItemProps）

| 属性名    | 类型                | 默认值 | 必填 | 描述                                         |
| --------- | ------------------- | ------ | ---- | -------------------------------------------- |
| el        | String or Component | -      | 是   | 表单项类型，支持预设的字符串类型或自定义组件 |
| prop      | String              | -      | 是   | 表单项数据对象中的属性名                     |
| label     | String              | -      | 否   | 表单项标签文字                               |
| rules     | Array               | []     | 否   | 表单项验证规则                               |
| width     | String              | -      | 否   | 表单项宽度                                   |
| height    | String              | -      | 否   | 表单项高度                                   |
| labelIcon | String              | -      | 否   | 表单项标签图标                               |
| options   | Array               | []     | 否   | 选项类型表单项的选项数组                     |
| isHide    | Boolean             | false  | 否   | 是否隐藏表单项                               |
| isTitle   | Boolean             | false  | 否   | 是否为标题                                   |
| title     | String or Component | -      | 否   | 标题内容，仅当 isTitle 为 true 时生效        |

## 方法

| 方法名    | 参数 | 返回值  | 描述                   |
| --------- | ---- | ------- | ---------------------- |
| validate  | -    | Promise | 验证表单项是否通过验证 |
| resetForm | -    | -       | 重置表单项的值         |
