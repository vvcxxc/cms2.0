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

export const useLaserDialog = (props: any, ctx?: any) => {
  const specialStation = injectModel<SpecialStation>('specialStation')
  const tableRef = ref()
  const dataSource = ref<any[]>([])
  const columns = [
    {
      title: '产品名称',
      field: 'productName',
    },
    {
      title: '产品型号',
      field: 'productModel',
    },
    {
      title: '含流水号规则使用模板',
      field: 'haveSerialTemplate',
    },
    {
      title: '不含流水号规则使用模板',
      field: 'noSerialTemplate',
    },
  ]
  const dataObj: any = reactive({
    laserCodingMode: 0,
    laserCodingIp: '',
    laserCodingPort: 0,
    // laserCodingAlias: '',
    laserCodingSignal: '',
    laserCodingGenerateCodeVariable: '',
    laserCodingResultVariable: '',
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
    if (!dataObj.laserCodingIp) {
      ElMessage.error(`请输入IP地址`)
      return
    }
    if (!dataObj.laserCodingPort) {
      ElMessage.error(`请输入端口号`)
      return
    }

    // if (!dataObj.laserCodingAlias) {
    //   ElMessage.error(`请输入打码别名`)
    //   return
    // }
    if (!dataObj.laserCodingSignal) {
      ElMessage.error(`请选择激光打码信号变量`)
      return
    }
    if (!dataObj.laserCodingGenerateCodeVariable) {
      ElMessage.error(`请选择生成打码内容变量`)
      return
    }
    if (!dataObj.laserCodingResultVariable) {
      ElMessage.error(`请选择激光打码结果变量`)
      return
    }
    if (!/^[1-9][0-9]*$/.test(dataObj.laserCodingPort)) {
      ElMessage.error(`端口号请输入正整数`)
      return
    }
    if (dataSource.value.some((item) => !item.haveSerialTemplate)) {
      ElMessage.error(`含流水号规则使用模板不能为空`)
      return
    }
    if (dataSource.value.some((item) => !item.noSerialTemplate)) {
      ElMessage.error(`不含流水号规则使用模板不能为空`)
      return
    }
    await specialStation.putLasercoding({
      workSectionId: props.row.workSectionId,
      workStationId: props.row.workStationId,
      laserCodingMode: dataObj.laserCodingMode,
      laserCodingIp: dataObj.laserCodingIp,
      laserCodingPort: Number(dataObj.laserCodingPort),
      // laserCodingAlias: dataObj.laserCodingAlias,
      laserCodingSignal: dataObj.laserCodingSignal,
      laserCodingGenerateCodeVariable: dataObj.laserCodingGenerateCodeVariable,
      laserCodingResultVariable: dataObj.laserCodingResultVariable,
      laserCodingTemplate: dataSource.value,
    })
    ElMessage.success('保存成功')
    ctx.emit('confirm')
    onClose()
  }
  const delSetting = async () => {
    ConfirmBox(
      `是否确认删除${props.row?.workSectionName}工序的激光打码配置？`
    ).then(async () => {
      await specialStation.deleteLasercoding(props.row.workStationId)
      ElMessage.success('删除成功')
      ctx.emit('confirm')
      onClose()
    })
  }
  const onOpen = async () => {
    let station = props.row || {}
    dataObj.laserCodingMode = station.detail?.laserCodingMode
    dataObj.laserCodingIp = station.detail?.laserCodingIp
    dataObj.laserCodingPort = station.detail?.laserCodingPort
    // dataObj.laserCodingAlias = station.detail?.laserCodingAlias
    dataObj.laserCodingSignal = station.detail?.laserCodingSignal
    dataObj.laserCodingGenerateCodeVariable =
      station.detail?.laserCodingGenerateCodeVariable
    dataObj.laserCodingResultVariable =
      station.detail?.laserCodingResultVariable
    dataSource.value = station.detail?.laserCodingTemplate || []
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
    delSetting,
    selectVariable,
  }
}
