import { injectModel } from '@/libs/Provider/Provider'
import { Material } from '../Models/Material'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { downloadFile } from '@/utils'
import { createInjector } from '../store/MaterialStore'

export const useMaterial = (props: any, ctx?: any) => {
  const material = injectModel<Material>('material')
  const { curRowData } = createInjector()
  const dataSource = ref([])
  const checkedList = ref<any[]>([])
  const tableRef = ref()
  const searchInner = ref('')

  const dialogConfig = reactive({
    visible: false,
    title: '',
    rowData: null as Object | null,
  })

  const settingDialogConfig = reactive({
    visible: false,
  })
  const onLoadSettings = () => {
    settingDialogConfig.visible = true
  }

  const onCheck = (records: any) => {
    console.log('onCheck', records)
    checkedList.value = records
  }

  const onAddMaterial = () => {
    dialogConfig.rowData = null
    dialogConfig.title = '新建物料'
    dialogConfig.visible = true
  }

  const onEditMaterial = () => {
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
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onImport = async (file: { file: File }) => {
    let formData = new FormData()
    formData.append('file', file.file)
    await material.importMaterial(formData)
    ElMessage.success('操作成功')
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onExport = async () => {
    const res = await material.exportMaterial()
    downloadFile(res, '物料管理.xlsx')
    ElMessage.success('操作成功')
  }

  const onDelete = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择物料进行删除!')
      return
    }
    ConfirmBox('物料删除后，相关生产数据无法恢复，是否确认删除？').then(
      async () => {
        const ids = checkedList.value.map((item) => item.id)
        await material.deleteMaterial(ids)
        ElMessage.success('删除成功')
        tableRef.value?.getList()
        tableRef.value?.clearSelectEvent()
      }
    )
  }
  const onRowClick = (rowData: any) => {
    console.log(rowData.row, '--')
    curRowData.value = rowData.row
  }
  const onSearch = () => {
    console.log(tableRef.value)
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  return {
    onRowClick,
    onSearch,
    searchInner,
    tableRef,
    onImport,
    onExport,
    onDelete,
    onConfirm,
    dataSource,
    onCheck,
    onAddMaterial,
    dialogConfig,
    settingDialogConfig,
    onEditMaterial,
    onLoadSettings,
  }
}
