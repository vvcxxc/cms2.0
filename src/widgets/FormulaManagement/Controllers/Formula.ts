import { downloadFile } from '@/utils'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { Formula } from '../Models/Formula'
import { injectModel } from '@/libs/Provider/Provider'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { createInjector } from '../store/ManagementStore'
// import { useGlobalState } from '@/libs/Store/Store'
export const useFormula = (props: any, ctx: any) => {
  // const { ProductModelList } = useGlobalState()
  const { currentFormula } = createInjector()
  const formula = injectModel<Formula>('formula')
  const dataSource = ref<any>([])
  const innerValue = ref('')
  const tableRef = formula.tableRef
  const checkedList = ref<any[]>([])
  const dialogConfig = reactive({
    rowData: null as any,
    visibleFormulaForm: false,
    formulaFormTitle: '新建配方',
    isCopy: false,
    visibleVersionManagement: false,
  })

  const params = reactive({
    Filter: '',
    IncludeDetails: true,
  })

  const columns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'code',
      title: '配方编号',
    },
    {
      field: 'name',
      title: '配方名称',
      width: 150,
    },
    {
      field: 'productModels',
      title: '产品型号',
      width: 150,
    },
    {
      field: 'formula2WorkSections',
      title: '工艺路线',
      width: 100,
    },
    {
      field: 'currentVersion',
      title: '当前版本',
      width: 80,
    },
    {
      field: 'isAppliedTxt',
      title: '状态',
      width: 80,
    },
    {
      field: 'remark',
      title: '备注',
      width: 50,
    },
  ]

  const filterColumns = ref([
    {
      prop: 'IsApplied',
      options: [
        {
          label: '全部',
          value: '',
        },
        {
          label: '使用中',
          value: true,
        },
        {
          label: '未使用',
          value: false,
        },
      ],
      title: '状态',
      el: 'select',
      placeholder: '请选择状态',
    },
    {
      prop: 'ProductIds',
      options: [] as any,
      title: '产品型号',
      el: 'select',
      placeholder: '请选择产品型号',
    },
  ])

  const getProductList = async () => {
    const res = await formula.getProductList({
      MaxResultCount: 999,
    })
    filterColumns.value[1].options = res.items?.map((item: any) => {
      return {
        label: item.model,
        value: item.id,
      }
    })
    filterColumns.value[1].options.unshift({
      label: '全部',
      value: '',
    })
    console.log(res)
  }

  const addFormula = () => {
    dialogConfig.rowData = null
    dialogConfig.formulaFormTitle = '新建配方'
    dialogConfig.isCopy = false
    dialogConfig.visibleFormulaForm = true
  }

  const onEditFormula = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个配方进行编辑!')
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning('仅支持编辑单个配方!')
      return
    }

    const ids = checkedList.value.map((item) => item.id)

    const res = await formula.candeleteFormula(ids)
    if (res.isUsed) {
      ElMessage.warning('当前配方正在生产中，不允许编辑')
      return
    }
    console.log(checkedList.value[0])

    dialogConfig.rowData = checkedList.value[0]
    dialogConfig.isCopy = false
    dialogConfig.formulaFormTitle = '编辑配方'
    dialogConfig.visibleFormulaForm = true
  }

  const onConfirm = () => {
    console.log('onConfirm')
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onImport = async (file: { file: File }) => {
    let formData = new FormData()
    formData.append('file', file.file)
    await formula.importFormula(formData)
    ElMessage.success('操作成功')
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onExport = async () => {
    const res = await formula.exportFormula()
    downloadFile(res, '配方管理.xlsx')
    ElMessage.success('操作成功')
  }

  const onCheck = (records: any) => {
    console.log('onCheck', records)
    checkedList.value = records
  }

  const onSearch = (val: string) => {
    params.Filter = val
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onDelete = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择配方进行删除!')
      return
    }
    const ids = checkedList.value.map((item) => item.id)

    const res = await formula.candeleteFormula(ids)

    if (res.isUsed) {
      ElMessage.warning('生产中的配方不支持删除！')
      return
    }

    ConfirmBox('配方删除后，相关生产数据无法恢复，是否确认删除？').then(
      async () => {
        const ids = checkedList.value.map((item) => item.id)
        await formula.deleteFormula(ids)
        ElMessage.success('删除成功')
        tableRef.value?.getList()
        tableRef.value?.clearSelectEvent()
      }
    )
  }

  const onCopy = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个配方进行创建副本!')
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning('只能选择一个配方创建副本!')
      return
    }

    dialogConfig.rowData = checkedList.value[0]
    dialogConfig.isCopy = true
    dialogConfig.formulaFormTitle = '创建副本'
    dialogConfig.visibleFormulaForm = true
  }

  const onVersion = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个配方进行版本管理!')
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning('仅支持单个配方进行版本管理!')
      return
    }

    dialogConfig.rowData = checkedList.value[0]
    dialogConfig.formulaFormTitle = dialogConfig.rowData?.name + '-配方版本管理'
    dialogConfig.visibleVersionManagement = true
  }

  const onConfirmVersin = () => {
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onRowClick = (rowData: any) => {
    currentFormula.value = rowData.row
  }

  onMounted(() => {
    getProductList()
  })

  return {
    filterColumns,
    onRowClick,
    innerValue,
    onConfirmVersin,
    dataSource,
    onCopy,
    onVersion,
    onEditFormula,
    onDelete,
    onCheck,
    onImport,
    onExport,
    params,
    onSearch,
    onConfirm,
    dialogConfig,
    addFormula,
    tableRef,
    columns,
  }
}
