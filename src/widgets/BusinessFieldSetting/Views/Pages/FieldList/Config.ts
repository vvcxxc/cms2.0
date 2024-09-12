import { reactive } from 'vue'

export const columns = reactive([
  {
    type: 'seq',
    width: 60,
    title: '序号',
  },
  {
    field: 'fieldCode',
    title: '字段',
  },
  {
    field: 'fieldName',
    title: '字段名称',
  },

  {
    field: 'variable',
    title: '变量',
    width: 400,
  },
  {
    field: 'remark',
    title: '备注',
  },
])
