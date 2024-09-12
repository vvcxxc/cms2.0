import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useGlobalState } from '@/libs/Store/Store'
import { createInjector } from '../store/ApplyStore'
export const useWorkRoute = () => {
  const { curFormula, checkedList } = createInjector()
  const { productionLineList } = useGlobalState()

  const { state }: Record<string, any> = productionLineList
  const dataSource = ref<any[]>([])
  // const checkedList = ref<any[]>([])
  const tableRef = ref()
  const columns = [
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'productionLineSegmentName',
      width: 164,
      title: '工序段名称',
    },
    {
      field: 'workSectionCode',
      title: '工序编号',
      width: 102,
    },
    {
      field: 'workSectionName',
      title: '工序名称',
    },
  ]

  watch(
    () => curFormula.value,
    (formula) => {
      filterForm.Filter = ''
      filterForm.Segment = null
      dataSource.value = [...formula.formula2WorkSections]
      nextTick(() => {
        const ids = dataSource.value.map((item) => item.id)
        tableRef.value?.setSelectRow(ids)
        checkedList.value = [...dataSource.value]
      })
    }
  )

  const filterForm = reactive({
    Segment: null,
    Filter: '',
  })

  const onChange = () => {
    console.log(3, filterForm)
    if (!filterForm.Filter && !filterForm.Segment) {
      // 两个都为空的时候返回全部数据
      dataSource.value = [...curFormula.value.formula2WorkSections]
      return
    }

    dataSource.value = curFormula.value.formula2WorkSections.filter(
      (item: any) => {
        if (filterForm.Filter && filterForm.Segment) {
          // 两个都有值的时候，需要同时符合条件
          return (
            item.workSectionName.includes(filterForm.Filter) &&
            item.productionLineSegmentName === filterForm.Segment
          )
        }
        if (filterForm.Filter) {
          return item.workSectionName.includes(filterForm.Filter)
        } else {
          return item.productionLineSegmentName === filterForm.Segment
        }
      }
    )
    console.log(dataSource.value)
  }

  const onCheck = (list: any[]) => {
    checkedList.value = list
  }

  return {
    onCheck,
    tableRef,
    columns,
    state,
    dataSource,
    filterForm,
    onChange,
  }
}
