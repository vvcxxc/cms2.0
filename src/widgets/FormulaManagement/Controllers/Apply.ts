import { injectModel } from '@/libs/Provider/Provider'
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useGlobalState } from '@/libs/Store/Store'
export const useApply = (props: any, ctx?: any) => {
  const { systemConfig } = useGlobalState()

  const dataSource = ref([])
  const tableRef = ref()
  console.log(systemConfig, '----systemConfig')

  // const showDistribute = ref(true)

  // watch(systemConfig.state, (cfg: Record<string, any>) => {
  //   // sopDisabled.value = Boolean(Number(cfg.Sop_Enabled))
  //   console.log(cfg);

  //   showDistribute.value = cfg.FormulaDistributionMode == 1
  // })

  const showDistribute = computed(() => {
    //@ts-ignore
    return systemConfig.state.value.FormulaDistributionMode == 1
  })

  const hideLineStructure = computed(() => {
    //@ts-ignore
    return systemConfig.state.value.ProductionLineStructure == 0
  })

  const dialogConfig = reactive({
    visible: false,
    title: '配方下发',
  })

  const columns = reactive([
    {
      type: 'seq',
      width: 60,
      title: '序号',
    },
    {
      field: 'productionLineSegmentName',
      title: '工序段名称',
      hide: hideLineStructure.value
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
      field: 'formulaName',
      title: '配方名称',
    },
    {
      field: 'formulaVersionName',
      title: '配方版本',
    },
    {
      field: 'productModel',
      title: '产品型号',
    },
  ])

  const onClickIssue = () => {
    dialogConfig.visible = true
  }

  const onConfirm = () => {
    tableRef.value?.getList()
  }

  return {
    onClickIssue,
    onConfirm,
    columns,
    tableRef,
    dataSource,
    dialogConfig,
    showDistribute,
  }
}
