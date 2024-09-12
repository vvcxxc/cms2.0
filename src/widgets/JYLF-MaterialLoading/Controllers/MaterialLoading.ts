import { ref, reactive, onMounted } from 'vue'
import sdk from 'sdk'
const { models } = sdk
const { Variable } = models
import { ElMessage } from 'element-plus'
import { getMaterial, setvalues } from '../Models/Service/Service'
type materials = {
  code?: string
  materialName: string
  workStationName: string
  materialType: number
  verificationSignal: string
  bindMaterialVariable: string
  barcodeVariable: string
  verificationResultSignal: string
}

export const useMaterialLoading = () => {
  const tableRef = ref()
  const dataSource = ref<materials[]>([])
  const materialInputsRef = ref<any>({})

  /**参数 */
  const dataObj = reactive({
    productModel: '',
  })

  const materialTypeMap: any = {
    0: '批次料',
    1: '唯一料',
  }
  const columns = [
    {
      field: 'materialName',
      title: '物料名称',
    },
    {
      field: 'workStationName',
      title: '上料工位',
    },
    {
      field: 'materialType',
      title: '物料类型',
    },
    {
      field: 'bindMaterialVariable',
      title: '当前使用',
    },
    {
      field: 'barcodeVariable',
      title: '扫码上料',
    },

    {
      field: 'verificationResultSignal',
      title: '上料结果',
    },
  ]
  const getVariableValue = (key: string) => {
    return Variable.store[key]
  }
  /**下发 */
  const sendCode = ($event: any, row: materials, index: number) => {
    let code = $event.keyCode || $event.which || $event.charCode
    if (code == 13) {
      setvalues({
        [row.barcodeVariable]: row.code,
      }).then((res: any) => {
        if (res.allSuccess) {
          setvalues({
            [row.verificationSignal]: '1',
          }).then((res: any) => {
            if (res.allSuccess) {
              ElMessage.success('下发成功！')
              materialInputsRef.value[index + 1]?.focus()
            } else {
              ElMessage.error('下发检测信号失败！')
            }
          })
        } else {
          ElMessage.error('下发物料条码失败！')
        }
      })
    }
  }
  const getStationkanbanFn = () => {
    materialInputsRef.value = {}
    getMaterial().then((res: any) => {
      dataObj.productModel = res.productModel
      const details = res.details || []
      dataSource.value = details.map((item: any) => ({
        ...item,
        code: '',
      }))
      clearInfo() //刷新页面默认清空物料条码变量和物料校验结果
      setTimeout(() => {
        materialInputsRef.value[0]?.focus()
      })
    })
  }

  const clearInfo = () => {
    let _data: any = {}
    dataSource.value.forEach((item: any) => {
      item.code = ''
      _data[item.barcodeVariable] = ''
      _data[item.verificationResultSignal] = '0'
    })
    setvalues(_data).then((res: any) => {
      if (!res.allSuccess) {
        let msg = res.items
          .filter((item: any) => item.errorMsg)
          .map((item: any) => item.errorMsg)
          .join(';')
        ElMessage.error(msg)
      }
    })
  }

  onMounted(() => {
    getStationkanbanFn()
  })

  return {
    materialInputsRef,
    tableRef,
    dataObj,
    materialTypeMap,
    columns,
    dataSource,
    sendCode,
    clearInfo,
    getVariableValue,
  }
}
