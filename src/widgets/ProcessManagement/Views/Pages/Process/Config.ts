import { useGlobalState } from '@/libs/Store/Store'
import { Ref, computed, reactive } from 'vue'
import { Language } from '@/libs/Language/Language'
import { _t } from '../../../app'

export const columns = () => {
  const { getProductList, getFlowList, systemConfig } = useGlobalState()
  /**
   * 产线结构 0 -工序工位 1- 产线的-工序工位
   */
  const productionLineStructure = computed(() => {
    const state: Ref<any> = systemConfig.state
    const structure = state.value.ProductionLineStructure
    return structure == 0
  })
  const { local } = Language.useElementPlusI18n()

  const l = [
    {
      type: 'seq',
      width: 60,
      title: _t('序号'),
    },
    {
      field: 'name',
      title: _t('工序名称'),
    },
    {
      field: 'code',
      title: _t('工序编号'),
    },
  ]
  const c = [
    {
      field: 'segment',
      title: _t('所属产线段'),
      el: 'select',
      // 搜索时所用的字段
      prop: 'segment',
      options: getProductList,
      width: 150,
      placeholder: _t('请选择所属产线段'),
    },
  ]
  const r = reactive([
    {
      field: 'flowDefinitions',
      width: local.value?.name == 'zh-cn' ? 350 : 500,
      title: _t('关联流程'),
      el: 'select',
      prop: 'FlowType',
      options: getFlowList,
      placeholder: _t('请选择关联流程'),
    },

    {
      field: 'remark',
      title: _t('备注'),
    },
  ])
  return computed(() => {
    if (productionLineStructure.value) {
      return [...l, ...r]
    } else {
      return [...l, ...c, ...r]
    }
  })
}
