import { ref, reactive, computed } from 'vue'
import sdk from 'sdk'
const { openVariableDialog } = sdk.utils
import { ElMessage } from 'element-plus'

import { getVariableconfig, putVariableconfig } from '../Models/Service/Service'
import { cloneDeep } from 'lodash'
export const useVariableDialog = (props: any, ctx?: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const tableRef = ref()
  const dataObj: any = reactive({
    spotCheckTag: '',
    checkModesTag: '',
    checkResultTag: '',
  })
  const dataSource = ref<any[]>([])
  const onClose = async (done: () => void) => {
    visible.value = false
    ctx.emit('close')
  }

  const onConfirm = async () => {
    putVariableconfig({
      spotCheckTag: dataObj.spotCheckTag,
      checkModesTag: dataObj.checkModesTag,
      checkResultTag: dataObj.checkResultTag,
      details: dataSource.value,
    }).then((res: any) => {
      ElMessage.success('保存成功')
      visible.value = false
      ctx.emit('confirm')
    })
  }

  /**
   * 打开工位并获取详情
   * @returns
   */
  const onOpen = async () => {
    getVariableconfig().then((res: any) => {
      dataSource.value = res.details
      dataObj.spotCheckTag = res.spotCheckTag
      dataObj.checkModesTag = res.checkModesTag
      dataObj.checkResultTag = res.checkResultTag
    })
  }

  const selectVariable = async (type: string) => {
    const data = await openVariableDialog({
      isMultiple: false,
    })
    dataObj[type] = data.name
  }
  const selectTableVariable = async (type: string, row: any) => {
    const data = await openVariableDialog({
      isMultiple: false,
    })

    row[type] = data.name
  }

  return {
    visible,
    tableRef,
    dataObj,
    dataSource,
    onClose,
    onConfirm,
    onOpen,
    selectVariable,
    selectTableVariable,
  }
}
