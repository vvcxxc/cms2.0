import { SetupContext, ref, computed, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useGlobalState } from '@/libs/Store/Store'

export const useSpecialProcess = (
  props: any,
  { emit, expose }: SetupContext
) => {
  const { getProductList } = useGlobalState()
  /**
   * 批量配置弹窗
   */
  const dialogConfig = reactive({
    title: '',
    detailVisible: false,
    paramsVisible: false,
  })

  const curRow = ref()
  const isProcess = computed(() => props.type === 'Process')

  /**
   * 数据源
   */
  const dataSource = ref([])
  /***
   * tableRef
   */
  const tableRef = ref()
  /**
   * 流程名称
   */
  const search = ref('')

  /**
   * 批量配置
   */

  const onClickConfig = () => {
    if (!curRow.value) {
      ElMessage.warning('请选择一个工序进行操作!')
      return
    }
    dialogConfig.detailVisible = true
  }
  const onClickConfig2 = () => {
    if (!curRow.value) {
      ElMessage.warning('请选择一个工序进行操作!')
      return
    }
    dialogConfig.paramsVisible = true
  }

  /**
   * 搜索
   * @param val
   */
  const onSearch = () => {
    tableRef.value?.getList()
    nextTick(() => {
      tableRef.value?.setRow()
      curRow.value = null
    })
  }

  const onRowClick = ({ row }: any) => {
    curRow.value = row
  }

  const onConfirm = () => {
    onSearch()
  }
  const reloadList = () => {
    onSearch()
  }
  expose({
    reloadList,
  })

  const filterColums = reactive([
    {
      title: '所属产线段',
      el: 'select',
      // 搜索时所用的字段
      prop: 'ProductionLineSegmentId',
      options: getProductList,
      width: 150,
      placeholder: '请选择所属产线段',
    },
  ])

  return {
    onConfirm,
    isProcess,
    onRowClick,
    dataSource,
    tableRef,
    search,
    dialogConfig,
    onClickConfig,
    onClickConfig2,
    onSearch,
    curRow,
    filterColums,
  }
}
