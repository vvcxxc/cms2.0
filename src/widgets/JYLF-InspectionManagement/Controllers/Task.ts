import { SetupContext, ref, onMounted, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import sdk from 'sdk'
const { models, userInfo } = sdk
import {
  getProductList,
  deleteSpotcheck,
  sortSpotcheck,
  startSpotcheck,
} from '../Models/Service/Service'
export const useTask = (props: any, { emit, expose }: SetupContext) => {
  const dataSource = ref<Record<string, any>[]>([{ aa: 1 }])
  /***
   * tableRef
   */
  const tableRef = ref()
  const search = ref('')
  const TaskColumns = ref([
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
      field: 'status',
      title: '任务状态',
    },
    {
      field: 'remark',
      title: '备注说明',
    },
  ])

  const dataObj: any = reactive({
    editDialogShow: false,
    editTitle: '',
    viewRow: null,
    viewDialogShow: false,
    variableDialogShow: false,
  })

  const checkedList = ref<any[]>([])
  const onCheck = (records: any[]) => {
    checkedList.value = records
  }
  const onSearch = async () => {
    tableRef.value?.getList({
      Filter: search.value,
    })
  }

  const openEditDialog = (type: string) => {
    if (type != '新增任务') {
      if (!checkedList.value.length) {
        ElMessage.warning('请选择一个任务进行编辑!')
        return
      }

      if (checkedList.value.length > 1) {
        ElMessage.warning('仅支持编辑单个任务!')
        return
      }
    }

    dataObj.editTitle = type
    dataObj.editDialogShow = true
  }

  const onDelete = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择任务进行删除!')
      return
    }
    ConfirmBox('是否确认删除选中任务？').then(() => {
      deleteSpotcheck(checkedList.value.map((item) => item.id)).then(() => {
        ElMessage.success('删除成功')
        onSearch()
      })
    })
  }

  const onStart = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个任务进行开始!')
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning('仅支持开始单个任务!')
      return
    }
    ConfirmBox('是否确认开始选中任务？').then(() => {
      startSpotcheck({
        id: checkedList.value[0].id,
        operatorname: (userInfo.user as any)?.name || '',
      }).then(() => {
        ElMessage.success('开始成功')
        onSearch()
      })
    })
  }
  const onSort = (idx: number, oldIdx: number, item: any) => {
    sortSpotcheck({
      sort: idx + 1,
      id: item.id,
    }).then(() => {
      ElMessage.success('排序成功')
      onSearch()
    })
  }

  const openViewDetailDialog = (row: any) => {
    dataObj.viewRow = row
    dataObj.viewDialogShow = true
  }

  const openVariableDialog = () => {
    dataObj.variableDialogShow = true
  }

  onMounted(() => {
    getProductList({
      SkipCount: 0,
      MaxResultCount: 999,
    }).then((res: any) => {
      let data = res.items.map((item: any) => {
        return { label: item.model, value: item.model }
      })
      TaskColumns.value[2].options = data
    })
  })
  const reloadList = () => {
    onSearch()
  }
  expose({
    reloadList,
  })
  return {
    TaskColumns,
    dataSource,
    tableRef,
    search,
    checkedList,
    dataObj,
    onCheck,
    onSearch,
    onSort,
    onStart,
    onDelete,
    openEditDialog,
    openViewDetailDialog,
    openVariableDialog,
  }
}
