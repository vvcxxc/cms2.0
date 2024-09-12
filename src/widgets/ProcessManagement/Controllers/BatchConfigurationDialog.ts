import { PropType, SetupContext, ref, Ref, watch, onMounted } from 'vue'
import { useDialog } from './Dialog'
import { useStationDrawer } from './StationDrawer'
import { injectModel } from '@/libs/Provider/Provider'
import type { BatchConfiguration } from '../Models/BatchConfiguration'
/**
 * 批量配置 a -> batch -> param
 *         b -> a -> param
 *
 * @param props
 * @param ctx
 * @returns
 */
export const useBatchConfigurationDialog = (props: any, ctx: SetupContext) => {
  const { getBitConfigure, onConfirm, sectionKeyMap, currentRow, signalData } =
    useStationDrawer(props, ctx)
  const dialogHook = useDialog(props, ctx)
  const batchConfigure = injectModel<BatchConfiguration>('batchConfiguration')
  const state = ref<any[]>([])
  /**
   * 已经进行选中过的li，缓存数据
   */
  const batchRefTabs = ref<Record<string, any>>({})
  /**
   * 工位参数
   */
  const params = ref<{
    flowType?: string
    name?: string
  }>({})
  /**
   * 工位列表搜索值
   */
  const list = ref([])
  /**
   * 搜索值
   */
  const s = ref('')
  /**
   * 参数配置表格
   */
  const paramsRef = ref()
  /**
   * 选中值
   */
  const active = ref('')
  /**
   * 已经选中和操作过的li
   */
  const activeList = ref<string[]>([])

  const errorList = ref<string[]>([])
  /**
   * 搜索
   * @param v
   */
  const onSearch = (v: string) => {
    v = s.value || v
    if (!v) {
      list.value = []
    } else {
      // @ts-ignore
      list.value = state.value?.filter((item) => {
        return item.label.includes(v)
      })
    }
  }
  /**
   * 切换工位
   */
  const onClickStation = async (v: string) => {
    active.value = v
    if (!activeList.value.includes(v)) {
      activeList.value.push(v)
    }
    await getBitConfigure(v)
    paramsRef.value?.init()
  }
  /**
   * 获取工位ID
   */
  const getList = async () => {
    params.value.flowType = props.flowType
    state.value = await batchConfigure.getStationList(params.value)
    if (state.value[0]?.value) {
      active.value = state.value[0]?.value
      onClickStation(active.value)
    }
  }
  /**
   * 打开弹窗
   */
  const onOpen = async () => {
    activeList.value = []
    errorList.value = []
    await getList()
  }
  /**
   * 确认弹窗
   */
  const onConfirmBatch = async () => {
    errorList.value = []
    const entries = Object.entries(batchRefTabs.value)

    for (let index = 0; index < entries.length; index++) {
      const [key, rf] = entries[index]
      try {
        await rf?.onSaveConfig(key)
      } catch (error) {
        errorList.value.push(key)
      }
    }
    if (!errorList.value.length) {
      dialogHook.visible.value = false
    }
  }

  return {
    ...dialogHook,
    s,
    list,
    paramsRef,
    state,
    sectionKeyMap,
    currentRow,
    signalData,
    active,
    activeList,
    batchRefTabs,
    errorList,
    onConfirm, //参数配置
    onOpen,
    onSearch,
    onClickStation,
    onConfirmBatch,
  }
}

/**
 * 批量配置参数模块
 * @param props
 * @param ctx
 * @returns
 */
export const useBatchParamsSignal = (props: any, ctx: SetupContext) => {
  const dialogHook = useBatchConfigurationDialog(props, ctx)

  onMounted(() => {
    if (props.active) {
      dialogHook.onClickStation(props.active)
    }
  })

  ctx.expose({
    onSaveConfig: dialogHook.onConfirm,
  })

  return {
    ...dialogHook,
  }
}
