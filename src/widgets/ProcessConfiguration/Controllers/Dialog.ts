import { ref, SetupContext, Ref, nextTick } from 'vue'
import { useVModel, useVModels } from '@vueuse/core'
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
    ctx.emit('close')
  }
  /**
   * 确认
   */
  const onConfirm = () => {
    visible.value = false // 更新visible的值
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
                name: row.materialName,
              },
            }
            if (row.type) {
              record.type = row.type
            }
            // 数据没刷新
            if (dataSource.value[index + i]) {
              const data = dataSource.value.pop()
              const v = Object.assign(data, record)
              nextTick(() => {
                dataSource.value.splice(index + i, 0, v)
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
  const { visible, modelValue } = dialogHook
  const current = ref({})
  const onRowClick = ({ row }: any) => {
    // 取code
    current.value = {
      name: row.name,
      value: row.id,
      description: row.description,
    }
  }

  // 确认时，更新数据
  const onConfirm = () => {
    visible.value = false
    modelValue.value = current.value
    ctx.emit('confirm', current.value)
  }

  return {
    ...dialogHook,
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
          modelValue.value.map((item: any) => item.id)
        )
      }
    })
  }

  return {
    ...dialogHook,
    tableRef,
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
    modelValue.value = {
      ...current.value,
    }
    visible.value = false
    ctx.emit('confirm', current.value)
  }

  const onShowDialog = () => {
    visible.value = true
    nextTick(() => {
      if (tableRef.value && modelValue.value?.length) {
        tableRef.value?.setSelectRow(
          modelValue.value.map((item: any) => item.id)
        )
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
