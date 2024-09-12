import { ref, SetupContext, Ref, nextTick, computed } from 'vue'
import { useVModel, useVModels } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'

// 弹窗基本数据
export const useDialog = (props: any, ctx: SetupContext) => {
  /**
   * 显示隐藏
   */
  const visible =
    props.visible !== null ? useVModel(props, 'visible', ctx.emit) : ref(false)

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
 * 工序
 * @param props
 * @param ctx
 * @returns
 */
export const useWorkSection = (props: any, ctx: SetupContext) => {
  const dialogHook = useDialog(props, ctx)
  const tableRef = ref()

  const dataSource = ref([])
  const { visible, modelValue, selections, search, onCheck } = dialogHook
  // 确认时，更新数据
  const onConfirm = () => {
    modelValue.value = cloneDeep(selections.value)
    ctx.emit('confirm', modelValue.value)
    visible.value = false
  }

  const onShowDialog = () => {
    if (!props.productId) {
      ElMessage.warning('请选择点检型号')
      return
    }
    visible.value = true
    setTimeout(() => {
      if (modelValue.value && modelValue.value.length) {
        onCheck(modelValue.value)
        let ids = modelValue.value.map((item: any) => item.workStationId)
        tableRef.value?.setSelectRow(ids)
      }
    })
  }

  const onSearch = () => {
    tableRef.value?.getList({
      filter: search.value,
    })
  }

  return {
    ...dialogHook,
    tableRef,
    dataSource,
    onSearch,
    onConfirm,
    onShowDialog,
  }
}
