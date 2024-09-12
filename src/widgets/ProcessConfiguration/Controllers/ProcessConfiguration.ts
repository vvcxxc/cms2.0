import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  queryProductionLineStructure,
  getProductModelList,
} from '../Models/Service/Service'
import { useGlobalState } from '@/libs/Store/Store'

export const useProcessConfiguration = (props: any, ctx?: any) => {
  const { productionLineList, getProductList } = useGlobalState()
  const tableRef = ref()
  const dataSource = ref([])
  const selections = ref<Array<Record<string, any>>>([])
  const searchLineType = ref('')
  const columns = ref<any[]>([])
  const search = ref('')

  console.log('ProcessConfiguration00')
  const updateColumns = async () => {
    queryProductionLineStructure().then((res: any) => {
      let _type: string = (res.settings.length && res.settings[0]?.value) || ''
      searchLineType.value = _type
      if (_type == '1') {
        columns.value = [
          {
            type: 'seq',
            width: 60,
            title: '序号',
          },
          {
            field: 'productModel',
            title: '产品型号',
            el: 'select',
            // 搜索时所用的字段
            prop: 'productId',
            options: getProductModelList,
            placeholder: '请选择所属产品型号',
          },
          {
            field: 'formulaName',
            title: '配方名称',
          },
          {
            field: 'productionLineSegmentName',
            title: '产线段',
            el: 'select',
            // 搜索时所用的字段
            prop: 'ProductionLineSegmentId',
            options: getProductList,
            placeholder: '请选择所属产线段',
          },
          {
            field: 'workSectionCode',
            title: '工序编号',
          },
          {
            field: 'workSectionName',
            title: '工序名称',
          },
          {
            field: 'missingProcessSettingInfo',
            title: '漏工序检测',
          },
          {
            field: 'productUpdateSettingInfo',
            title: '产品码更新',
          },
          {
            field: 'productStatusDetectSettingInfo',
            title: '产品状态检测',
          },
        ]
        // tableRef.value?.getList()
      } else {
        columns.value = [
          {
            type: 'seq',
            width: 60,
            title: '序号',
          },
          {
            field: 'productModel',
            title: '产品型号',
            el: 'select',
            // 搜索时所用的字段
            prop: 'productId',
            options: getProductModelList,
            // options: [],
            placeholder: '请选择所属产品型号',
          },
          {
            field: 'formulaName',
            title: '配方名称',
          },
          {
            field: 'workSectionCode',
            title: '工序编号',
          },
          {
            field: 'workSectionName',
            title: '工序名称',
          },
          {
            field: 'missingProcessSettingInfo',
            title: '漏工序检测',
          },
          {
            field: 'productUpdateSettingInfo',
            title: '产品码更新',
          },
          {
            field: 'productStatusDetectSettingInfo',
            title: '产品状态检测',
          },
        ]
      }
    })
  }
  updateColumns()
  /**
   * 漏工序弹窗
   */
  const missingProcessCallBack = (str?: String) => {
    if (str) {
      ElMessage.success(str)
    }
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
    selections.value = []
  }

  const onCheck = (records: any) => {
    selections.value = [{ ...records.row }]
  }

  /**
   * 关键字搜索
   */
  const onSearch = () => {
    tableRef.value?.getList()
    tableRef.value?.clearSelectEvent()
  }

  return {
    selections,
    onCheck,
    dataSource,
    tableRef,
    searchLineType,
    search,
    columns,
    onSearch,
    missingProcessCallBack,
  }
}
