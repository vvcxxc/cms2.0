import { injectModel } from '@/libs/Provider/Provider'
import { downloadFile } from '@/utils'
import { ref, onMounted, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useGlobalState } from '@/libs/Store/Store'
import { Log } from '../Models/Log'
import dayjs from 'dayjs'
export const useLog = (props: any, ctx?: any) => {
  const formulalog = injectModel<Log>('log')
  const { workSectionList } = useGlobalState()

  const { state }: Record<string, any> = workSectionList
  const dataSource = ref([])
  const tableRef = ref()

  const filterForm = reactive({
    To: dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    From: dayjs()
      .subtract(30, 'day')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'),
    FormulaName: '',
    WorkSectionName: '',
  })
  const dialogConfig = reactive({
    visible: false,
    title: '',
  })

  const columns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'formulaName',
      title: '配方名称',
    },
    {
      field: 'formulaCode',
      title: '配方编号',
    },
    {
      field: 'formulaVersion',
      title: '配方版本',
    },
    {
      field: 'workSectionName',
      title: '工序名称',
    },
    {
      field: 'workStationName',
      title: '工位名称',
    },

    {
      field: 'recordTime',
      title: '记录时间',
      sortable: true,
      sortKey: 'OrderByRecordTimeAsc',
    },
    {
      field: 'paramName',
      title: '参数名称',
    },
    {
      field: 'remark',
      title: '更新内容',
    },
  ]

  const filterColumns = ref([
    {
      prop: 'FormulaName',
      options: []  as any,
      title: '配方名称',
      el: 'select',
      placeholder: '请选择配方名称',
    },
    {
      prop: 'WorkSectionName',
      options: [] as any,
      title: '工序名称',
      el: 'select',
      placeholder: '请选择工序名称',
    },
  ])

  const getFormulaList = async () => {
    const res = await formulalog.getFormulaList(filterForm)

    filterColumns.value[0].options =
      res.items?.map((item: any) => {
        return {
          label: item.name,
          value: item.name,
        }
      }) ?? []
      filterColumns.value[0].options.unshift({
        label: '全部',
        value: '',
      })
  }

  watch(
    () => state.value,
    (val) => {
      filterColumns.value[1].options = val?.map((item: any) => {
        return {
          label: item.label,
          value: item.label,
        }
      })
      filterColumns.value[1].options.unshift({
        label: '全部',
        value: '',
      })
    },
    {
      immediate: true,
    }
  )

  onMounted(() => {
    getFormulaList()
  })

  const onExport = async () => {
    const res = await formulalog.exportLog(filterForm)
    downloadFile(res, '配方日志.xlsx')
    ElMessage.success('操作成功')
  }

  const onChangeTime = (time: { From: string; To: string }) => {
    console.log(time)
    filterForm.From = time.From ?? ''
    filterForm.To = time.To ?? ''
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onSort = (arg: any) => {
    console.log(arg)
  }

  return {
    onSort,
    onChangeTime,
    filterColumns,
    filterForm,
    onExport,
    columns,
    tableRef,
    dataSource,
    dialogConfig,
  }
}
