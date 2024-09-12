import { ref, Ref, onMounted, reactive, computed, inject, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { SpecialProcess } from '../Models/SpecialProcess'
import { SpecialStation } from '../Models/SpecialStation'
import { injectModel } from '@/libs/Provider/Provider'
import sdk from 'sdk'
const { openVariableDialog } = sdk.utils
import _get from 'lodash/get'
import _set from 'lodash/set'
import { indexOf } from 'lodash'

export const usePrintDialog = (props: any, ctx?: any) => {
  const specialProcess = injectModel<SpecialProcess>('specialProcess')
  const specialStation = injectModel<SpecialStation>('specialStation')
  const tableRef = ref()
  const dataSource = ref([])
  const columns = [
    {
      title: '字段名称',
      field: 'fieldName',
    },
    {
      title: '别名',
      field: 'aliasName',
    },
  ]
  const dataObj: any = reactive({
    printIp: '',
    printName: '',
    printTemplate: '',
    printSignal: '',
    printGenerateCodeVariable: '',
    printResultVariable: '',
    printDeviceCode: '',
    printNumSignal: '',
  })
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const selectVariable = async (type: string) => {
    const data = await openVariableDialog({
      isMultiple: false,
    })
    dataObj[type] = data.name
  }
  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    if (!dataObj.printIp) {
      ElMessage.warning('请输入打印机IP')
      return
    }
    if (!dataObj.printName) {
      ElMessage.warning('请输入打印机名称')
      return
    }
    if (!dataObj.printTemplate) {
      ElMessage.warning('请输入标签模板')
      return
    }
    if (!dataObj.printSignal) {
      ElMessage.warning('请选择标签打印信号变量')
      return
    }
    if (!dataObj.printGenerateCodeVariable) {
      ElMessage.warning('请选择生成条码变量')
      return
    }

    if (!dataObj.printResultVariable) {
      ElMessage.warning('请选择标签打印结果变量')
      return
    }
    if (!dataObj.printDeviceCode) {
      ElMessage.warning('请输入设备编号')
      return
    }
    if (!dataObj.printNumSignal) {
      ElMessage.warning('请选择产品数量信号变量')
      return
    }

    if (dataSource.value.some((e: any) => !e.aliasName)) {
      ElMessage.warning('字段别名不能为空')
      return
    }

    await specialStation.putPrint({
      workSectionId: props.row.workSectionId,
      workStationId: props.row.workStationId,
      printIp: dataObj.printIp,
      printName: dataObj.printName,
      printTemplate: dataObj.printTemplate,
      printSignal: dataObj.printSignal,
      printGenerateCodeVariable: dataObj.printGenerateCodeVariable,
      printResultVariable: dataObj.printResultVariable,
      printDeviceCode: dataObj.printDeviceCode,
      printNumSignal: dataObj.printNumSignal,
      printFieldAlias: dataSource.value,
    })
    ElMessage.success('保存成功')
    ctx.emit('confirm')
    onClose()
  }
  const delSetting = async () => {
    ConfirmBox(
      `是否确认删除${props.row?.workSectionName}工序的标签打印配置？`
    ).then(async () => {
      await specialStation.deletePrint(props.row.workStationId)
      ElMessage.success('删除成功')
      ctx.emit('confirm')
      onClose()
    })
  }
  const onOpen = async () => {
    let station = props.row || {}
    dataObj.printIp = station.detail?.printIp
    dataObj.printName = station.detail?.printName
    dataObj.printTemplate = station.detail?.printTemplate
    dataObj.printSignal = station.detail?.printSignal
    dataObj.printGenerateCodeVariable =
      station.detail?.printGenerateCodeVariable
    dataObj.printResultVariable = station.detail?.printResultVariable
    dataObj.printDeviceCode = station.detail?.printDeviceCode
    dataObj.printNumSignal = station.detail?.printNumSignal
    dataSource.value = station.detail?.printFieldAlias || []
  }
  return {
    visible,
    tableRef,
    columns,
    dataSource,
    dataObj,
    onOpen,
    onClose,
    onConfirm,
    selectVariable,
    delSetting,
  }
}
