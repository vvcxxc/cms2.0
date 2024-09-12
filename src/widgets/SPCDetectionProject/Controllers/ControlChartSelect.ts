import { ref, onMounted, reactive, computed, h } from 'vue'
import { ElMessage } from 'element-plus'

export const useControlChartSelect = (props: any, ctx?: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const tableRef = ref<any>(null)
  const dataSource = ref<any[]>([])
  const column = [
    {
      title: '数据性质',
      field: 'name',
    },
    {
      title: '控制图类型',
      field: 'type',
    },
    {
      title: '控制图描述',
      field: 'desc',
    },
    {
      title: '适合子组大小',
      field: 'size',
    },
    {
      title: '建议样本数量',
      field: 'num',
      width: '380',
    },
  ]
  const curRowData = ref<any>({})
  const onRowClick = (data: any) => {
    curRowData.value = data.row
  }

  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    ctx.emit('confirm', curRowData.value.id)
    onClose()
  }
  const originList = [
    {
      name: '计量型',
      type: 'I-MR',
      desc: '单值移动极差图',
      size: '1',
      num: '至少收集 100 个检测值。',
      id: 1,
    },
    {
      name: '计量型',
      type: 'Xbar-R',
      desc: '均值极差图',
      size: '2~9',
      num: '如果子组大小小于或等于 2，则至少收集 100 个检测值。如果子组大小为 3，则至少收集 80 个检测值。如果子组大小为 4 或 5，则至少收集 70 个检测值。如果子组大小为 6 或更大，则至少收集 60 个检测值。',
      id: 2,
    },
    {
      name: '计量型',
      type: 'Xbar-S',
      desc: '均值标准差图',
      size: '10~25',
      num: '至少收集60个检测值。',
      id: 3,
    },
    {
      name: '计数型',
      type: 'P',
      desc: '用于可变样本量的不合格率',
      id: 4,
    },
    {
      name: '计数型',
      type: 'NP',
      desc: '用于固定样本量的不合格数',
      id: 5,
    },
    {
      name: '计数型',
      type: 'U',
      desc: '用于可变样本量的单位缺陷数',
      id: 6,
    },
    {
      name: '计数型',
      type: 'C',
      desc: '用于固定样本量的缺陷数',
      id: 7,
    },
  ]
  const onOpen = () => {
    let _list = originList.filter((item) => {
      return props.controlChartSelectType == item.name
    })
    dataSource.value = _list
    curRowData.value = dataSource.value[0]
    tableRef.value.setCurrentRow(dataSource.value[0])
  }
  return {
    tableRef,
    dataSource,
    column,
    visible,
    onRowClick,
    onOpen,
    onClose,
    onConfirm,
  }
}
