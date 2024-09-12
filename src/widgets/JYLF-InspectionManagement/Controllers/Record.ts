import { SetupContext, ref, onMounted, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getProductList } from '../Models/Service/Service'
export const useRecord = (props: any, { emit, expose }: SetupContext) => {
  const dataSource = ref<Record<string, any>[]>([])
  /***
   * tableRef
   */
  const tableRef = ref()
  const RecordColumns = ref([
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'name',
      title: '任务名称',
    },
    {
      field: 'productModel',
      title: '点检型号',
      el: 'select',
      prop: 'ProductModel',
      options: [],
      placeholder: '请选择点检型号',
    },
    {
      field: 'workStationsDesc',
      title: '点检工位',
    },
    {
      field: 'checkModesDesc',
      title: '测试方式',
    },
    {
      field: 'detail',
      width: 100,
      title: '点检详情',
    },

    {
      field: 'remark',
      title: '备注说明',
    },
    {
      field: 'startTime',
      title: '开始时间',
    },
    {
      field: 'endTime',
      title: '结束时间',
    },
    {
      field: 'operator',
      title: '操作人',
    },
  ])
  const searchData = reactive({
    startTime: dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    keyword: '',
  })
  const dataObj: any = reactive({
    viewRow: null,
    viewDialogShow: false,
  })

  const onSearch = async () => {
    tableRef.value?.getList()
  }

  const openViewDetailDialog = (row: any) => {
    dataObj.viewRow = row
    dataObj.viewDialogShow = true
  }

  onMounted(() => {
    searchData.startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    searchData.endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    getProductList({
      SkipCount: 0,
      MaxResultCount: 999,
    }).then((res: any) => {
      let data = res.items.map((item: any) => {
        return { label: item.model, value: item.model }
      })
      RecordColumns.value[2].options = data
    })
  })

  const reloadList = () => {
    onSearch()
  }
  expose({
    reloadList,
  })

  return {
    searchData,
    dataObj,
    dataSource,
    tableRef,
    RecordColumns,
    onSearch,
    openViewDetailDialog,
  }
}
