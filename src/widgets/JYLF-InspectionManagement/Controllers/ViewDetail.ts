import { ref, reactive, computed } from 'vue'
import { getSpotcheckDetail, setValue } from '../Models/Service/Service'
import { ElMessage } from 'element-plus'
import sdk from 'sdk'
const { Variable } = sdk.models
export const useViewDetail = (props: any, ctx?: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const tableRef = ref()
  const dataObj = reactive({
    name: '',
    productModel: '',
    workStationsDesc: '',
    checkModesDesc: '',
    remark: '',
    concurrencyStamp: '',
  })
  const dataSource = ref<any[]>([])
  const getVariableValue = (key: string) => {
    return Variable.store[key]
  }
  const sendPass = (row: any) => {
    if (row.status != 0 || getVariableValue(row.blockTag) == 1) {
      return
    }
    setValue({ [row.blockTag]: '1' }).then((res: any) => {
      if (res.allSuccess) {
        ElMessage.success('下发成功')
      } else {
        ElMessage.error(res.items[row.blockTag]?.errorMsg)
      }
    })
  }
  const onClose = async () => {
    visible.value = false
    ctx.emit('close')
  }

  const onConfirm = async () => {
    visible.value = false
    ctx.emit('confirm')
  }

  /**
   * 打开工位并获取详情
   * @returns
   */
  const ViewDetailColumns = ref<any[]>([])
  const onOpen = async () => {
    console.log(props.title)
    if (props.title == '点检任务') {
      ViewDetailColumns.value = [
        {
          field: 'workSectionName',
          title: '工序名称',
        },
        {
          field: 'workStationName',
          title: '工位名称',
        },
        {
          field: 'status',
          title: '点检状态',
        },
        {
          field: 'action',
          title: '操作',
        },
      ]
      /**这接口只支持点检任务，不支持点检记录 */
      getSpotcheckDetail({
        id: props.row.id,
      }).then((res: any) => {
        dataObj.name = res.name
        dataObj.productModel = res.productModel
        dataObj.workStationsDesc = res.workStationsDesc
        dataObj.checkModesDesc = res.checkModesDesc
        dataObj.remark = res.remark

        dataObj.concurrencyStamp = res.concurrencyStamp
        dataSource.value = res.spotCheckDetails
      })
    } else {
      ViewDetailColumns.value = [
        {
          field: 'workSectionName',
          title: '工序名称',
        },
        {
          field: 'workStationName',
          title: '工位名称',
        },
        {
          field: 'status',
          title: '点检状态',
        },
      ]

      dataObj.name = props.row.name
      dataObj.productModel = props.row.productModel
      dataObj.workStationsDesc = props.row.workStationsDesc
      dataObj.checkModesDesc = props.row.checkModesDesc
      dataObj.remark = props.row.remark

      dataObj.concurrencyStamp = props.row.concurrencyStamp
      dataSource.value = props.row.spotCheckDetailRecords
    }
  }

  return {
    visible,
    tableRef,
    dataObj,
    dataSource,
    ViewDetailColumns,
    onClose,
    onConfirm,
    onOpen,
    getVariableValue,
    sendPass,
  }
}
