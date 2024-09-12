import { ref, Ref, onMounted, reactive, computed, inject, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { SpecialProcess } from '../Models/SpecialProcess'
import { SpecialStation } from '../Models/SpecialStation'
import { injectModel } from '@/libs/Provider/Provider'

import _get from 'lodash/get'
import _set from 'lodash/set'
import { indexOf } from 'lodash'

export const useLeakageDialog = (props: any, ctx?: any) => {
  const specialProcess = injectModel<SpecialProcess>('specialProcess')
  const specialStation = injectModel<SpecialStation>('specialStation')
  const dataObj = reactive({
    workSectionId: '',
    workStationId: '',
    ip: '',
    port: '',
  })
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    if (!dataObj.ip) {
      ElMessage.error(`请输入IP`)
      return
    }
    if (!dataObj.port) {
      ElMessage.error(`请输入端口号`)
      return
    }
    if (!/^[1-9][0-9]*$/.test(dataObj.port)) {
      ElMessage.error(`端口号请输入正整数`)
      return
    }
    await specialStation.putLeakagetester({
      workSectionId: props.row.workSectionId,
      workStationId: props.row.workStationId,
      leakageTesterIp: dataObj.ip,
      leakageTesterPort: Number(dataObj.port),
    })
    ElMessage.success('保存成功')
    ctx.emit('confirm')
    onClose()
  }
  const delSetting = async () => {
    ConfirmBox(
      `是否确认删除${props.row?.workSectionName}工序的试漏仪设备配置？`
    ).then(async () => {
      await specialStation.deleteLeakagetester(props.row.workStationId)
      ElMessage.success('删除成功')
      ctx.emit('confirm')
      onClose()
    })
  }
  const onOpen = async () => {
    let station = props.row || {}
    dataObj.ip = station.detail?.leakageTesterIp
    dataObj.port = station.detail?.leakageTesterPort
  }
  return {
    visible,

    dataObj,
    onOpen,
    onClose,
    onConfirm,
    delSetting,
  }
}
