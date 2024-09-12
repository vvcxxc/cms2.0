import { ref, Ref, reactive, computed, inject, nextTick } from 'vue'
import { injectModel } from '@/libs/Provider/Provider'
import { Configure } from '@/widgets/SystemManagement/Models/Configure'
import { useGlobalState } from '@/libs/Store/Store'

import { ElMessage } from 'element-plus'
import { ProcessDrawer } from '../Models/ProcessDrawer'
import { ProcessSetting } from '../Models/ProcessSetting'
import _get from 'lodash/get'
import _set from 'lodash/set'
import { _t } from '../app'

export const useProcessSettingDialog = (props: any, ctx?: any) => {
  const system = injectModel<Configure>('configure')
  const processDrawer = injectModel<ProcessDrawer>('processDrawer')
  const processSetting = injectModel<ProcessSetting>('processSetting')
  const {
    workSectionList,
    productionLineList,
    systemConfig,
    getWorkSectionList,
  } = useGlobalState()
  /**
   * 产线结构 0 -工序工位 1- 产线的-工序工位
   */
  const productionLineStructure = computed(() => {
    const state: Ref<any> = systemConfig.state
    const structure = state.value.ProductionLineStructure
    return structure == 0
  })
  // 进站tableRef
  const stationRef = ref()
  // 进站物料Ref
  const materielRef = ref()
  const formData = reactive({})
  // 进站结果值配置
  const stationValue = ref('')
  // 产线数据
  const productData = ref<any>([])
  // 进站数据
  const stationData = ref<any>([])
  // 补充结果映射
  const mapDescData = ref<any>([])
  // 物料dataMap
  const materielMap = ref<Record<string, any>>({})
  // 产线工序
  const productWorkSectionMap = ref<Record<string, any>>({})
  // 产线表格配置
  const productColumns = [
    {
      title: _t('产线段'),
      field: 'segment',
      required: true,
      hide: productionLineStructure.value,
      options: productionLineList.state,
      config: {
        valueKey: 'value',
        labelKey: 'name',
      },
      el: 'tag',
    },
    {
      title: _t('工序名称'),
      field: 'workSectionCode',
      required: true,
      options: workSectionList.state,
      el: 'tag',
    },
    {
      title: _t('绑定唯一料'),
      field: 'materialName',
      required: true,
      el: 'tag',
      config: {
        valueKey: 'key',
        labelKey: 'name',
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 100,
      el: 'tag',
    },
  ]
  // 进站结果配置
  const stationColumns = [
    {
      title: _t('进站结果'),
      field: 'description',
      el: 'tag',
    },
    {
      title: _t('下发值'),
      field: 'value',
      required: true,
      el: 'input',
    },
  ]
  // 暂时放这里
  // 映射配置
  const mapColumns = [
    {
      title: _t('异常原因'),
      field: 'abnormalCause',
    },
    {
      title: _t('原始值'),
      field: 'originalValue',
    },
    {
      title: _t('映射值'),
      field: 'mappedValue',
      el: 'input',
      require: true,
    },
  ]

  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  /**
   * 获取当前的物料数据
   */
  const currentMateriel = computed(() => {
    return (v: string) => {
      return materielMap.value[v] || []
    }
  })

  /**
   * 工序变化时的回调
   * @param v
   */
  const onChangeSegment = async (v: string) => {
    if (v && !materielMap.value[v]) {
      const data = await processDrawer.getWorkSectionDetail(null, v)
      materielMap.value[v] = data.materialDetections
        .filter((item: any) => {
          return item.type?.value === 1
        })
        .map((item: any) => {
          return {
            ...item,
            materialName: item.name,
          }
        })
    }
  }

  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    const materielData = materielRef.value?.getData()
    const stationData = stationRef.value?.getData()
    if (materielData && stationData) {
      await processSetting.saveWorkSection({
        EntryResultConfig: stationData,
        MaterialAssociationConfig: materielData,
        AbnormalCauseConfig: mapDescData.value,
      })
      ElMessage.success(_t('保存成功'))
      onClose()
    }
  }
  /**
   * 当组件变化时，需更新其字段值绑定
   * @param base [field: string, value: string, row: any] field--config.valueKey
   * @param keys
   * @param options
   */
  const onChange = (
    base: any[],
    keys: string[],
    options: any[],
    data?: any[]
  ) => {
    nextTick(() => {
      const row = base[2]
      const item = options?.find((opt: any) => {
        const key = base[0]
        const v = base[1]
        const value = _get(opt, key)
        return value === v
      })
      if (item) {
        keys.forEach((key: string) => {
          _set(row, key, _get(item, key))
        })
      }
      // 选择后，需要清除后续字段
      if (data && data.length > 0) {
        const row = data[0]
        data.unshift()
        data.forEach((key) => {
          row[key] = ''
        })
      }
    })
  }

  /**
   * 获取工序
   * @param id
   * @param row
   * @param options
   */
  const onSectionMove = async (
    id: string,
    row: Record<string, any>,
    options: any[]
  ) => {
    if (
      id &&
      !productWorkSectionMap.value[id] &&
      !productionLineStructure.value
    ) {
      const items = await getWorkSectionList(id)
      productWorkSectionMap.value[id] = items
    }
  }

  const onOpen = async () => {
    const data = await system.getFormDataBySettings()
    productData.value = data.MaterialAssociationConfig || []
    stationData.value = data.EntryResultConfig || []
    mapDescData.value = data.AbnormalCauseConfig || []
  }
  return {
    stationValue,
    formData,
    visible,
    productData,
    stationData,
    productColumns,
    stationColumns,
    mapDescData,
    mapColumns,
    materielMap,
    currentMateriel,
    stationRef,
    materielRef,
    productWorkSectionMap,
    onOpen,
    onChangeSegment,
    onClose,
    onConfirm,
    onChange,
    onSectionMove,
  }
}
