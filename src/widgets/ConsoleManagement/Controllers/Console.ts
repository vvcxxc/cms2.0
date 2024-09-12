import { injectModel } from '@/libs/Provider/Provider'
import { Console } from '../Models/Console'
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  SetupContext,
  watch,
} from 'vue'
import { Socket } from '@/libs/Socket/index'
import {
  Subscribe,
  Init,
  ShowLog,
  TagChanged,
  ExecuteControl,
  UpdateAbility,
  WriteValue,
  SearchFlowLog,
} from '../enum'
import { cloneDeep, isNil } from 'lodash'
import { Base } from '@/libs/Base/Base'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components'

interface HeaderParams {
  workSection?: string
  workStation?: string
}

export const useConsole = (props: any, ctx: SetupContext) => {
  const consoleModel = injectModel<Console>('console')
  const headerParams = ref<HeaderParams>({})
  const dataSource = ref<any>([])
  const flowInfos = ref<any>([])
  const active = ref<string>('')
  const filedMap = ref<Record<string, any>>({})
  const flowMap = ref<Record<string, any>>({})
  const loggerRef = ref()
  const loggerTrackRef = ref()
  const flowLoggerMap = ref<Record<string, any>>({})
  const flowName = ref<string>('')
  const leftContentRef = ref()
  const leftConfig = ref<Record<string, any>>({})
  const logConfig = reactive({
    position: false,
    Keyword: '',
  })
  const controlConfig = reactive({
    show: false,
    title: '',
    type: '',
    name: '',
  })
  const issueConfig = reactive({
    show: false,
    title: '',
    name: '',
    VariableName: '',
  })
  const flowConfig = reactive({
    show: false,
    data: [],
  })
  let socket = ref<Socket | any>({})
  const currentLoggerData = computed(() => {
    return (key: string) => {
      return flowLoggerMap.value[key] || []
    }
  })
  const currentLeftStyle = computed(() => {
    return leftConfig.value.height
      ? {
          height: (leftConfig.value.height - 328) / 2 + 'px',
        }
      : {}
  })
  const onHeaderChange = (value: HeaderParams) => {
    flowLoggerMap.value = {}
    headerParams.value = value
  }
  const initFlowData = (data: any) => {
    flowInfos.value = data.flowInfos
    active.value = String(data.flowInfos[0].type)
    flowName.value = data.flowInfos[0].name
    flowInfos.value.forEach((flow: any) => {
      flowMap.value[flow.type] = flow
      filedMap.value[flow.type] = filedMap.value[flow.type] || {}
      flow.fields.forEach((item: any) => {
        filedMap.value[flow.type][item.objectValue] = item
      })
    })
    initLeftBarHeight()
  }
  const initLeftBarHeight = () => {
    nextTick(() => {
      const style = window.getComputedStyle(leftContentRef.value, null)
      leftConfig.value.height = parseInt(style.height)
    })
  }
  const initLogData = (data: {
    procName: string
    instanceID: number
    logMessage: string
  }) => {
    flowLoggerMap.value[data.procName] =
      flowLoggerMap.value[data.procName] || []
    const dataSource = flowLoggerMap.value[data.procName]
    if (dataSource.length > 200) {
      dataSource.shift()
    }
    dataSource.push(data)
  }

  const initTagChanged = (data: any) => {
    const field = filedMap.value?.[active.value]?.[data.variableName] || {}
    field.realValue =
      data.variableValue === null ? '-' : String(data.variableValue)
  }

  const initSocket = () => {
    const { workSection, workStation } = headerParams.value
    if (!workStation) return null
    const start = () => {
      flowInfos.value = []
      socket.value = new Socket({
        url: '/hubs/v1/process/control-panel',
        name: '控制台',
      })
      socket.value.on(Init, initFlowData)
      socket.value.on(ShowLog, initLogData)
      socket.value.on(TagChanged, initTagChanged)
      socket.value?.connection.start().then(() => {
        socket.value?.call(Subscribe, {
          WorkSectionId: workSection,
          WorkStationId: workStation,
        })
      })
    }
    const pThen = socket.value?.connection?.stop()
    if (pThen) {
      pThen.then(start)
    } else {
      start()
    }
  }
  const onTabChange = (v: string) => {
    active.value = v
    flowName.value = flowMap.value[v].name
  }

  const onEmitFunction = (
    name: string,
    control: {
      description: string
      name: string
    }
  ) => {
    controlConfig.show = true
    controlConfig.title = name
    controlConfig.type = control.description
    controlConfig.name = control.name
  }

  const onConfirmControl = (remark?: string, type?: boolean) => {
    if (!headerParams.value.workStation) {
      return ElMessage.warning('请选择工位')
    }
    const userInfo = Base.userInfo
    const name = !type ? flowMap.value[active.value].procName : ''
    socket.value?.call(ExecuteControl, {
      UserId: userInfo.id,
      UserName: userInfo.name,
      ProcName: name,
      ControlName: controlConfig.name || '',
      Remark: remark,
    })
    if (!type) {
      controlConfig.name = ''
      controlConfig.title = ''
      controlConfig.show = false
    }
  }

  const onReloadAll = () => {
    ConfirmBox('是否确认重启所有流程?').then(() => {
      // 重启所有流程
      onConfirmControl('', true)
    })
  }

  const onOpenFlow = () => {
    if (!headerParams.value.workStation) {
      return ElMessage.warning('请选择工位')
    }
    flowConfig.data = flowMap.value[active.value].abilitys
    flowConfig.show = true
  }

  const onConfirmFlow = (data: any) => {
    const userInfo = Base.userInfo
    const flows = data.map((item: any) => {
      return {
        Value: Number(item.value),
        Name: item.code,
        Description: item.description,
      }
    })
    const ProcName = flowMap.value[active.value].procName
    socket.value?.call(UpdateAbility, {
      UserId: userInfo.id,
      UserName: userInfo.name,
      FlowAbilitys: flows,
      ProcName,
    })
    flowConfig.show = false
    flowConfig.data = data
  }

  const onOpenIssue = (row: any, name: string) => {
    issueConfig.show = true
    issueConfig.name = name
    issueConfig.VariableName = row.objectValue
    issueConfig.title = row.name
  }

  const onIssueVariable = (formData: Record<string, any>) => {
    const userInfo = Base.userInfo
    socket.value?.call(WriteValue, {
      UserId: userInfo.id,
      UserName: userInfo.name,
      ProcName: issueConfig.name,
      VariableName: issueConfig.VariableName,
      VariableValue: formData.VariableValue,
      Remark: formData.Remark,
    })
    issueConfig.show = false
  }

  const onPositionLog = (row: any) => {
    logConfig.Keyword = row.instanceID
    logConfig.position = true
    loggerRef.value?.updateLogInfo(row)
  }

  const onStopConnect = () => {
    socket.value?.connection?.stop().then(() => {
      loggerTrackRef.value?.stop()
      loggerRef.value?.stop()
      headerParams.value = {}
      dataSource.value = []
      flowInfos.value = []
      active.value = ''
      filedMap.value = {}
      flowMap.value = {}
      flowLoggerMap.value = {}
      flowName.value = ''
    })
  }

  watch(headerParams, initSocket)

  onMounted(() => {})

  return {
    onHeaderChange,
    onTabChange,
    onEmitFunction,
    onConfirmControl,
    onReloadAll,
    onOpenFlow,
    onConfirmFlow,
    onIssueVariable,
    onOpenIssue,
    onPositionLog,
    onStopConnect,
    currentLeftStyle,
    leftConfig,
    leftContentRef,
    loggerTrackRef,
    flowName,
    currentLoggerData,
    flowLoggerMap,
    loggerRef,
    logConfig,
    issueConfig,
    flowConfig,
    active,
    flowInfos,
    dataSource,
    headerParams,
    socket,
    controlConfig,
  }
}
