import { ref, onMounted, reactive, computed, h } from 'vue'
import { ElMessage } from 'element-plus'
import sdk from 'sdk'
const { Variable } = sdk.models
import { setValue } from '../Models/Service/Service'

export const useBatchMaterialFeeding = (props: any, ctx?: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const tableRef = ref<any>(null)
  const dataSource = ref<any>([])
  const column = ref<any>([])
  const onClose = () => {
    visible.value = false
  }

  const onOpen = () => {
    materialInputsRef.value = {}
    column.value = [
      {
        title: '序号',
        type: 'seq',
        width: '60',
      },
      {
        title: '物料名称',
        field: 'name',
      },
      {
        title: '物料条码',
        field: 'barcodeVariable',
      },
      {
        title: '校验结果',
        field: 'verificationResultSignal',
      },
    ]

    if (props.dataSource?.length) {
      dataSource.value = props.dataSource.filter(
        (item: any) => item.materialType == '批次料'
      )
    }
  }
  const materialInputsRef = ref<any>({})

  const getVariableValue = (key: string) => {
    return Variable.store[key]
  }
  const rowStyle = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
    if (getVariableValue(row.verificationResultSignal) == 2) {
      return 'background: #f1a2ac'
    } else if (rowIndex == 1) {
      if (row.materialType == '唯一料') {
        return 'background: #fdebd4'
      } else {
        return 'background: #ceeefc'
      }
    }
  }
  const keydown = ($event: KeyboardEvent) => {
    if ($event.key === 'Enter' || $event.keyCode === 13) {
      $event.target?.blur()
    }
  }
  const setMaterialVal = (row: any, index: number) => {
    if (!row.code) return
    setValue({ [row.barcodeVariable]: String(row.code) }).then((res: any) => {
      if (res.allSuccess) {
        setValue({ [row.verificationSignal]: '1' }).then((res: any) => {
          if (res.allSuccess) {
            materialInputsRef.value[index + 1]?.focus()
          } else {
            ElMessage.error(res.items[row.barcodeVariable]?.errorMsg)
          }
        })
      } else {
        ElMessage.error(res.items[row.barcodeVariable]?.errorMsg)
      }
    })
  }
  return {
    tableRef,
    dataSource,
    column,
    visible,
    materialInputsRef,
    rowStyle,
    getVariableValue,
    onOpen,
    onClose,
    keydown,
    setMaterialVal,
  }
}
