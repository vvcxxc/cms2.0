import { ref, SetupContext, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useVModel, useVModels } from '@vueuse/core'
import dayjs from 'dayjs'
import {
  getProductlinesetting,
  putTargetproduction,
  putProcessingcycle,
} from '../Models/Service/Service'
import { _t } from '../app'

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
    onClose()
    // visible.value = false // 更新visible的值
    // selections.value = []
    // ctx.emit('confirm')
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
  const onOpenSetting = () => {
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
    onOpenSetting,
  }
}

/**
 * 工序选择弹窗
 *  */

export const useLineSetDialog = (props: any, ctx: SetupContext) => {
  const columns = ref<any[]>([])
  const dataSource = ref<any[]>([])
  const tableRef = ref()
  const dialogHook = useDialog(props, ctx)
  const { visible } = dialogHook
  const DayList = ['日', '一', '二', '三', '四', '五', '六']
  const dataObj = reactive({
    productionDate: dayjs().format('YYYY-MM-DD'),
    productionDateStr: `${dayjs().format('YYYY-MM-DD')} ${_t(
      '星期' + DayList[dayjs().day()]
    )}`,
    targetProduction: 0,
    processingCycles: [],
  })
  const onOpen = () => {
    if (props.date) {
      dataObj.productionDate = props.date
    }
    getProductlinesetting({
      segmentId: props.segmentId,
      date: dayjs(dataObj.productionDate).format('YYYY-MM-DD'),
    }).then((res: any) => {
      dataObj.productionDate = res.productionDate //应该和请求的日期是一样的
      dataObj.productionDateStr = `${res.productionDate} ${_t(
        '星期' + DayList[dayjs().day()]
      )}`
      dataObj.targetProduction = res.targetProduction
      dataSource.value = res.processingCycles || []

      columns.value = [
        {
          title: _t('工位名称'),
          field: 'workSectionName',
        },
        {
          field: 'theoreticalProcessingCycle',
          title: _t('理论加工周期'),
        },
      ]
      visible.value = true
    })
  }
  const saveProcessingcycle = () => {
    putProcessingcycle({
      productionDate: dataObj.productionDate,
      processingCycles: dataSource.value,
      segmentId: props.segmentId,
    }).then((res: any) => {
      ElMessage.success(_t('保存成功'))
    })
  }
  const saveTargetproduction = () => {
    putTargetproduction({
      productionDate: dataObj.productionDate,
      targetProduction: dataObj.targetProduction,
      segmentId: props.segmentId,
    }).then((res: any) => {
      ElMessage.success(_t('保存成功'))
    })
  }

  const onConfirm = async () => {
    visible.value = false
    ctx.emit('confirm')
  }
  const onClose = () => {
    visible.value = false
    ctx.emit('close')
  }

  return {
    ...dialogHook,
    tableRef,
    columns,
    dataSource,
    dataObj,
    onOpen,
    onClose,
    onConfirm,
    saveProcessingcycle,
    saveTargetproduction,
  }
}
