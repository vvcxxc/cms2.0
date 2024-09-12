import { reactive } from 'vue'
import { flowBusinessType } from '@/widgets/FlowManagement/enum'
import { getFlowTypes } from '@/widgets/FlowManagement/Models/Service/Service'
import { _t } from '../../../app'
export const columns = reactive([
  {
    type: 'seq',
    width: 60,
    title: _t('序号'),
  },
  {
    field: 'name',
    title: _t('流程名称'),
    width: 400,
  },
  {
    field: 'type',
    title: _t('交互类型'),
    el: 'select',
    prop: 'BusinessType',
    options: getFlowTypes,
    placeholder: _t('请选择交互类型'),
    width: 150,
  },
  {
    field: 'abilitys',
    title: _t('功能项'),
    width: 300,
  },
  {
    field: 'associationObjects',
    title: _t('关联工序'),
  },
  {
    field: 'description',
    title: _t('备注'),
    width: 200,
  },
  {
    field: 'action',
    title: _t('操作'),
    width: 150,
  },
])
