import { SetupContext, ref, computed, reactive } from 'vue'
import { useVModel } from '@vueuse/core'
import { _t } from '../app'

export const useFlow = (props: any, { emit }: SetupContext) => {
  const isEdit = ref(false)
  const G6FlowRef = ref()
  const isFullscreen = ref(false)
  /**
   * 工序弹窗配置
   */
  const workSectionDialog = reactive({
    title: '',
    visible: false,
  })
  /**
   * 批量配置弹窗
   */
  const batchDialog = reactive({
    visible: false,
    title: '',
    flowType: '',
  })

  const flowConfig = reactive<{
    flowType: string
    visible: boolean
    title: string
    row: Record<string, any>
  }>({
    flowType: '',
    visible: false,
    title: '',
    row: {},
  })
  /**
   * 数据源
   */
  const dataSource = ref([])
  /***
   * tableRef
   */
  const tableRef = ref()
  /**
   * 流程名称
   */
  const search = ref('')

  const flowContentRef = ref()

  const flowHeight = computed(() => {
    if (flowContentRef.value) {
      const height = window.getComputedStyle(flowContentRef.value).height
      return parseInt(height) - 50
    }
    return 900
  })

  const onConfirmFlow = () => {
    G6FlowRef.value?.graphSave()
    flowConfig.visible = false
  }

  /**
   * 批量配置
   */
  const onBatchConfigure = ({ id, name, type }: Record<string, any>) => {
    batchDialog.flowType = type
    batchDialog.visible = true
    batchDialog.title = name
  }

  /**
   * 搜索
   * @param val
   */
  const onSearch = (val: string) => {
    tableRef.value?.getList({
      Name: search.value,
    })
  }
  /**
   * 选择工序
   */
  const onSelectWorkSection = () => {
    workSectionDialog.visible = true
  }
  /**
   * 确认时，更新流程数据
   */
  const onConfirmWorkSection = (records: any[]) => {
    // console.log(records, 's00000')
  }
  /**
   * 批量配置
   */
  const onBatchConfirm = (record: any[]) => {}
  /**
   * 查看流程
   */
  const onLookFlow = (
    row: Record<string, any>,
    type: string,
    title: string
  ) => {
    flowConfig.visible = true
    flowConfig.flowType = type
    flowConfig.title = title
    flowConfig.row = row
    isFullscreen.value = false
    isEdit.value = false
  }

  const onEditFlow = (
    row: Record<string, any>,
    type: string,
    title: string
  ) => {
    flowConfig.visible = true
    flowConfig.flowType = type
    flowConfig.title = title
    flowConfig.row = row
    isEdit.value = true
    isFullscreen.value = true
  }

  return {
    dataSource,
    tableRef,
    workSectionDialog,
    search,
    flowConfig,
    batchDialog,
    isFullscreen,
    isEdit,
    flowContentRef,
    flowHeight,
    G6FlowRef,
    onConfirmFlow,
    onBatchConfirm,
    onBatchConfigure,
    onSearch,
    onSelectWorkSection,
    onConfirmWorkSection,
    onLookFlow,
    onEditFlow,
  }
}
