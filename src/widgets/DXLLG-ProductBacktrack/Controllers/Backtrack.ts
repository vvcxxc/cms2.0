import { injectModel } from '@/libs/Provider/Provider'
import { downloadFile } from '@/utils'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import dayjs from 'dayjs'
import { ProductBacktrack } from '../Models/ProductBacktrack'

export const useBacktrack = (props: any, ctx?: any) => {
  const productBacktrack = injectModel<ProductBacktrack>('ProductBacktrack')
  const traceData = ref<any>(null)

  const exportPopShow = ref(false)
  const onOpenExport = () => {
    exportPopShow.value = true
  }

  const exportSettingPopShow = ref(false)
  const onOpenSettingExport = () => {
    if (!traceData.value?.productTraceDetails?.length) {
      ElMessage.warning('请输入条码进行查询后再导出检验报告')
      return
    }
    exportSettingPopShow.value = true
  }

  const filterForm = reactive({
    FilterType: '0',
    searchMode: 'a',
    // Filter: '20240311_0000001000',
    Filter: '',
  })

  const selectOption = {
    searchType: [
      {
        label: '产品ID',
        value: '0',
      },
      {
        label: '更新码',
        value: '1',
      },
      {
        label: '物料条码',
        value: '2',
      },
    ],
    searchMode: [
      {
        label: '精确查询',
        value: 'a',
      },
    ],
  }

  const getTraceData = async () => {
    if (!filterForm.Filter) {
      ElMessage.warning('请输入查询内容！')
      return
    }
    try {
      const res = await productBacktrack.getProductTrace(filterForm)
      console.log(res)
      traceData.value = res
    } catch (e) {
      traceData.value = null
    }
  }

  const onKeydown = (e: any) => {
    if (e.key === 'Enter') {
      getTraceData()
    }
  }

  const onSearch = () => {
    getTraceData()
  }
  const onExport = async () => {
    if (!filterForm.Filter) {
      ElMessage.warning('请输入查询内容！')
      return
    }
    const res = await productBacktrack.exportProductTrace([filterForm.Filter])
    downloadFile(res, `产品码回溯_${dayjs().format('YYYYMMDDHHMMss')}.xlsx`)
    ElMessage.success('导出成功')
  }

  return {
    onKeydown,
    onSearch,
    selectOption,
    filterForm,
    getTraceData,
    traceData,
    onExport,
    exportPopShow,
    onOpenExport,
    exportSettingPopShow,
    onOpenSettingExport,
  }
}
