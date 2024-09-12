import { SetupContext, ref, computed, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { SpecialStation } from '../Models/SpecialStation'
import { injectModel } from '@/libs/Provider/Provider'
import { useGlobalState } from '@/libs/Store/Store'

export const useSpecialStation = (
  props: any,
  { emit, expose }: SetupContext
) => {
  const specialStation = injectModel<SpecialStation>('specialStation')
  const { getWorkSectionList } = useGlobalState()

  /**
   * 批量配置弹窗
   */
  const dialogConfig: any = reactive({
    LeakageVisible: false,
    PrintVisible: false,
    LaserVisible: false,
  })

  const curRow = ref()
  const curSectionData = ref<any>(null)

  /**
   * 数据源
   */
  const dataSource = ref([])
  /***
   * tableRef
   */
  const tableRef = ref()

  const onClickDetailConfig = (type: string) => {
    // if (!curRow.value) {
    //   ElMessage.warning('请选择一个工位进行操作!')
    //   return
    // }

    dialogConfig[type] = true
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

  const getProcessData = async () => {
    const res = await specialStation.getSectionSpecial(
      curRow.value.workStationId
    )
    curSectionData.value = {
      ...curRow.value,
      detail: res || {},
    }
  }

  const onRowClick = ({ row }: any) => {
    curRow.value = row
    getProcessData()
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
      field: 'WorkSectionIds',
      title: '所属工序',
      width: 200,
      el: 'select',
      // 搜索时所用的字段
      prop: 'WorkSectionIds',
      options: getWorkSectionList,
      placeholder: '请选择所属工序',
    },
  ])

  return {
    onConfirm,
    curSectionData,
    onRowClick,
    dataSource,
    tableRef,
    dialogConfig,
    onSearch,
    onClickDetailConfig,
    curRow,
    filterColums,
  }
}
