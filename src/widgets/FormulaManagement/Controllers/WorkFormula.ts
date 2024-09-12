import { onMounted, reactive, ref } from 'vue'
import { useGlobalState } from '@/libs/Store/Store'
import { createInjector } from '../store/ApplyStore'
import { Apply } from '../Models/Apply'
import { injectModel } from '@/libs/Provider/Provider'
export const useWorkFormula = () => {
  const apply = injectModel<Apply>('apply')
  const { curFormula } = createInjector()
  const { productionLineList } = useGlobalState()
  const { state }: Record<string, any> = productionLineList
  const dataSource = ref<any[]>([])
  const tableRef = ref()
  const columns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'name',
      title: '配方名称',
    },
    {
      field: 'currentVersion',
      title: '配方当前版本',
      width: '135px'
    },
    {
      field: 'productModel',
      title: '产品型号',
    },
    {
      field: 'productName',
      title: '产品名称',
    },
  ]

  const initFormulaList = (list: any[]) => {
    dataSource.value = []
    list.forEach((item) => {
      if (item.formula2Products?.length) {
        item.formula2Products.forEach((prod: any) => {
          // 需要添加个新的id，要不然id重复，选择的时候会有问题
          dataSource.value.push({
            ...item,
            productName: prod.productName,
            productModel: prod.productModel,
            productId: prod.productId,
            newId: item.id + prod.productModel,
          })
        })
      } else {
        dataSource.value.push({
          ...item,
          newId: item.id,
        })
      }
    })
  }

  const getFormulaList = async () => {
    const res = await apply.getFormulaList(filterForm)
    initFormulaList(res.items ?? [])
    console.log(dataSource.value)
  }

  const filterForm = reactive({
    ProductFilter: '',
    Filter: '',
    MaxResultCount: 999,
    IncludeDetails: true,
  })

  const onChange = async () => {
    getFormulaList()
  }

  const onRowClick = (data: any) => {
    curFormula.value = data.row
    console.log(curFormula.value, '----curFormula')
  }

  onMounted(async () => {
    getFormulaList()
  })

  return {
    tableRef,
    onRowClick,
    columns,
    state,
    dataSource,
    filterForm,
    onChange,
  }
}
