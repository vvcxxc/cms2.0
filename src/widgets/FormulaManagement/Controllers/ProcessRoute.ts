import { computed, reactive, ref, watch } from 'vue'
import { createInjector } from '../store/ManagementStore'
import { injectModel } from '@/libs/Provider/Provider'
import { Formula } from '../Models/Formula'
import { useGlobalState } from '@/libs/Store/Store'

export const useProcessRoute = (props: any, ctx: any) => {
  const formula = injectModel<Formula>('formula')
  const { productionLineList, systemConfig } = useGlobalState()

  const { state }: Record<string, any> = productionLineList
  const showLineStructure = computed(() => {
    //@ts-ignore
    return systemConfig.state.value.ProductionLineStructure == 1
  })
  const { currentFormula, currentWorkSection } = createInjector()
  const tableRef = ref()
  const dataSource = ref<any>([])
  const columns = ref<any[]>([])

  const filterColumns = ref([
    {
      prop: 'Segment',
      options: [] as any,
      title: '工序段',
      el: 'select',
      placeholder: '请选择工序段',
    },
  ])

  watch(
    () => showLineStructure.value,
    (val) => {
      columns.value = [
        {
          field: 'workSectionName',
          title: '工序名称',
        },
        {
          field: 'workSectionRemark',
          title: '备注',
          width: 50,
        },
      ]

      if (val) {
        columns.value.unshift({
          field: 'productionLineSegmentName',
          title: '工序段名称',
        })
      }
    },
    {
      immediate: true,
    }
  )

  watch(
    () => state.value,
    (val) => {
      console.log(val, '----工艺段')
      filterColumns.value[0].options =
        val?.map((item: any) => {
          return {
            label: item.name,
            value: item.name,
          }
        }) ?? []

      filterColumns.value[0].options.unshift({
        label: '全部',
        value: '',
      })
    },
    {
      immediate: true,
    }
  )

  watch(
    () => currentFormula.value,
    () => {
      filterForm.Filter = ''
      filterForm.Segment = ''
      dataSource.value = [...currentFormula.value.formula2WorkSections]
    }
  )

  const filterForm = reactive({
    Filter: '',
    Segment: '',
  })

  const onFilterChange = (val: any) => {
    filterForm.Segment = val.Segment
    onChange()
  }

  const onChange = () => {
    console.log(3, filterForm)
    if (!currentFormula.value?.formula2WorkSections) {
      dataSource.value = []
      return
    }
    if (!filterForm.Filter && !filterForm.Segment) {
      // 两个都为空的时候返回全部数据
      dataSource.value = [...currentFormula.value.formula2WorkSections]
      return
    }

    dataSource.value = currentFormula.value.formula2WorkSections.filter(
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

  const onRowClick = (rowData: any) => {
    currentWorkSection.value = rowData.row
  }

  return {
    showLineStructure,
    onFilterChange,
    filterColumns,
    onChange,
    onRowClick,
    dataSource,
    filterForm,
    columns,
    tableRef,
  }
}
