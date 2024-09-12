import { ref, reactive, computed, SetupContext } from 'vue'
import { ParamsSignal } from '../Models/ParamsSignal'
import { genMapToArrayList } from '@/utils/index'
import {
  TabType,
  fnColumn,
  paramsColumns,
  formulaColumns,
  qualityColumns,
  materielColumns,
  dyColumnsMap,
} from '../enum'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import { injectModel } from '@/libs/Provider/Provider'
import { DataItemType } from '../type/ParamsSignalConfig.d'
import { WorkSectionBaseType } from '../type/Type.d'
import uniqBy from 'lodash/uniqBy'
import mergeWith from 'lodash/mergeWith'
import sortBy from 'lodash/sortBy'
import { _t } from '../app'

import {
  AbilitiesType,
  Ability,
  Parameter,
  Formula,
  Quality,
  Material,
  Configuration,
} from '../type/StationDrawer.d'
import isNil from 'lodash/isNil'
// import { ProcessDrawer } from '../Models/ProcessDrawer'

const getStationConfig = () => {
  return {
    abilitys: {
      label: _t('功能配置'),
      name: 'abilitys',
      isFooter: false,
    },
    params: {
      label: _t('采集参数'),
      name: 'params',
      isContextMenu: false,
      isFooter: false,
      isChecked: false,
      edition: 'G',
    },
    formula: {
      label: _t('配方参数'),
      name: 'formula',
      isFooter: false,
      isContextMenu: false,
      isChecked: false,
      edition: 'H',
    },
    quality: {
      label: _t('不良原因'),
      name: 'quality',
      isFooter: true,
      isContextMenu: true,
    },
    materiel: {
      label: _t('物料参数'),
      name: 'materiel',
      isFooter: false,
      isChecked: false,
      edition: 'I',
    },
  }
}
export const useParams = (props: any, ctx?: SetupContext) => {
  const paramsSignal = injectModel<ParamsSignal>('ParamsSignal')

  const stationTabsMap: any = ref(getStationConfig())
  const tabData = ref<TabType[]>([])
  // 参数
  const paramsData = ref([])

  // 动态数据表
  const dyDataMap = reactive<Record<string, any>>({})

  const active = ref('')

  const onTab = () => {}

  /**
   * 工序参数配置
   */
  const sectionKeyMap = computed(() => {
    return props.sectionKeyMap || {}
  })

  /**
   * 根据flowData获取tabs
   * @param data any[]
   * @returns
   */
  const getDyTabsData = (data = [] as any) => {
    let groupedData: Record<string, any> = {}
    data.forEach((item: any) => {
      const group = item.group
      if (!groupedData[group]) {
        groupedData[group] = {
          ...item,
          name: item.name,
          group: group,

          children: [],
        }
      }
      groupedData[group].children.push(item)
    })

    // 将对象转换为数组
    return Object.values(groupedData)
  }
  /**
   * 获取当前工位的所有工序类型
   * @returns
   */
  const getFlowTypes = () => {
    if (props.row) {
      return props.row?.workSection?.flowDefinitions?.map(
        (item: Record<string, any>) => {
          return item.type
        }
      )
    }
    return []
  }

  /**
   * 初始化详情数据
   * @returns
   */
  const getDetail = () => {
    return computed(() => props.data || {})
  }
  /**
   * 合并采集参数和配方参数
   */
  const handleParamsAndFormula = (
    formulaData: Formula[],
    paramsData: any[],
    materialDetections: any[]
  ) => {
    const { formula, params, material } = sectionKeyMap.value
    if (formula) {
      if (formulaData.length) {
        formulaData.forEach((item: Formula) => {
          const row = formula[item.parameterKey] || {}
          item.name = row.name
          item.description = row.description
        })
      } else {
        Object.values(formula).forEach((item: any, index: number) => {
          formulaData[index] = {
            ...item,
            deliverVariable: '',
            watchVariable: '',
            parameterKey: item.key,
          }
        })
      }
    }
    if (params) {
      if (paramsData.length) {
        paramsData.forEach((item: DataItemType) => {
          const row = params[item.parameterKey] || {}
          item.name = row.name
          item.description = row.description
        })
      } else {
        Object.values(params).forEach((item: any, index: number) => {
          paramsData[index] = {
            ...item,
            variable: '',
            parameterKey: item.key,
          }
        })
      }
    }
    if (material) {
      if (materialDetections.length) {
        materialDetections.forEach((item: DataItemType) => {
          const row = material[item.parameterKey] || {}
          item.name = row.name
          item.description = row?.type?.description
        })
      } else {
        Object.values(material).forEach((item: any, index: number) => {
          materialDetections[index] = {
            ...item,
            verificationSignal: '',
            barcodeVariable: '',
            verificationResultSignal: '',
            parameterKey: item.key,
            description: item.description || item?.type?.description,
          }
        })
      }
    }
  }
  /**
   * 处理功能选项配置
   * @param row
   * @param options
   */
  const onChangeAbility = (row: Record<string, any>, options: any[]) => {
    const item = options.find((item) => item.value === row.abilityValue)
    row.data = item
  }

  /**
   * 获取流程Map
   * @param flowKey
   */
  const getAbilityFlowMap = () => {
    const signalData = getDetail()
    const { workSection } = signalData.value
    const flowDefinitions = workSection?.flowDefinitions || []
    const flowMap: Record<string, any> = {}
    flowDefinitions.forEach((flow: Record<string, any>) => {
      flow.abilitys?.forEach((item: Record<string, any>) => {
        flowMap[item.code] = flow
      })
    })

    return flowMap
  }

  /**
   * 合并初始数据和详情回显数据
   * @param abilities
   * @param data
   */
  const transformAbilities = (abilities: AbilitiesType[]) => {
    const data: Ability[] = props.data?.flowAbilitys || []
    const flowMap = getAbilityFlowMap()
    const map: Record<string, any> = {}
    data.forEach((item) => {
      map[item.name] = item
    })
    const abilitiesData: WorkSectionBaseType[] = []
    abilities?.forEach((item, index) => {
      const v: WorkSectionBaseType = map[item.code] || {}
      const options = item.options.map((option: any) => {
        return {
          label: option.description,
          value: option.value,
          name: option.name,
          description: option.description,
        }
      })
      const sortOptions = sortBy(options, 'value')
      const option = options.find((item) => item.value == v.value) || {}
      abilitiesData.push({
        code: item.code,
        name: item.name,
        description: item.description,
        abilityValue: !isNil(v.value) ? v.value : item.defaultValue,
        data: option,
        flow: flowMap[item.code]?.name,
        options: sortOptions,
      })
    })
    return reactive(uniqBy(abilitiesData, 'code'))
  }
  /**
   * 生成tabs
   * @param stationTabsMap
   */
  const generateTabs = (stationTabsMap: Record<string, any>) => {
    const data = genMapToArrayList(stationTabsMap)
    tabData.value = data
    active.value = tabData.value[0]?.name
  }

  /**
   * 配置参数列
   * @param param0
   */
  const configureColumn = async ({
    abilitiesData = [],
    formulaParameters = [],
    processParameters = [],
    unqualifiedReasons = [],
    materialDetections = [],
  }: {
    abilitiesData?: WorkSectionBaseType[]
    formulaParameters?: Formula[]
    processParameters?: Parameter[]
    unqualifiedReasons?: Quality[]
    materialDetections?: Material[]
  }) => {
    stationTabsMap.value.abilitys.data = abilitiesData
    stationTabsMap.value.abilitys.isDrag = false
    stationTabsMap.value.abilitys.isChecked = false
    // 处理采集参数和配方参数
    handleParamsAndFormula(
      formulaParameters,
      processParameters,
      materialDetections
    )
    // 采集参数
    stationTabsMap.value.params.columns = [
      {
        title: _t('参数名'),
        field: 'name',
        // required: true,
      },
      {
        title: _t('参数描述'),
        field: 'description',
      },
      {
        title: _t('采集变量'),
        field: 'variable',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
        required: true,
      },
    ]
    stationTabsMap.value.params.data = processParameters
    stationTabsMap.value.params.isFooter = false
    // 配方参数
    stationTabsMap.value.formula.columns = [
      {
        title: _t('参数名'),
        field: 'name',
        // required: true,
      },
      {
        title: _t('参数描述'),
        field: 'description',
      },
      {
        title: _t('下发关联变量'),
        field: 'deliverVariable',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
      {
        title: _t('监听关联变量'),
        field: 'watchVariable',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
    ]
    stationTabsMap.value.formula.data = formulaParameters
    stationTabsMap.value.formula.isFooter = false

    // 不良品
    stationTabsMap.value.quality.columns = [
      {
        title: _t('不良品原因名称'),
        field: 'name',
        el: 'input',
        required: true,
      },
      {
        title: _t('判断值'),
        field: 'judgmentValue',
        el: 'input',
        required: true,
      },
      {
        title: _t('不良品原因变量'),
        field: 'variable',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
        required: true,
      },
    ]

    stationTabsMap.value.quality.data = unqualifiedReasons
    // 物料检测
    stationTabsMap.value.materiel.columns = [
      {
        title: _t('物料名称'),
        field: 'name',
        key: 'name',
        // el: 'relationMateriel',
      },
      {
        title: _t('物料类型'),
        field: 'description',
        key: 'description',
        // el: 'relationMateriel',
      },
      {
        title: _t('物料检验信号'),
        field: 'verificationSignal',
        key: 'verificationSignal',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
      {
        title: _t('物料条码变量'),
        field: 'barcodeVariable',
        key: 'barcodeVariable',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
      {
        title: _t('物料校验结果'),
        field: 'verificationResultSignal',
        key: 'verificationResultSignal',
        el: 'variable',
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
      {
        title: _t('绑定物料'),
        field: 'bindMaterialVariable',
        key: 'bindMaterialVariable',
        el: 'variable',
        required: true,
        tipConfig: {
          tip: _t('物料条码信息缓存变量'),
          icon: 'tip',
          style: { marginRight: '20px' },
        },
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
    ]
    stationTabsMap.value.materiel.data = materialDetections
    stationTabsMap.value.materiel.isChecked = false
    stationTabsMap.value.materiel.isFooter = false
  }

  /**
   * 配置动态字段
   * @param flowData
   */
  const configureFields = (flowData?: any) => {
    const flowFields: any = getDyTabsData(flowData?.fields) || []

    const { fields = {} } = sectionKeyMap.value

    const columnsMap = cloneDeep({
      name: {
        title: _t('功能字段'),
        field: 'name',
        key: 'name',
        el: 'text',
      },
      description: {
        title: _t('描述'),
        field: 'description',
        key: 'description',
      },
      rule: {
        title: _t('变量规则'),
        field: 'value',
        el: 'input',
        customRequired: true,
        config: {
          isMultiple: true,
          type: 'select',
        },
      },
    })
    const widgetKeys = ['GenerateBarcode', 'ParsingBarcode']
    flowFields.forEach((item: any, index: number) => {
      columnsMap.rule.el = flowFields[index]?.type?.name
      dyDataMap[item?.group] = item.children.map((row: any) => {
        const ele = {
          ...row,
          ...fields[row.objectName],
          data: fields[row.objectName] || {
            name: row.objectName,
            description: row.name,
          },
          name: row.name,
          description: row.description,
          el: row.type.name,
          elField: 'value', //需要定制的字段选择
        }
        // 后面优化,条码转码
        if (widgetKeys.includes(ele.el)) {
          if (Object.keys(fields).length) {
            ele.value = {
              name: ele.data?.name,
              description: ele.data?.description,
              value: ele.data?.value || ele.value,
              objectName: ele.data?.name,
            }
          } else {
            ele.value = {
              name: '',
              value: '',
              description: '',
              objectName: ele.data?.name,
            }
          }
        } else {
          ele.value = ele.data?.value
        }
        return ele
      })
      set(stationTabsMap.value, item?.group, {
        label: item?.group,
        name: item?.group,
        isFooter: false,
        isDrag: false,
        isChecked: false,
        columns: Object.values(columnsMap),
        // 需要填充数据到动态dataSource中
        data: dyDataMap[item?.group],
      })
    })
  }

  /**
   * 初始化tabs
   */
  const initTabsData = async (isInit: boolean) => {
    tabData.value = []
    if (props.row && !isInit) {
      const types = getFlowTypes() || []
      return initParamsSignalConfigure(types)
    }
  }

  /**
   * 当选择所属工序时，刷新其配置数据
   * @param types
   */
  const initParamsSignalConfigure = async (
    types: number[],
    isChange?: boolean
  ) => {
    paramsSignal.flowData.value = {}
    tabData.value = []
    stationTabsMap.value = getStationConfig()
    const signalData = getDetail()
    const {
      formulaParameters,
      materialDetections,
      processParameters,
      unqualifiedReasons,
      workSection,
    } = signalData.value
    if (workSection?.flowDefinitions && !isChange) {
      const fn = () => {
        const flowDefinitions: any[] = cloneDeep(
          workSection.flowDefinitions || []
        )
        paramsSignal.flowData.value = mergeWith(
          // @ts-ignore
          ...flowDefinitions,
          paramsSignal.mergeArray
        )
      }
      await fn()
    } else {
      if (types.length) {
        await paramsSignal.getAllFlowData(types)
      }
    }

    let flowData = paramsSignal.flowData

    // 功能配置
    stationTabsMap.value.abilitys.columns = [
      {
        title: _t('功能名称'),
        field: 'name',
      },
      // 下个版本添加
      // {
      //   title:  _t('所属流程'),
      //   field: 'flow',
      // },
      {
        title: _t('功能描述'),
        field: 'description',
      },
      {
        title: _t('功能选项'),
        field: 'abilityValue',
        el: 'tag',
        // config: {
        //   valueKey: 'value',
        //   labelValue: 'description',
        // },
        required: true,
      },
    ]
    const abilitiesData = transformAbilities(flowData.value.abilitys)
    configureColumn({
      abilitiesData,
      formulaParameters,
      processParameters,
      unqualifiedReasons,
      materialDetections,
    })

    // 动态tabs
    configureFields(flowData.value)
    generateTabs(stationTabsMap.value)
  }

  const init = async (isInit: boolean) => {
    return initTabsData(isInit)
  }

  ctx?.expose({
    init,
    initParamsSignalConfigure,
  })

  return {
    active,
    tabData,
    paramsData,
    // paramsColumns,
    // 私有的ref
    // ref的表格map
    commonRefs: paramsSignal.commonRefs,
    onTab,
    onChangeAbility,
  }
}
