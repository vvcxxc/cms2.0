import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useGlobalState } from '@/libs/Store/Store'
import { createInjector } from '../store/SOPStore'
import { _t, LanguageScopeKey } from '../app'

export const useWorkSection = () => {
  const { systemConfig, productionLineList } = useGlobalState()

  const { curProcessId, setCurProcessStep, checkStep } = createInjector()
  const { state }: Record<string, any> = productionLineList
  const showLineStructure = computed(() => {
    //@ts-ignore
    return systemConfig.state.value.ProductionLineStructure == 1
  })
  const dataSource = ref<any[]>([])
  const tableRef = ref()
  const columns = ref<any[]>([])

  watch(
    () => showLineStructure.value,
    (val) => {
      columns.value = [
        {
          field: 'code',
          title: _t('工序编号'),
          width: 102,
        },
        {
          field: 'name',
          title: _t('工序名称'),
        },
      ]

      if (val) {
        columns.value.unshift({
          field: 'segment',
          width: 164,
          title: _t('工序名称'),
        })
      }
    },
    {
      immediate: true,
    }
  )

  const filterForm = reactive({
    Segment: '',
    Filter: '',
  })

  const onChange = async () => {
    tableRef.value.getList()
  }

  const onRowClick = (data: any) => {
    if (!curProcessId.value || checkStep()) {
      curProcessId.value = data.row.id
      setCurProcessStep()
    } else {
      tableRef.value.setCurrentRow(curProcessId.value)
    }
  }

  return {
    tableRef,
    onRowClick,
    columns,
    state,
    dataSource,
    filterForm,
    onChange,
    showLineStructure,
  }
}
