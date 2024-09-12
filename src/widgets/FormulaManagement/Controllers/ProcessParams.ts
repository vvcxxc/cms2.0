import {
  onUnmounted,
  reactive,
  ref,
  watch,
  onMounted,
  h,
  Fragment,
  nextTick,
} from 'vue'
import { createInjector } from '../store/ManagementStore'
import { injectModel } from '@/libs/Provider/Provider'
import { Formula } from '../Models/Formula'
import sdk from 'sdk'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { isNil } from 'lodash'
const { Variable } = sdk.models
export const useProcessParams = (props: any, ctx: any) => {
  const formula = injectModel<Formula>('formula')

  const {
    currentFormula,
    currentWorkSection,
    formulaParameterChecked,
    processParameterChecked,
  } = createInjector()
  const tableRef = ref()
  // const processParameters = ref<any[]>([])
  // const formulaParameters = ref<any[]>([])

  const currentTab = ref('process')
  const versionData = ref<any>(null)
  const dialogConfig = reactive({
    visible: false,
    updateVisible: false,
    versionVisible: false,
  })
  let watchArr: (() => void)[] = []

  const versionList = ref<any[]>([])
  const copllectColumns = [
    {
      field: 'name',
      title: '参数名',
      width: 140,
    },
    {
      field: 'value',
      title: '标准值',
      width: 130,
    },
    {
      field: 'lower',
      title: '下限',
      width: 130,
    },
    {
      field: 'upper',
      title: '上限',
      width: 130,
    },
  ]

  const paramsColumns = [
    {
      field: 'name',
      title: '参数名',
      width: 200,
    },
    {
      field: 'value',
      title: '设定值',
      width: 200,
    },
    {
      field: 'real',
      width: 160,
      title: '实时值',
    },
  ]

  const filterColumns = ref([
    {
      title: '版本',
      el: 'select',
      // 搜索时所用的字段
      prop: 'Version',
      options: [],
      placeholder: '请选择版本',
    },
  ])

  const params = reactive({
    Filter: '',
    Version: '',
  })

  const onNewVersion = () => {
    dialogConfig.versionVisible = true
  }

  const onUpdateFn = async () => {
    formulaParameterChecked.value.forEach((item) => {
      if (item.real && item.real != '-') item.value = item.real
    })
    await onValueChange()
    dialogConfig.updateVisible = false
  }

  const onCloseUpdateDialog = () => {
    dialogConfig.updateVisible = false
  }

  const onRealChange = () => {
    dialogConfig.updateVisible = true
  }

  const onSearch = (val: string) => {
    // params.Filter = val
    if (currentTab.value === 'process') {
      processParameterChecked.value =
        versionData.value.formulaVersion2ProcessParameters.filter((item: any) =>
          item.parameterName.includes(val)
        )
    } else {
      formulaParameterChecked.value =
        versionData.value.formulaVersion2FormulaParameters.filter((item: any) =>
          item.parameterName.includes(val)
        )
    }
  }

  const onChange = () => {
    params.Filter = ''
    onSearch('')
  }
  const onSelectParams = () => {
    dialogConfig.visible = true
  }

  const initVersionInfo = (version?: any) => {
    if (version) {
      versionData.value = version
    } else {
      versionData.value = versionList.value.find(
        (item: any) => item.id === params.Version
      )
    }

    processParameterChecked.value = [
      ...versionData.value.formulaVersion2ProcessParameters,
    ]
    formulaParameterChecked.value = [
      ...versionData.value.formulaVersion2FormulaParameters,
    ]
    watchArr.forEach((stop) => stop())
    watchArr = []
    formulaParameterChecked.value.forEach((item) => {
      if (item.formulaVersion2FormulaParameter2WorkStations?.length) {
        const parameter = item.formulaVersion2FormulaParameter2WorkStations[0]
        const pKey = parameter.watchVariable || parameter.deliverVariable
        item.real = getVariableValue(pKey)

        const stop = Variable.watchExp(pKey, (val: number) => {
          item.real = !isNil(val) ? val + '' : '-'
        })
        watchArr.push(stop)
      }
    })
  }

  const getParamsList = async () => {
    const res = await formula.getFormulaversion({
      FormulaIds: [currentWorkSection.value.formulaId],
      WorkSectionIds: [currentWorkSection.value.workSectionId],
      IncludeDetails: true,
      MaxResultCount: 999,
    })
    if (res.items.length) {
      filterColumns.value[0].options =
        res.items.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          }
        }) ?? []
      // 把版本列表存起来
      versionList.value = res.items ?? []
      const version = res.items.find((item: any) => item.isCurrentVersion)
      params.Version = version.id
      initVersionInfo()
    } else {
      versionData.value = null
      processParameterChecked.value = []
      formulaParameterChecked.value = []
    }
  }

  onUnmounted(() => {
    watchArr.forEach((stop) => stop())
  })

  watch(
    () => currentWorkSection.value,
    (val) => {
      getParamsList()
    }
  )

  const onValueChange = async () => {
    const formulaParameter = formulaParameterChecked.value.map(
      (item, index) => {
        return {
          workSectionId: currentWorkSection.value.workSectionId,
          parameterId: item.parameterId || item.key,
          value: item.value ? item.value + '' : '',
          sort: index,
        }
      }
    )
    const processParameter = processParameterChecked.value.map(
      (item, index) => {
        return {
          workSectionId: currentWorkSection.value.workSectionId,
          parameterId: item.parameterId || item.key,
          upper: item.upper ? item.upper + '' : '', // 需要转成字符串给后端，但不能传'undefined'，需要判断一下
          lower: item.lower ? item.lower + '' : '', //
          value: item.value ? item.value + '' : '',
          sort: index,
        }
      }
    )
    console.log(versionData.value.concurrencyStamp, 'save>>>>>>>>>')

    const params = {
      ...versionData.value,
      workSectionId: currentWorkSection.value.workSectionId,
      formulaVersion2FormulaParameters: formulaParameter,
      formulaVersion2ProcessParameters: processParameter,
    }
    return formula.saveVersion(versionData.value.id, {
      formulaId: currentFormula.value.id,
      ...params,
    })
  }

  const getVariableValue = (key: string) => {
    return Variable.store[key] ?? '-'
  }

  const onConfirm = async () => {
    // 选择完参数的时候需要更新一下versionData，获取实时值
    const res = await onValueChange()
    versionData.value = res
    initVersionInfo(res)
  }

  const onFilterChange = (data: any) => {
    params.Version = data.Version
    initVersionInfo()
  }

  const onVersionConfirm = async () => {
    dialogConfig.updateVisible = false
    //   const oldId = currentFormula.value?.id
    //   const data = await formula?.tableRef?.value?.getList()
    //   setTimeout(
    //     () => {
    //       currentFormula.value = data.find((item: any) => item.id === oldId)
    //       console.log(2)

    //       formula?.tableRef?.value?.setCurrentRow(oldId)
    //       console.log(currentFormula.value, data, 'currentFormula----===')
    //     },

    //     100
    //   )
  }

  return {
    onFilterChange,
    filterColumns,
    onConfirm,
    onRealChange,
    getVariableValue,
    onValueChange,
    onSelectParams,
    dialogConfig,
    onChange,
    onVersionConfirm,
    processParameterChecked,
    formulaParameterChecked,
    onSearch,
    params,
    copllectColumns,
    paramsColumns,
    tableRef,
    currentTab,
    onUpdateFn,
    onNewVersion,
    currentFormula,
    onCloseUpdateDialog,
  }
}
