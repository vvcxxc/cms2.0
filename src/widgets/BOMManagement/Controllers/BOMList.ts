import { injectModel } from '@/libs/Provider/Provider'
import { BillofMaterial } from '../Models/BillofMaterial'
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

import { downloadFile } from '@/utils'
import { createInjector } from '../store/BillofStore'

export const BOMList = (props: any, ctx?: any) => {
  const billofMaterial = injectModel<BillofMaterial>('billofMaterial')
  const { curRowData } = createInjector()
  const dataSource = ref([])
  const tableRef = ref()
  const innerValue = ref('')
  const params = reactive({
    Filter: '',
  })
  const columns = [
    {
      field: 'order',
      width: 60,
      title: '序号',
    },
    {
      field: 'productName',
      title: '产品名称',
    },
    {
      field: 'productModel',
      title: '产品型号',
    },

    {
      field: 'bomName',
      title: 'BOM名称',
    },
  ]

  const onImport = async (file: { file: File }) => {
    let formData = new FormData()
    formData.append('file', file.file)
    await billofMaterial.importBillofMaterial(formData)
    ElMessage.success('操作成功')
    tableRef.value?.getList()
  }

  const onExport = async () => {
    const res = await billofMaterial.exportBillofMaterial()
    downloadFile(res, 'BOM管理.xlsx')
    ElMessage.success('操作成功')
  }

  const onSearch = (val: string) => {
    params.Filter = val
    tableRef.value?.getList()
  }

  const onRowClick = (data: any) => {
    curRowData.value = data.row
  }

  
  let preName = ''
  const onBlur = async (row: any) => {
    const len = dataSource.value.filter(
      (item: any) => item.bomName === row.bomName
    )
    if (len.length > 1) {
      ElMessage.warning('BOM名称重复')
      row.bomName = preName
      return
    }
    await billofMaterial.updateBillofName(row.productId, {
      bomName: row.bomName,
    })
    // tableRef.value?.getList()
  }

  const onFocus = (val: string) => {
    preName = val
  }

  return {
    onFocus,
    onBlur,
    onRowClick,
    onSearch,
    params,
    columns,
    onImport,
    onExport,
    dataSource,
    tableRef,
    innerValue,
  }
}
