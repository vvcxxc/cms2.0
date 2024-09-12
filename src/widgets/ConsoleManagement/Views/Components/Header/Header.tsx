import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import styles from './Header.module.scss'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import { Console } from '../../../Models/Console'
import { injectModel } from '@/libs/Provider/Provider'
import { useGlobalState } from '@/libs/Store/Store'
import { ControlPanel } from '../../../enum'
import BaseDialog from '@/components/BaseDialog/index.vue'
import G6Flow from '@/components/G6Flow/G6Flow'
import { useHook } from '@/libs/Hook/Hook'

export default defineComponent({
  name: 'ConsoleManagement',
  emits: ['change', 'reloadAll', 'flow', 'stop'],
  props: ['flowType', 'flowName', 'node'],
  setup(props, { emit }) {
    const { getComputedProp } = useHook(props, emit)

    const consoleModel = injectModel<Console>('Console')
    const { systemConfig } = useGlobalState()
    const flowConfig = reactive<any>({
      visible: false,
      title: '',
      flowType: '',
    })
    const workSectionMap = ref<{
      tree: any[]
      items: any[]
    }>({
      tree: [],
      items: [],
    })
    const section = getComputedProp('workSection')
    const station = getComputedProp('workStation')
    const showFilter = getComputedProp('showFilter', true)
    const workSection = ref<string>('')
    const workStation = ref<string>('')
    const workStationList = ref<any>([])

    const onOpenFlow = () => {
      emit('flow')
    }

    const hasProduct = computed(() => {
      return systemConfig.state.value?.ProductionLineStructure == 1
    })

    const watchConfigParams = () => {
      setTimeout(async () => {
        if (section.value) {
          workSection.value = section.value
          await onWorkSectionChange()
        } else {
          workSection.value = ''
          workStation.value = ''
          return emit('stop')
        }
        if (station.value) {
          workStation.value = station.value
          return onWorkStationChange(false)
        } else {
          workStation.value = ''
          return emit('stop')
        }
      })
    }

    const initSession = async () => {
      await initWorkSectionList()
      //先看会话有没有选过其他的工序工位
      const data = sessionStorage.getItem(ControlPanel)
      if (data) {
        const workData = JSON.parse(data) as any
        workSection.value = workData.workSection
        if (workSection.value) {
          await onWorkSectionChange()
        }
        workStation.value = workData.workStation
        onWorkStationChange(true)
        return
      }
      //再看setting有没有预设工位
      if (section.value && station.value) {
        workSection.value = section.value
        await onWorkSectionChange()
        workStation.value = station.value
        onWorkStationChange(false)
        return
      }
    }

    const initWorkSectionList = async () => {
      workSectionMap.value = await consoleModel.getWorkSection()
    }

    const onWorkSectionChange = async () => {
      workStation.value = ''
      workStationList.value = await consoleModel.getWorkStation(
        workSection.value
      )
    }

    const onWorkStationChange = async (type: any) => {
      //运行版有改变后，再回来按上次的，不按setting的
      setTimeout(() => {
        const data = {
          workSection: workSection.value,
          workStation: workStation.value,
        }
        emit('change', data)
        if (!type) {
          sessionStorage.setItem(ControlPanel, JSON.stringify(data))
        }
      })
    }
    const onOpenFlowDialog = () => {
      flowConfig.visible = true
      flowConfig.title = props.flowName
      flowConfig.flowType = props.flowType
    }
    const onReloadAllProcess = () => {
      emit('reloadAll')
    }

    watch(section, watchConfigParams)
    watch(station, watchConfigParams)

    onMounted(async () => {
      initSession()
    })

    return () => {
      return (
        <div class={styles.header} v-show={showFilter.value}>
          <div class={styles.left}>
            <div class={styles.row}>
              <span>工序</span>
              <el-tree-select
                v-model={workSection.value}
                onChange={onWorkSectionChange}
                clearable={false}
                // disabled={!!section.value}
                filterable
                node-key="id"
                props={{
                  label: 'name',
                }}
                data={
                  hasProduct.value
                    ? workSectionMap.value.tree
                    : workSectionMap.value.items
                }
                placeholder="请选择工序"
              ></el-tree-select>
            </div>
            <div class={styles.row}>
              <span>工位</span>
              <el-select
                clearable={false}
                // disabled={!!station.value}
                filterable
                v-model={workStation.value}
                onChange={() => onWorkStationChange(false)}
                placeholder="请选择工位"
              >
                {workStationList.value.map((item: any) => {
                  return (
                    <el-option
                      label={item.name}
                      value={item.id}
                      key={item.id}
                    ></el-option>
                  )
                })}
              </el-select>
            </div>
          </div>
          <div class={styles.right}>
            <SvgIcon
              type="flow"
              width={18}
              height={18}
              class={styles.icon}
              onClick={onOpenFlowDialog}
              title="查看流程"
            ></SvgIcon>
            <SvgIcon
              type="setting"
              width={20}
              height={20}
              class={styles.icon}
              title="流程功能设置"
              style={{ margin: '0 10px' }}
              onClick={onOpenFlow}
            ></SvgIcon>
            <SvgIcon
              title="一键重启所有流程"
              type="reload"
              width={20}
              height={20}
              class={styles.icon}
              onClick={onReloadAllProcess}
            ></SvgIcon>
          </div>
          <BaseDialog
            width="80%"
            top="3%"
            v-model={flowConfig.visible}
            title={flowConfig.title}
            destroy-on-close
            fullscreen={false}
            submitDisabled={true}
            onConfirm={() => {
              flowConfig.visible = false
            }}
            onClose={() => {
              flowConfig.visible = false
            }}
          >
            <div class={styles.g6Flow}>
              <G6Flow height={900} flowType={props.flowType} isEdit={false} />
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
