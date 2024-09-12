import { ref, Ref, onMounted, reactive, computed, inject, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { SpecialProcess } from '../Models/SpecialProcess'
import { SpecialStation } from '../Models/SpecialStation'
import { injectModel } from '@/libs/Provider/Provider'

import _get from 'lodash/get'
import _set from 'lodash/set'

export const useProcessSettingDialog = (props: any, ctx?: any) => {
  const specialProcess = injectModel<SpecialProcess>('specialProcess')

  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const dataObj = reactive({
    curLeftIdx: 0,
  })
  const tableRef1 = ref()
  const tableRef2 = ref()
  const dataSource1 = ref<any[]>([])
  const dataSource2 = computed(
    () =>
      dataSource1.value[dataObj.curLeftIdx]
        ?.workSection2FormulaDetailParameters || []
  )
  const columns1 = [
    {
      title: '配方编号',
      field: 'formulaCode',
    },
    {
      title: '配方名称',
      field: 'formulaName',
    },
    {
      title: '产品型号',
      field: 'productModel',
    },
  ]

  const columns2 = [
    {
      title: '参数名',
      field: 'name',
    },
    {
      title: '设定值',
      field: 'setValue',
    },
  ]
  const onCheckLeft = (record: any) => {
    console.log('record', record)
    dataObj.curLeftIdx = record.rowIndex
  }

  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    const workSection2FormulaDetailParameters = dataSource1.value.reduce(
      (obj: any, item: any) => {
        item.workSection2FormulaDetailParameters.forEach((element: any) => {
          obj.push(element)
        })
        return obj
      },
      []
    )
    await specialProcess.updateByFormula({
      workSectionId: props.row.workSectionId,
      workSection2FormulaDetailParameters,
    })
    ElMessage.success('保存成功')
    ctx.emit('confirm')
    onClose()
  }
  const delSetting = async () => {
    ConfirmBox(
      `是否确认删除${props.row?.workSectionName}工序的配方值配置？`
    ).then(async () => {
      await specialProcess.deleteSectionSpecialParams(props.row.workSectionId)
      ElMessage.success('删除成功')
      ctx.emit('confirm')
      onClose()
    })
  }
  const onOpen = async () => {
    specialProcess
      .getWorkSectionSpecial(props.row.workSectionId)
      .then((res: any) => {
        dataSource1.value = res.workSection2Formulas
      })
  }
  return {
    visible,

    tableRef1,
    tableRef2,
    dataSource1,
    dataSource2,
    columns1,
    columns2,
    dataObj,
    onOpen,
    onClose,
    onConfirm,
    onCheckLeft,
    delSetting,
  }
}
