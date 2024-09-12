import { injectModel } from '@/libs/Provider/Provider'
import { Material } from '../Models/Material'
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { downloadFile } from '@/utils'
import { createInjector } from '../store/MaterialStore'

export const useMaterialCode = (props: any, ctx?: any) => {
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
  const sortUrl = ref('')

  const getMaterialDetailList = async()=> {
    const res = await material.getMaterialDetail(curRowData.value.id, {
      filter: searchInner.value
    })
    console.log(res, '--11');
    dataSource.value = res
    tableRef.value?.clearSelectEvent()
  }

  watch(()=> curRowData.value?.id,  (val: string)=> {
    console.log(val);
    if (curRowData.value?.id){
      getMaterialDetailList()
      sortUrl.value = `/api/v1/materialmanagement/material/${curRowData.value.id}/{id}/reorder/{sort}`
    }
  }, {
    immediate: true
  })


  

  const onCheck = (records: any) => {
    console.log('onCheck', records)
    checkedList.value = records
  }

  const onAddMaterial = () => {
    dialogConfig.rowData = null
    dialogConfig.title = '新建物料编号'
    dialogConfig.visible = true
  }

  const onEditMaterial = () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择一个物料编号进行编辑!')
      return
    }

    if (checkedList.value.length > 1) {
      ElMessage.warning('仅支持编辑单个物料编号!')
      return
    }
    console.log(checkedList.value[0]);

    dialogConfig.rowData = checkedList.value[0]
    dialogConfig.title = '编辑物料编号'
    dialogConfig.visible = true
  }

  const onConfirm = ()=> {
    getMaterialDetailList()
  }




  const onDelete = ()=> {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择物料编号进行删除!')
      return
    }
    ConfirmBox('物料编号删除后，相关生产数据无法恢复，是否确认删除？').then(async()=> {
      const ids = checkedList.value.map(item => item.id)
      await material.deleteMaterialDetail(curRowData.value.id,ids)
      ElMessage.success('删除成功')
      getMaterialDetailList()
    })
  }

  const onSearch = () => {
    console.log(tableRef.value)
    getMaterialDetailList()
  }

  return {
    sortUrl,
    onSearch,
    searchInner,
    tableRef,
    onDelete,
    onConfirm,
    dataSource,
    onCheck,
    onAddMaterial,
    dialogConfig,
    onEditMaterial
  }
}
