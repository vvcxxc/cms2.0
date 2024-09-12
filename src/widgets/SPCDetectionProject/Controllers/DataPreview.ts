import { ref, onMounted, reactive, computed, h } from 'vue'
import { ElMessage } from 'element-plus'
import { getOriginal } from '../Models/Service/Service'
export const useDataPreview = (props: any, ctx?: any) => {
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
  const getData = () => {
    getOriginal({
      dataSetId: props.rowData?.dataTableId,
      limit: filter.value,
    }).then((res: any) => {
      if (res.length) {
        column.value = Object.keys(res[0])
          .filter((item) => item.indexOf('_') !== 0)
          .map((item) => {
            return { title: item, field: item }
          })
        dataSource.value = res
      } else {
        column.value = []
        dataSource.value = []
      }
    })
  }
  const onOpen = () => {
    column.value = []
    dataSource.value = []
    filter.value = 10
    getData()
  }

  const onConfirm = async () => {}

  const tableRef = ref<any>(null)
  const dataSource = ref<any>([])
  const filter = ref<number>(10)
  const column = ref<any>([])
  const curRowData = ref<any>({})
  const onRowClick = (data: any) => {
    curRowData.value = data.row
  }
  return {
    tableRef,
    dataSource,
    column,
    visible,
    filter,
    onRowClick,
    onOpen,
    onClose,
    onConfirm,
    getData,
  }
}
