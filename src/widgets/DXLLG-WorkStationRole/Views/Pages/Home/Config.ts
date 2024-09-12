import { reactive } from 'vue'

export const columns = reactive([
  {
    type: 'seq',
    width: 60,
    title: '序号',
  },
  {
    field: 'roleName',
    title: '角色名称',
  },
  {
    field: 'remark',
    title: '备注',
  },
  {
    field: 'workStations',
    title: '绑定工位',
  },
])
