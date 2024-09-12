import { ref, SetupContext, Ref, nextTick, computed } from 'vue'
import { useVModel, useVModels } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { relationCodeColumns, checkCodeColumns } from '../enum'
// 弹窗基本数据
export const useDialog = (props: any, ctx: SetupContext) => {
  /**
   * 显示隐藏
   */
  const visible =
    props.visible !== null ? useVModel(props, 'visible', ctx.emit) : ref(false)
  /**
   * 基础数据
   */
  const data = ref([])
  /**
   * 搜索值
   */
  const search = ref('')
  /**
   * 选择的值
   */
  const selections = ref<any[]>([])
  // 传递进来的数据
  const { modelValue } = useVModels(props, ctx.emit)
  /**
   * 关闭
   */
  const onClose = () => {
    visible.value = false // 更新visible的值
    selections.value = []
    ctx.emit('close')
  }
  /**
   * 确认
   */
  const onConfirm = () => {
    visible.value = false // 更新visible的值
    selections.value = []
    ctx.emit('confirm')
  }
  /**
   * 选择
   * @param records
   */
  const onCheck = (records: Array<Record<string, any>>) => {
    selections.value = records
  }

  const onChange = (val: any) => {}
  /**
   * 选择
   */
  const onSelect = () => {
    visible.value = true
  }

  return {
    visible,
    data,
    modelValue,
    selections,
    search,
    onConfirm,
    onClose,
    onCheck,
    onChange,
    onSelect,
  }
}

/**
 * 关联物料弹窗
 *  */
export const useRelationMaterial = (props: any, ctx: SetupContext) => {
  const dialogHook = useDialog(props, ctx)
  const tableRef = ref()
  const { visible, selections } = dialogHook
  const { dataSource } = useVModels(props, ctx.emit)

  /**
   * 点击确定的时候，需要将选择的数据塞到dataSource中
   */
  const updateDataSource = () => {
    return new Promise((r, j) => {
      try {
        if (Array.isArray(selections.value) && selections.value.length > 0) {
          const index = props.index
          selections.value.forEach((row, i: number) => {
            const record = {
              name: row.name,
              materialTypeDisplay: row.materialTypeDisplay,
              type: {
                value: row.materialType,
                description: row.materialTypeDisplay,
                name: row.materialName || row.name,
              },
            }
            if (row.type) {
              record.type = row.type
            }
            const currentIndex = index + i
            if (dataSource.value[currentIndex]) {
              const row = dataSource.value[currentIndex]
              dataSource.value[currentIndex] = {}
              nextTick(() => {
                dataSource.value[currentIndex] = Object.assign({}, row, record)
                r(record)
              })
            } else {
              dataSource.value.push(record)
              r(record)
            }
          })
        }
      } catch (error) {
        j(error)
      }
    })
  }
  // 确认时，更新数据
  const onConfirm = async () => {
    visible.value = false
    // 更新选中的数据
    await updateDataSource()
    ctx.emit('confirm', selections.value)
  }

  return {
    ...dialogHook,
    tableRef,
    onConfirm,
  }
}
/**
 * 关联生成码
 * @param props
 * @param ctx
 * @returns
 */
export const useRelationGenerate = (props: any, ctx: SetupContext) => {
  const dialogHook = useDialog(props, ctx)

  const { visible, modelValue, search } = dialogHook
  const current = ref<Record<string, any>>({})
  const tableRef = ref()
  const objectName = ref(modelValue.value.objectName)
  const onRowClick = ({ row }: any) => {
    // 取code
    current.value = {
      name: objectName.value || row.name,
      value: row.id,
      description: row.name,
      objectName,
      row,
    }
  }

  // 确认时，更新数据
  const onConfirm = () => {
    visible.value = false
    modelValue.value = { ...current.value }
    ctx.emit('confirm', current.value)
  }

  const onSearch = () => {
    tableRef.value?.getList({
      filter: search.value,
    })
  }

  const url = computed(() => {
    return props.ruleType === 'barcodegeneration'
      ? '/api/v1/messuite/query/barcodegeneration'
      : '/api/v1/messuite/query/barcodeverification'
  })

  const columns = computed(() => {
    return props.ruleType === 'barcodegeneration'
      ? relationCodeColumns
      : checkCodeColumns
  })

  return {
    columns,
    url,
    ...dialogHook,
    tableRef,
    onSearch,
    onRowClick,
    onConfirm,
  }
}

/**
 * 关联流程
 * @param props
 * @param ctx
 * @returns
 */
export const useRelationFlow = (props: any, ctx: SetupContext) => {
  const dialogHook = useDialog(props, ctx)
  const tableRef = ref()
  const { visible, modelValue, selections } = dialogHook
  const isDisabled = ref(false)
  const checkFlow = (records: Record<string, any>[]) => {
    const flows: number[] = []
    records.forEach((item) => {
      flows.push(item.businessType.value)
    })
    // 进出站交互限制
    // flows中不能重复，有1的情况下，不能有2和3，有2和3的情况下，不能有1,2和3不能重复
    const temp = flows.filter((v) => v == 0)
    const other = flows.filter((v) => v != 0)
    const l = new Set(other).size + temp.length
    if (flows.length !== l) {
      return false
    }
    if (flows.includes(1)) {
      if (flows.includes(2) || flows.includes(3)) {
        return false
      }
      return true
    }
    if (flows.includes(2) || flows.includes(3)) {
      if (flows.includes(1)) {
        return false
      }
      return true
    }
    return true
  }
  /**
   * 选择
   * @param records
   */
  const onCheck = (records: Array<Record<string, any>>) => {
    selections.value = records
    if (!checkFlow(records)) {
      isDisabled.value = true
      ElMessage.error('进站、出站的交互类型只能选择一个，请检查！')
    } else {
      isDisabled.value = false
    }
  }
  // 确认时，更新数据
  const onConfirm = () => {
    modelValue.value = selections.value.map((item) => {
      return {
        ...item,
        description: item.name,
      }
    })
    visible.value = false
  }

  const onShowDialog = () => {
    visible.value = true
    nextTick(() => {
      if (tableRef.value && modelValue.value?.length) {
        tableRef.value?.setSelectRow(
          modelValue.value.map((item: any) => item.type)
        )
      }
    })
  }

  return {
    ...dialogHook,
    tableRef,
    isDisabled,
    onCheck,
    onConfirm,
    onShowDialog,
  }
}

/**
 * 工序
 * @param props
 * @param ctx
 * @returns
 */
export const useWorkSection = (props: any, ctx: SetupContext) => {
  const dialogHook = useDialog(props, ctx)
  const tableRef = ref()
  const current = ref({})
  const { visible, modelValue, selections, search } = dialogHook

  // 确认时，更新数据
  const onConfirm = () => {
    if (!props.isChecked) {
      modelValue.value = {
        ...current.value,
      }
      ctx.emit('confirm', current.value)
    } else {
      ctx.emit('confirm', selections.value)
    }
    visible.value = false
  }

  const onShowDialog = () => {
    visible.value = true
    nextTick(() => {
      if (tableRef.value && modelValue.value?.length) {
        tableRef.value?.setSelectRow(
          modelValue.value.map((item: any) => item.id)
        )
      } else {
        tableRef.value?.setCurrentRow(modelValue.value.id)
      }
    })
  }

  const onSearch = () => {
    tableRef.value?.getList({
      filter: search.value,
    })
  }

  const onRowClick = ({ row }: any) => {
    // 取code
    current.value = {
      name: row.name,
      id: row.id,
      code: row.code,
      flowDefinitions: row.flowDefinitions,
    }
  }

  return {
    ...dialogHook,
    tableRef,
    current,
    onSearch,
    onRowClick,
    onConfirm,
    onShowDialog,
  }
}
