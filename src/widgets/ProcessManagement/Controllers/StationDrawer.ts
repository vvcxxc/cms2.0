import {
  ref,
  onMounted,
  reactive,
  computed,
  h,
  watch,
  Ref,
  nextTick,
  SetupContext,
} from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { paramsColumns } from '../enum'
import WorkSectionDialog from '../Views/Pages/Dialog/WorkSectionDialog/WorkSectionDialog'
import { injectModel } from '@/libs/Provider/Provider'
import { SectionType, Configuration } from '../type/StationDrawer'
import { FlowDefinitionType } from '../type/Type.d'
import { StationDrawer } from '../Models/StationDrawer'
import { ParamsSignal } from '../Models/ParamsSignal'
import { ElMessage } from 'element-plus'
import { Create } from '@/libs/Create/Create'
import { useGlobalState } from '@/libs/Store/Store'
import { ProcessDrawer } from '../Models/ProcessDrawer'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import { isEdition } from '@/libs/Permission/Permission'
import { _t } from '../app'

export const useStationDrawer = (props: any, ctx?: any) => {
  const processDrawer = injectModel<ProcessDrawer>('ProcessDrawer')
  const { systemConfig } = useGlobalState()
  /**
   * 用来对比的初始化数据
   */
  const initiateData: Ref<Record<string, any>> = ref({})
  /**
   * 工位弹窗model
   */
  const stationDrawer = injectModel<StationDrawer>('stationDrawer')
  /**
   * 参数信号model
   */
  const paramsSignal = injectModel<ParamsSignal>('ParamsSignal')
  /**
   * 表单
   */
  const formData = reactive<Create<{}>>(new Create({}))
  const formRef = ref<any>()
  /**
   * 流程数据
   */
  const flowDefinitions = ref<FlowDefinitionType[]>([])
  /**
   * 参数配置数据
   */
  const signalData = ref()
  /**
   * 参数ref
   */
  const ParamsRef = ref()
  /**
   * 行数据
   */
  const currentRow: Ref = ref(null)
  /**
   * 行数据
   */
  const sopDisabled: Ref = ref(false)
  /**
   * 工序map
   */
  const sectionKeyMap = ref<Record<string, any>>({})
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const current = computed(() => {
    return props.row || null
  })
  /**
   * 参数
   */
  const paramsData = ref([])

  /**
   * 校验是否有数据变化
   */
  const checkIsEqualObject = () => {
    const data = getWorkStationData()
    const check = isEqual(initiateData.value, data)
    return check
  }

  const onClose = async (done: () => void) => {
    if (visible.value) {
      if (checkIsEqualObject()) {
        visible.value = false
        done && done()
      } else {
        ConfirmBox(_t('当前工位数据未保存，是否确认关闭？'), _t('确认')).then(
          () => {
            visible.value = false
            done && done()
          }
        )
      }
    }
  }

  /**
   * 获取工序数据
   */
  const getWorkStationData = () => {
    const paramsMap: Record<string, any> = {}
    const commonRefs = paramsSignal.commonRefs.value || {}
    Object.keys(commonRefs).forEach((key) => {
      if (commonRefs[key]) {
        if (!commonRefs[key].getData) {
          delete commonRefs[key]
        }
      }
    })

    for (const name in commonRefs) {
      if (Object.prototype.hasOwnProperty.call(commonRefs, name)) {
        const element = commonRefs[name]
        if (element) {
          const data = element?.getData(true)
          if (!data) {
            break
          } else {
            paramsMap[name] = data
          }
        }
      }
    }
    return cloneDeep({
      paramsMap,
      formData,
    })
  }

  /**
   * 校验并保存
   */
  const onConfirm = async (id = '') => {
    const valid: boolean = await formRef.value?.validate()
    if (valid || !formRef.value) {
      return new Promise((resolve, reject) => {
        let flag = false
        const paramsMap: Record<string, any> = {}

        const commonRefs = paramsSignal.commonRefs.value || {}
        const dataRef = commonRefs[id] || commonRefs

        Object.keys(dataRef).forEach((key) => {
          if (dataRef[key]) {
            if (!dataRef[key].getData) {
              delete dataRef[key]
            }
          }
        })

        for (const name in dataRef) {
          if (Object.prototype.hasOwnProperty.call(dataRef, name)) {
            const element = dataRef[name]
            if (element) {
              const data = element?.getData()
              if (!data) {
                flag = true
                reject()
                break
              } else {
                paramsMap[name] = data
              }
            }
          }
        }
        !flag && saveStationData(paramsMap, id, resolve)
      })
    }
  }
  /**
   * 保存工位数据
   * @param paramsMap
   */
  const saveStationData = async (
    paramsMap: Configuration,
    id: string,
    resolve: (value?: unknown) => void
    // reject: (value?: unknown) => void
  ) => {
    const data = {
      paramsMap,
      formData,
      sort: props.sort,
    }
    const rowId = id || current.value?.id
    const res = await stationDrawer.checkStation(data, rowId)
    const save = async () => {
      if (rowId) {
        await stationDrawer.updateStation(rowId, data)
      } else {
        await stationDrawer.addStation(data)
      }
      ElMessage.success(_t('保存成功，注意重启流程服务！'))
      ctx.emit('confirm')
      resolve()
    }
    if (res) {
      ConfirmBox(res, _t('确认')).then(async () => {
        save()
      })
    } else {
      save()
    }
  }

  /**
   * 获取批量配置的基本信息
   * @param id 工位ID
   * @returns
   */
  const getBitConfigure = async (id: string) => {
    await getWorkSection(id)
    return {
      sectionKeyMap,
      currentRow,
      signalData,
    }
  }

  /**
   * 打开工位并获取详情
   * @returns
   */
  const onOpen = async () => {
    await setFormItems()
    if (!current.value?.id) {
      signalData.value = {}

      currentRow.value = null
      formData.reset()
      await ParamsRef.value?.init(true)
      initiateData.value = getWorkStationData()
    } else {
      getWorkSection(current.value.id)
    }
  }
  /**
   * 获取工位详情
   * @param id
   */
  const getWorkSection = async (id: string) => {
    const res = await stationDrawer.getStationDetail(id)
    handleStationDetail(res)
    currentRow.value = res
    getSectionMap(res)
    nextTick(async () => {
      await ParamsRef.value?.init()
      initiateData.value = getWorkStationData()
    })
  }

  /**
   * 获取工序的采集参数和配方参数
   * @param data
   * @returns
   */
  const getSectionMap = (data: Record<string, any>) => {
    const {
      formulaParameters = [],
      processParameters = [],
      materialDetections = [],
    } = data.workSection
    // sectionKeyMap.value = {}
    const formula: Record<string, any> = {}
    const params: Record<string, any> = {}
    const material: Record<string, any> = {}
    const fields: Record<string, any> = {}
    formulaParameters.forEach((item: any) => {
      formula[item.key] = item
    })
    processParameters.forEach((item: any) => {
      params[item.key] = item
    })
    materialDetections.forEach((item: any) => {
      material[item.key] = item
    })
    data?.flowFields?.forEach((item: any) => {
      fields[item.name] = item
    })
    sectionKeyMap.value = {
      formula,
      params,
      material,
    }
    if (data?.flowFields) {
      sectionKeyMap.value.fields = fields
    }

    return sectionKeyMap.value
  }

  /**
   * 处理工位详情
   * @param data
   */
  const handleStationDetail = (data: Record<string, any>) => {
    const sData = cloneDeep(data)
    signalData.value = sData
    const form = new Create({
      name: data.name,
      workSection: data.workSection,
      kanbanIpAddress: data.kanbanIpAddress,
      sopVariable: data.sopVariable,
      updateCodeVariable: data.updateCodeVariable,
      flow: data.workSection?.flowDefinitions,
      concurrencyStamp: data.concurrencyStamp,
      remark: data.remark,
    })
    formData.update(form)
  }

  /**
   * 切换工序时，改变数据结构与状态
   * @param id
   */
  const getWorkSectionDetail = async (id?: string) => {
    const res = await processDrawer.getWorkSectionDetail(null, id)
    getSectionMap({
      workSection: res,
    })
    return res
  }
  /**
   * 选择工位
   * @param sectionData
   */
  const onSectionSelect = async (sectionData: SectionType) => {
    flowDefinitions.value = sectionData.flowDefinitions || []
    formData.flow = flowDefinitions.value
    const types: number[] = formData.flow.map((item: any) => item.type)
    const workSection = await getWorkSectionDetail(sectionData.id)
    if (!props.row) {
      signalData.value = {
        workSection,
      }
    }
    // 更新动态表格
    ParamsRef.value?.initParamsSignalConfigure(types, true)
  }

  const currentSopState = computed(() => {
    return !(!sopDisabled.value && isEdition(['M']))
  })

  const formItems = ref<FormItemPropType[]>()
  const setFormItems = () => {
    formItems.value = [
      {
        label: _t('工位名称'),
        prop: 'name',
        el: 'input',
        clearable: true,
        placeholder: _t('请输入工位名称'),
        rules: [
          { required: true, message: _t('请输入工位名称'), trigger: 'blur' },
        ],
      },
      {
        label: _t('所属工序'),
        prop: 'workSection',
        clearable: true,
        el: (props: any, { attrs }: SetupContext) => {
          return h(WorkSectionDialog, {
            ...props,
            ...attrs,
            onConfirm: onSectionSelect,
          })
        },
        placeholder: _t('请选择所属工序'),
        rules: [
          { required: true, message: _t('请选择所属工序'), trigger: 'blur' },
        ],
        width: '100%',
      },
      {
        label: _t('关联流程'),
        prop: 'flow',
        el: 'textareaFlow',
        collapseTags: true,
        placeholder: _t('关联流程'),
        disabled: true,
        width: '100%',
      },
      {
        label: _t('看板IP地址'),
        prop: 'kanbanIpAddress',
        el: 'input',
        placeholder: _t('请输入看板IP地址'),
        width: '100%',
        isHide: !isEdition(['J']),
        rules: [
          {
            pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
            message: _t('请输入看板IP地址'),
            trigger: 'blur',
          },
        ],
      },
      {
        label: _t('SOP信号'),
        prop: 'sopVariable',
        el: 'variable',
        placeholder: _t('请选择SOP信号'),
        disabled: sopDisabled,
        isHide: currentSopState,
        isClose: true,
        clearable: true,
        type: 'input',
      },
      {
        label: _t('更新码'),
        prop: 'updateCodeVariable',
        el: 'variable',
        clearable: true,
        placeholder: _t('请选择更新码'),
        isClose: true,
        type: 'input',
      },
      {
        label: _t('备注'),
        prop: 'remark',
        el: 'input',
        placeholder: _t('请输入'),
        type: 'textarea',
        rows: 1,
      },
    ]
  }
  watch(
    () => current.value,
    () => onOpen
  )

  watch(
    systemConfig.state,
    (cfg: Record<string, any>) => {
      sopDisabled.value = !Boolean(Number(cfg.Sop_Enabled))
    },
    {
      immediate: true,
    }
  )

  return {
    formItems,
    formRef,
    formData,
    visible,
    paramsData,
    paramsColumns,
    signalData,
    currentRow,
    sectionKeyMap,
    ParamsRef,
    getBitConfigure,
    onClose,
    onConfirm,
    onOpen,
  }
}
