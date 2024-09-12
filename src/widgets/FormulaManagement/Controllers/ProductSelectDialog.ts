import { ref, onMounted, reactive, computed, watch } from 'vue'

export const useProductSelectDialog = (props: any, ctx: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const dataSource = ref<any[]>([])

  const innerValue = ref('')

  const tableRef = ref()

  const checkedList = ref<any[]>([])

  const columns = [
    {
      title: '序号',
      type: 'seq',
      width: '60',
    },
    {
      field: 'name',
      title: '产品名称',
    },
    {
      field: 'identificationCode',
      title: '产品识别码',
    },
    {
      field: 'model',
      title: '产品型号',
    },
    {
      field: 'remark',
      title: '备注',
    },
  ]

  const onClose = () => {
    visible.value = false
  }

  const onConfirm = async () => {
    ctx.emit('confirm', checkedList.value)
  }

  const onSearch = () => {
    console.log('onSearch')
    tableRef.value?.getList()
  }

  const onCheck = (list: any) => {
    console.log(list)
    checkedList.value = list
  }

  const selections = computed(() => {
    return props.data?.map((item: any) => item.productId) ?? []
  })

  const onOpen = () => {
    console.log(dataSource.value, selections, props.data)
  }

  return {
    selections,
    onOpen,
    columns,
    onCheck,
    dataSource,
    tableRef,
    onSearch,
    innerValue,
    visible,
    onClose,
    onConfirm,
  }
}
