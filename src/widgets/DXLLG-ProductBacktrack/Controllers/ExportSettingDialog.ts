import { ref, Ref, onMounted, reactive, computed, inject, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { ProductBacktrack } from '../Models/ProductBacktrack'
import { injectModel } from '@/libs/Provider/Provider'
import dayjs from 'dayjs'
import _get from 'lodash/get'
import _set from 'lodash/set'
import { downloadFile } from '@/utils'

export const useExportSettingPop = (props: any, ctx?: any) => {
  const productBacktrack = injectModel<ProductBacktrack>('ProductBacktrack')
  const tableRef1 = ref()

  const tableRef2 = ref()
  const dataList1 = ref<any[]>([])
  const dataList2 = computed(() => {
    return dataObj.curRow1?.productTraceProcessParameters || []
  })

  const dataObj: any = reactive({
    paramsType: '采集参数',
    reportTitle: '',
    reportNum: '',
    reportRemark: '',
    curRow1: null,
  })
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const columns1 = [
    {
      title: '产线段名称',
      field: 'segmentName',
    },
    {
      title: '工序编号',
      field: 'workSectionCode',
    },
    {
      title: '工序名称',
      field: 'workSectionName',
    },
  ]
  const columns2 = [
    {
      title: '参数名称',
      field: 'name',
    },
    {
      title: '标准值',
      field: 'targetValue',
    },
    {
      title: '下限',
      field: 'lower',
    },
    {
      title: '上限',
      field: 'upper',
    },
    {
      title: '检验结果',
      field: 'value',
    },
    {
      title: '单项判定',
      field: 'result',
      width: 120,
    },
  ]

  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    let data: any = {
      title: dataObj.reportTitle,
      number: dataObj.reportNum,
      description: dataObj.reportRemark,
      productName:
        props.traceData.productTraceDetails[
          props.traceData.productTraceDetails.length - 1
        ].productName,
      serialNumber:
        props.traceData.productTraceDetails[
          props.traceData.productTraceDetails.length - 1
        ]?.serialNumber,
      checkDate: `${props.traceData.productTraceDetails[0].entryTime}至${
        props.traceData.productTraceDetails[
          props.traceData.productTraceDetails.length - 1
        ]?.recordTime
      }`,
      param: {},
    }

    dataList1.value.forEach((item: any) => {
      data.param[item.workSectionId] = item.productTraceProcessParameters
        .filter((i: any) => i.isChecked)
        .map((i: any, sort: number) => ({
          ...i,
          isQualified: i.result === 'OK' ? true : false,
          upper: i.upper === '0' ? 0 : Number(i.upper) || null,
          lower: i.lower === '0' ? 0 : Number(i.lower) || null,
          sort,
        }))
    })

    const res = await productBacktrack.exportinspectionreport(data)
    downloadFile(
      res,
      `校验报告导出配置_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    )
    ElMessage.success('导出成功')
    ctx.emit('confirm')
    onClose()
  }

  const onOpen = async () => {
    console.log('onOpen')
    const title = await productBacktrack.getField(
      'SCMS.AppSettings.DxlSetting.InspectionReportTitle'
    )
    dataObj.reportTitle =
      (title.settings.length && title.settings[0]?.value) || ''
    const code = await productBacktrack.getField(
      'SCMS.AppSettings.DxlSetting.InspectionReportNumber'
    )
    dataObj.reportNum = (code.settings.length && code.settings[0]?.value) || ''
    const report = await productBacktrack.getField(
      'SCMS.AppSettings.DxlSetting.InspectionReportContent'
    )
    dataObj.reportRemark =
      (report.settings.length && report.settings[0]?.value) || ''

    let list = props.traceData.productTraceDetails.map((item: any) => ({
      ...item,
      selections: [
        item.productTraceProcessParameters.map((item2: any) => item2.uuid),
      ],
      productTraceProcessParameters: item.productTraceProcessParameters.map(
        (item2: any) => {
          return {
            ...item2,
            isChecked: true,
            isQualified:
              isNaN(item2.value) ||
              (Number(item2.upper) >= Number(item2.value) &&
                Number(item2.value) >= Number(item2.lower))
                ? true //字符串默认合格
                : false,
          }
        }
      ),
    }))
    tableRef2.value?.setSelectRow(
      list[0].productTraceProcessParameters.map((item: any) => item.uuid),
      true
    ) //先setSelectRow再赋值，不然勾选不渲染
    dataList1.value = list
    dataObj.curRow1 = dataList1.value[0]
  }
  /**
   * 选择回调
   * 切换表格数据要先setSelectRow再赋值，
   * setSelectRow触发oncheck才能拿到正确的selection
   * 先赋值直接触发了oncheck就会收到空数组导致匹配不上，勾选会被清空，
   */
  const onParamsCheck = (selection: any[]) => {
    dataList2.value.forEach((item: any) => {
      if (selection.find((i) => i.uuid === item.uuid)) {
        item.isChecked = true
      } else {
        item.isChecked = false
      }
    })
  }
  /**
   * 点击左侧
   */
  const onRowClick1 = (data: any) => {
    const list = data.row.productTraceProcessParameters
      .filter((item: any) => item.isChecked)
      .map((item: any) => item.uuid)
    tableRef2.value?.setSelectRow(list, true) //先setSelectRow再赋值，不然勾选不渲染
    dataObj.curRow1 = data.row
  }

  return {
    visible,
    dataList1,
    dataList2,
    tableRef1,
    tableRef2,
    columns1,
    columns2,
    dataObj,
    onOpen,
    onClose,
    onConfirm,
    onRowClick1,
    onParamsCheck,
  }
}
