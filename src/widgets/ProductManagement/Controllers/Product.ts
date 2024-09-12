import { Product } from '../Models/Product'
import { ref, onMounted, reactive, computed } from 'vue'
import { ProductType } from '../type/Product'
import { ElMessage } from 'element-plus'
import { downloadFile } from '@/utils'
import { injectModel, injectModels } from '@/libs/Provider/Provider'
import { useGlobalState } from '@/libs/Store/Store'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { _t } from '../app'

// @injectModel()
export const useProduct = (props: any, ctx?: any) => {
  const { systemConfig } = useGlobalState()

  const sopEnabled = computed(() => {
    //@ts-ignore
    return systemConfig.state.value.Sop_Enabled == 1
  })
  const product = injectModel<Product>('product')
  const checkedList = ref<ProductType[]>([])
  const dataSource = ref<any[]>([])
  const tableRef = ref()

  // const searchForm = reactive({
  //   name: '',
  //   desc:''
  // })

  const searchInner = ref('')

  const dialogConfig = reactive({
    visible: false,
    title: '',
    sopVisible: false,
    rowData: null as ProductType | null,
  })

  const settingDialogConfig = reactive({
    visible: false,
  })

  const onCheck = (records: ProductType[]) => {
    checkedList.value = records
  }

  const onAddProduct = () => {
    dialogConfig.rowData = null
    dialogConfig.title = _t('新建产品')

    dialogConfig.visible = true
  }

  const onEditProduct = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning(_t('请选择一个产品进行编辑'))
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning(_t('仅支持编辑单个产品'))
      return
    }

    const res = await product.getUseStatus(checkedList.value[0].id)

    if (res) {
      ElMessage.warning(_t('产品正在生产中，不允许编辑!'))
      return
    }

    dialogConfig.rowData = checkedList.value[0]

    dialogConfig.title = _t('编辑产品')
    dialogConfig.visible = true
  }

  const onHeaderFieldSettings = () => {
    settingDialogConfig.visible = true
  }
  const openSopDialog = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning(_t('请选择一个产品进行操作!'))
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning(_t('仅支持对一个产品型号进行操作!'))
      return
    }

    const res = await product.getUseStatus(checkedList.value[0].id)

    if (res) {
      ElMessage.warning(_t('该产品型号正在生产中，不可操作！'))
      return
    }

    dialogConfig.rowData = checkedList.value[0]

    // todo 需要校验是否在生产中，生产中不可操作

    dialogConfig.sopVisible = true
  }

  const onConfirm = () => {
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onImport = async (file: { file: File }) => {
    let formData = new FormData()
    formData.append('file', file.file)
    await product.importProduct(formData)
    ElMessage.success(_t('操作成功'))
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onExport = async () => {
    const res = await product.exportProduct(searchInner.value)
    downloadFile(res, `${_t('产品管理')}.xlsx`)
    ElMessage.success(_t('操作成功'))
  }

  const onSearch = () => {
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  const onDelete = () => {
    if (!checkedList.value.length) {
      ElMessage.warning(_t('请选择产品进行删除!'))
      return
    }
    ConfirmBox(
      _t('产品删除后，相关生产数据无法恢复，是否确认删除？'),
      _t('确认')
    ).then(async () => {
      const ids = checkedList.value.map((item) => item.id)
      await product.deleteProduct(ids)
      ElMessage.success(_t('删除成功'))
      tableRef.value?.getList()
      tableRef.value?.clearSelectEvent()
    })
  }

  return {
    dataSource,
    sopEnabled,
    onDelete,
    onSearch,
    onExport,
    onImport,
    tableRef,
    onConfirm,
    product,
    openSopDialog,
    searchInner,
    onCheck,
    onAddProduct,
    dialogConfig,
    settingDialogConfig,
    onEditProduct,
    onHeaderFieldSettings,
  }
}
