import { injectModel } from '@/libs/Provider/Provider'
import { BillofMaterial } from '../Models/BillofMaterial'
import { ref, onMounted, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { downloadFile } from '@/utils'
import { createInjector } from '../store/BillofStore'
import { useGlobalState } from '@/libs/Store/Store'
export const BOMDetails = (props: any, ctx?: any) => {
  const { getMaterialTypeList, getWorkSectionList } = useGlobalState()
  const billofMaterial = injectModel<BillofMaterial>('billofMaterial')
  const { curRowData } = createInjector()
  const dataSource = ref([])
  const checkedList = ref<any[]>([])
  const tableRef = ref()
  const innerValue = ref('')
  const total = ref(0)
  const params = reactive({
    Filter: '',
    processidfilter: '',
    materialType:''
  })
  const columns = [
    {
      field: 'order',
      width: 60,
      title: '序号',
    },
    {
      field: 'processName',
      title: '工序',
    },
    {
      field: 'materialCode',
      title: '物料编号',
    },
    {
      field: 'materialName',
      title: '物料名称',
    },
    {
      field: 'materialType',
      title: '物料类型',
    },
    {
      field: 'materialUnit',
      title: '单位',
    },
    {
      field: 'dosage',
      title: '用量',
    },
  ]

  const filterColumns = ref([
    {
      prop: 'processidfilter',
      options: getWorkSectionList,
      title: '工序',
      el: 'select',
      placeholder: '请选择工序',
    },
    {
      prop: 'materialType',
      options: getMaterialTypeList,
      title: '物料类型',
      el: 'select',
      placeholder: '请选择物料类型',
    },
  ])




  const dialogConfig = reactive({
    visible: false,
    title: '',
    rowData: null as Object | null,
  })

  const onCheck = (records: any) => {
    console.log('onCheck', records)
    checkedList.value = records
  }

  const onAdd = () => {
    if (!curRowData.value) {
      ElMessage.warning('请选择产品进行添加')
      return
    }
    dialogConfig.rowData = null
    dialogConfig.title = '新建物料'
    dialogConfig.visible = true
  }

  const onEdit = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个物料进行编辑!')
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning('仅支持编辑单个物料!')
      return
    }
    console.log(checkedList.value[0])

    dialogConfig.rowData = checkedList.value[0]
    dialogConfig.title = '编辑物料'
    dialogConfig.visible = true
  }

  const onConfirm = () => {
    getDataList()
    tableRef.value?.clearSelectEvent()
  }

  const onDelete = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择物料进行删除!')
      return
    }
    ConfirmBox('物料删除后，相关生产数据无法恢复，是否确认删除？').then(
      async () => {
        const ids = checkedList.value.map((item) => item.id)
        await billofMaterial.deleteBillofMaterial(
          curRowData.value.productId,
          ids
        )
        ElMessage.success('删除成功')
        getDataList()
        tableRef.value?.clearSelectEvent()
      }
    )
  }

  const getDataList = async () => {
    const res = await billofMaterial.getBillofMaterial(
      curRowData.value.productId,
      params
    )
    dataSource.value = res
  }

  watch(
    () => curRowData.value,
    (val) => {
      if (val) {
        params.Filter = ''
        getDataList()
        tableRef.value?.clearSelectEvent()
      }
    }
  )

  const onSearch = (val: string) => {
    params.Filter = val
    getDataList()
  }

  const onFilterChange = (val: any) => {
    params.processidfilter = val.processidfilter ?? ''
    params.materialType = val.materialType ?? ''
    getDataList()
  }

  return {
    onFilterChange,
    filterColumns,
    curRowData,
    onSearch,
    params,
    columns,
    onDelete,
    onConfirm,
    dataSource,
    onCheck,
    onAdd,
    dialogConfig,
    onEdit,
    tableRef,
    innerValue,
  }
}
