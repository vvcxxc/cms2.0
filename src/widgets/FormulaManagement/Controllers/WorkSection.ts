import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useGlobalState } from '@/libs/Store/Store'
import { getWorkSectionApi } from '@/api/common-enum'
import { useVModel } from '@vueuse/core'

// import { getWorkSection } from '@/widgets/ProcessManagement/Models/Service/Service'
export const useWorkSection = (props: any, ctx: any) => {
  const { productionLineList, systemConfig } = useGlobalState()

  const { state }: Record<string, any> = productionLineList
  const dataSource = ref<any>([])
  // const dataSource = useVModel(props, 'dataSource')
  const showLineStructure = computed(() => {
    //@ts-ignore
    return systemConfig.state.value.ProductionLineStructure == 1
  })
  const tableRef = ref()
  const columns = ref<any[]>([])
  const filterForm = reactive({
    Segment: '',
    Filter: '',
  })

  const disabledDrag = computed(()=> {
    return !!(filterForm.Filter || filterForm.Segment)
  })

  watch(
    () => showLineStructure.value,
    (val) => {
      columns.value = [
        {
          field: 'code',
          title: '工序编号',
          width: 102,
        },
        {
          field: 'name',
          title: '工序名称',
        },
      ]

      if (val) {
        columns.value.unshift({
          field: 'segment',
          width: 164,
          title: '工序段名称',
        })
      }

      if (props.showSeq) {
        columns.value.unshift({
          field: '序号',
          type: 'seq',
          width: '80',
        })
      }
    },
    {
      immediate: true,
    }
  )

  watch(
    () => props.dataSource,
    (val) => {
      dataSource.value = [...props.dataSource]
      filterForm.Filter = ''
      filterForm.Segment =''
    },
    {
      immediate: true,
      deep: true,
    }
  )

  const onChange = () => {
    console.log(3, filterForm, props.dataSource)
    if (!filterForm.Filter && !filterForm.Segment) {
      dataSource.value = [...props.dataSource]
      return
    }

    dataSource.value = props.dataSource.filter((item: any) => {
      if (filterForm.Filter && filterForm.Segment) {
        return (
          (item.name.includes(filterForm.Filter) ||
            item.code.includes(filterForm.Filter)) &&
          item.segment?.id === filterForm.Segment
        )
      }

      //  任何字符includes空字符都是true
      if (filterForm.Filter) {
        return (
          item.name.includes(filterForm.Filter) ||
          item.code.includes(filterForm.Filter)
        )
      } else {
        return item.segment?.id === filterForm.Segment
      }
    })
    console.log(dataSource.value)
  }

  const onCheck = (list: any) => {
    ctx.emit('check', list)
  }

  const clearSelectEvent = ()=> {  
    tableRef.value?.clearSelectEvent()
  }

  const onDrag = (list: any)=> {
    // 更改排序
    ctx.emit('update:dataSource', dataSource.value)
  }

  ctx.expose({
    clearSelectEvent
  })

  return {
    onDrag,
    disabledDrag,
    showLineStructure,
    onCheck,
    tableRef,
    columns,
    state,
    dataSource,
    filterForm,
    onChange,
  }
}
