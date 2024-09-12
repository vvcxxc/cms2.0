import { useGlobalState } from '@/libs/Store/Store'
import { reactive, ref, Ref, onMounted } from 'vue'
import { isEdition } from '@/libs/Permission/Permission'
import { _t } from '../../../app'

interface StateType<T> {
  state: Ref<T>
}

export const getColumns = () => {
  const { getWorkSectionList } = useGlobalState()

  const columns = [
    {
      type: 'seq',
      width: 60,
      title: _t('序号'),
    },
    {
      field: 'name',
      title: _t('工位名称'),
    },
    {
      field: 'workSection',
      title: _t('所属工序'),
      width: 200,
      el: 'select',
      // 搜索时所用的字段
      prop: 'workSection',
      options: getWorkSectionList,
      placeholder: _t('请选择所属工序'),
    },
    {
      field: 'flowDefinitions',
      title: _t('关联流程'),
      width: 350,
    },
    {
      field: 'kanbanIpAddress',
      title: _t('看板IP'),
    },
    {
      field: 'sopVariable',
      title: _t('SOP信号'),
    },
    {
      field: 'updateCodeVariable',
      title: _t('更新码变量'),
    },
    {
      field: 'remark',
      title: _t('备注'),
    },
  ].filter((item) => {
    if (item.field === 'kanbanIpAddress') {
      return isEdition(['J'])
    }
    if (item.field === 'sopVariable') {
      return isEdition(['M'])
    }
    return true
  })

  return reactive(columns)
}
