import { injectModel } from '@/libs/Provider/Provider'
import { downloadFile } from '@/utils'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { pick } from 'lodash'
import dayjs from 'dayjs'
import { ProductBacktrack } from '../Models/ProductBacktrack'

export const useBacktrack = (props: any, ctx?: any) => {
  const productBacktrack = injectModel<ProductBacktrack>('ProductBacktrack')
  const traceData = ref<any>(null)

  const exportPopShow = ref(false)
  const onOpenExport = () => {
    exportPopShow.value = true
  }
  const filterForm = reactive({
    // FilterType: '0',
    // searchMode: 'a',
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

  const uploadMES = () => {
    if (!traceData.value) return ElMessage.warning('请输入一码')
    const data = traceData.value.productTraceDetails.map((item: any) => {
      return { ...item.trace, repairFlag: item.trace.repairFlag || 0 }
    })
    productBacktrack.reupLoadMes(data).then((res: any) => {
      ElMessage.success('上传成功')
    })
  }

  const getTraceData = async () => {
    try {
      const res = await productBacktrack.getProductTrace(filterForm)
      //后端说他们没有给productTraceImages赋值，要前端自己组
      traceData.value = {
        ...res,
        productTraceDetails: res.productTraceDetails.map((item: any) => ({
          ...item,
        })),
      }
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
    downloadFile(res, `一码回溯_${dayjs().format('YYYYMMDDHHMMss')}.xlsx`)
    ElMessage.success('导出成功')
  }

  return {
    onKeydown,
    onSearch,
    selectOption,
    filterForm,
    getTraceData,
    traceData,
    uploadMES,
    onExport,
    exportPopShow,
    onOpenExport,
  }
}
