import { ref, onMounted, reactive, computed, h } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getSampleDataDetail,
  exportSampleDataDetail,
} from '../Models/Service/Service'
import { useFile } from './File'
const { exportFile } = useFile()

export const useSampleDataDetails = (props: any, ctx?: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const tableRef = ref<any>(null)
  const sampleNum = ref<number>(0)
  const dataSource = ref<any>([])
  const column = ref<any>([])
  const onClose = () => {
    visible.value = false
  }

  const onOpen = () => {
    column.value = [
      {
        title: '记录时间',
        field: 'recordTime',
        width: 180,
      },
      {
        title: '产品型号',
        field: 'productModelName',
      },
      {
        title: '产品条码',
        field: 'productBarCodeName',
      },
      {
        title: props.checkItemConfigName,
        field: 'sampleValue',
      },
      {
        title: '子组',
        field: 'subGroupNumber',
        width: 80,
      },
    ]

    getSampleDataDetail({
      checkItemConfigId: props.checkItemConfigId,
      runModes: props.runModes,
    }).then((res: any) => {
      dataSource.value = res.datas || []
      sampleNum.value = res.count
    })
  }
  const onExport = async () => {
    exportFile(
      '/api/v1/spcrunanalysis/sample-data-detail/export',
      { checkItemConfigId: props.checkItemConfigId, runModes: props.runModes },
      '样本数据详情',
      'csv'
    )
  }

  return {
    tableRef,
    dataSource,
    column,
    visible,
    sampleNum,
    onOpen,
    onClose,
    onExport,
  }
}
