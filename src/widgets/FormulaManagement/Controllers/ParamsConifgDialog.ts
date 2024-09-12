import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, computed, watch, nextTick } from 'vue'
import { Formula } from '../Models/Formula'
import { injectModel } from '@/libs/Provider/Provider'
import { createInjector } from '../store/ManagementStore'

export const useParamsConifgDialog = (props: any, ctx: any) => {
  const formula = injectModel<Formula>('formula')
  const {
    currentWorkSection,
    processParameterChecked,
    formulaParameterChecked,
  } = createInjector()
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const innerValue = ref('')
  const currentTab = ref('process')
  const formulaTableRef = ref()
  const processTableRef = ref()
  const processParameters = ref<any[]>([])
  const formulaParameters = ref<any[]>([])
  const processParametersSource = ref<any[]>([])
  const formulaParametersSource = ref<any[]>([])

  const processChecked = ref<any>([])
  const formulaChecked = ref<any>([])

  const processColumns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'name',
      title: '参数名',
    },
    {
      field: 'description',
      title: '参数描述',
    },
  ]

  const formulaColumns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'name',
      title: '参数名',
    },
    {
      field: 'description',
      title: '参数描述',
    },
  ]

  let initFormulaIds: string[] = []
  let initProcessIds: string[] = []

  const arraysAreEqual = (array1: string[], array2: string[]) => {
    if (array1.length !== array2.length) {
      return false
    }

    var sortedArray1 = array1.slice().sort()
    var sortedArray2 = array2.slice().sort()

    for (var i = 0; i < sortedArray1.length; i++) {
      if (sortedArray1[i] !== sortedArray2[i]) {
        return false
      }
    }

    return true
  }

  const onClose = (isClose: boolean) => {
    console.log('onClose')

    const newFormulaIds = formulaChecked.value.map((item: any) => item.key)
    const newProcessIds = processChecked.value.map((item: any) => item.key)

    if (
      arraysAreEqual(initFormulaIds, newFormulaIds) &&
      arraysAreEqual(initProcessIds, newProcessIds)
    ) {
      visible.value = false
      return
    }

    if (!isClose) return

    ConfirmBox('存在未保存数据，是否需要保存')
      .then(async () => {
        onConfirm()
      })
      .catch(() => {
        visible.value = false
      })
  }

  const onConfirm = async () => {
    console.log(processChecked.value, formulaChecked.value, '-----confirm')

    // 需要保留原来的选项，不能直接替换
    const processList = processChecked.value.map((item: any) => {
      return (
        processParameterChecked.value.find(
          (it) => it.parameterId === item.key
        ) || item
      )
    })

    // 需要保留原来的选项，不能直接替换
    const formulaList = formulaChecked.value.map((item: any) => {
      return (
        formulaParameterChecked.value.find(
          (it) => it.parameterId === item.key
        ) || item
      )
    })

    processParameterChecked.value = processList
    formulaParameterChecked.value = formulaList
    ctx.emit('confirm')
    visible.value = false
  }

  const onSearch = (val: string) => {
    const filterFn = (item: any) => {
      return item.name.includes(val) || item.description?.includes(val)
    }

    if (currentTab.value === 'process') {
      processParameters.value = processParametersSource.value.filter(filterFn)
    } else {
      formulaParameters.value = formulaParametersSource.value.filter(filterFn)
    }
  }

  const onProcessCheck = (list: any) => {
    processChecked.value = list
  }

  const onFormulaCheck = (list: any) => {
    formulaChecked.value = list
  }

  const onChange = () => {
    innerValue.value = ''
    resetSource()
  }

  const resetSource = () => {
    processParameters.value = [...processParametersSource.value]
    formulaParameters.value = [...formulaParametersSource.value]
  }

  const getWorksectionInfo = async (worksectionId: string) => {
    const res = await formula.getWorksectionInfo(worksectionId, true)

    processParametersSource.value = res.processParameters
    formulaParametersSource.value = res.formulaParameters
    resetSource()

    initFormulaIds = formulaParameterChecked.value.map((item) => {
      return item.parameterId
    })

    initProcessIds = processParameterChecked.value.map((item) => {
      return item.parameterId
    })

    formulaTableRef.value?.setSelectRow(initFormulaIds)
    processTableRef.value?.setSelectRow(initProcessIds)
  }

  // 上一次打开的id
  let preOpenId = ''
  const onOpen = () => {
    // 如果打开的窗口和上次的一样，不需要重新初始化表格
    // if (!preOpenId || preOpenId !== currentWorkSection.value.workSectionId){
    getWorksectionInfo(currentWorkSection.value.workSectionId)
    preOpenId = currentWorkSection.value.workSectionId
    // }
  }

  return {
    onOpen,
    processColumns,
    formulaColumns,
    onProcessCheck,
    onFormulaCheck,
    formulaTableRef,
    processTableRef,
    onSearch,
    innerValue,
    visible,
    onClose,
    onConfirm,
    currentTab,
    onChange,
    processParameters,
    formulaParameters,
  }
}
