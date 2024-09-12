import {
  SetupContext,
  computed,
  markRaw,
  nextTick,
  onMounted,
  ref,
  toRaw,
  watch,
} from 'vue'
import { Socket } from '@/libs/Socket/index'
import {
  PrintFlowLog,
  SearchFlowLog,
  PrintTraceLog,
  SearchTraceLog,
  LoggerTrack,
  ExportLog,
  TraceLog,
  FlowLog,
} from '../enum'
import { ElMessage } from 'element-plus'
import { useFile } from './File'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import xss from 'xss'

interface FormType {
  LogLevel?: string | number
  Keyword?: string
  BeginTime?: string
  EndTime?: string
}
interface LogType {
  content: string
  type: string
}
export const useLogger = (props: any, ctx: SetupContext, type: string) => {
  const { exportFile } = useFile()
  const form = ref<FormType>({})
  const isHistory = ref(false)
  const printFlowLogs = ref<LogType[]>([])
  const printTraceLogs = ref<LogType[]>([])
  const files = ref<string[] | any>([])
  const isStopRealLog = ref(false)
  const logContentRef = ref()
  const isScroll = ref(false)
  let t: any
  let logs: LogType[] = []
  let trackLogs: LogType[] = []
  let historyLogs: LogType[] = []
  let historyTrackLogs: LogType[] = []

  /**
   * 获取日志类型
   * @param log
   * @returns
   */
  const getLogType = (log: string) => {
    if (log.includes('[Info]')) {
      return 'Info'
    }
    if (log.includes('[Warning]')) {
      return 'Warn'
    }
    if (log.includes('[Warn]')) {
      return 'Warn'
    }
    if (log.includes('[Error]')) {
      return 'Error'
    }
    if (log.includes('[Read]')) {
      return 'Read'
    }
    if (log.includes('[Write]')) {
      return 'Write'
    }
    if (log.includes('[Listen]')) {
      return 'Listen'
    }
    if (log.includes('[Trace]')) {
      return 'Trace'
    }
    if (log.includes('[Debug]')) {
      return 'Debug'
    }
    if (log.includes('[Fatal]')) {
      return 'Fatal'
    }
    return 'unknown'
  }

  const initCallBackEvent = (socket: Socket) => {
    const getLogData = (data: any) => {
      const content = data.content ? data.content : data
      const logs = content.split('\n') || []
      const allLog: LogType[] = []
      logs.forEach((log: string) => {
        if (log) {
          const logType = getLogType(log)
          log = log.replaceAll(
            '<HighlightText>',
            '<HighlightText style="background:yellow;color: #000;"/>'
          )
          allLog.push({
            content: xss(log, {
              whiteList: {
                HighlightText: ['style'],
              },
            }),
            type: logType,
          })
        }
      })
      return allLog
    }
    if (type === LoggerTrack) {
      socket.on(SearchTraceLog, (data: any) => {
        files.value = data.files

        const logs: LogType[] = getLogData(data)
        historyTrackLogs.push(...logs)
      })
      socket.on(PrintTraceLog, (data: any) => {
        trackLogs.push({
          content: data,
          type: getLogType(data),
        })
      })
    } else {
      socket.on(PrintFlowLog, (data: string) => {
        logs.push({
          content: data,
          type: getLogType(data),
        })
      })
      socket.on(SearchFlowLog, (data: any) => {
        files.value = data.files
        const logs: LogType[] = getLogData(data)
        historyLogs.push(...logs)
      })
    }
    updateCanvasLogs()
  }

  const updateCanvasLogs = () => {
    if (t) {
      clearInterval(t)
    }
    t = setInterval(() => {
      if (!isStopRealLog.value) {
        if (type === LoggerTrack) {
          const log = isHistory.value ? historyTrackLogs : trackLogs
          printTraceLogs.value = [...log]
        } else {
          const log = isHistory.value ? historyLogs : logs
          printFlowLogs.value = [...log]
        }
      }
      nextTick(onScrollBottom)
    }, 1000)
  }

  const updateLogInfo = (logData: any) => {
    form.value.Keyword = logData.instanceID
    const data: any = {
      Keyword: logData.instanceID,
      highlightText: logData.highlightText,
      logFile: logData.logFile,
    }
    form.value.BeginTime = ''
    form.value.EndTime = ''
    form.value.LogLevel = 6
    onSearch(data)
  }

  const onSearch = (data?: FormType | boolean | undefined) => {
    if (typeof data !== 'object') {
      const BeginTime = form.value.BeginTime
      const EndTime = form.value.EndTime
      if (BeginTime && EndTime) {
        const beginTime = new Date(BeginTime).getTime()
        const endTime = new Date(EndTime).getTime()
        if (beginTime > endTime) {
          return ElMessage.warning('开始时间不能大于结束时间')
        } else if (endTime - beginTime > 1000 * 60 * 60 * 24 * 7) {
          return ElMessage.warning('时间范围限制七天')
        }
      }
    }
    if (isHistory.value) {
      type === LoggerTrack ? (historyTrackLogs = []) : (historyLogs = [])
    }
    if (typeof data !== 'boolean') {
      isHistory.value = true
    } else {
      data = form.value
    }
    data = data || form.value
    if (!data.BeginTime || !data.EndTime) {
      delete data.BeginTime
      delete data.EndTime
    }
    isStopRealLog.value = false
    refreshLogStatus(data)
  }

  const onClickExport = async () => {
    const socket = props.socket
    const fileData: string[] | null = isStopRealLog.value ? null : files.value
    const res = await socket?.call(ExportLog, {
      files: fileData?.length ? fileData : null,
      type: type === LoggerTrack ? TraceLog : FlowLog,
    })
    if (res) {
      const fileUrl = res.split('?')[1]
      const params = new URLSearchParams(fileUrl)
      const filename = params.get('filename')
      exportFile(res, {}, filename || uuidv4() + '.zip')
    }
  }

  const refreshLogStatus = (data?: FormType) => {
    const socket = props.socket

    if (isHistory.value) {
      socket?.call(
        type === LoggerTrack ? SearchTraceLog : SearchFlowLog,
        data || {}
      )
    } else {
      socket?.call(type === LoggerTrack ? PrintTraceLog : PrintFlowLog, {})
    }
  }

  const onSwitchChange = (v: boolean) => {
    form.value = {}
    isStopRealLog.value = isHistory.value
    const socket = props.socket
    socket?.call(type === LoggerTrack ? PrintTraceLog : PrintFlowLog, {
      IsHistory: isHistory.value,
    })
  }

  const stop = () => {
    logs = []
    trackLogs = []
    historyLogs = []
    historyTrackLogs = []
    printFlowLogs.value = []
    printTraceLogs.value = []
    if (t) {
      clearInterval(t)
    }
  }

  const onScrollBottom = () => {
    const dom = logContentRef.value
    if (dom && !isScroll.value) {
      dom.scrollTop = dom.scrollHeight - dom.clientHeight
    }
  }

  const initContentLog = () => {
    const dom = logContentRef.value
    dom?.addEventListener('scroll', (event: Event) => {
      if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
        isScroll.value = false
      } else {
        isScroll.value = true
      }
    })
  }

  ctx.expose({
    updateLogInfo,
    stop,
  })

  watch(
    () => props.headerParams,
    () => {
      logs = []
      trackLogs = []
      historyLogs = []
      historyTrackLogs = []
      printFlowLogs.value = []
      printTraceLogs.value = []
    }
  )

  watch(
    () => props.socket,
    (socket) => {
      initCallBackEvent(socket)
    }
  )

  onMounted(() => {
    form.value.LogLevel = 6
    form.value.BeginTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    form.value.EndTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    initContentLog()
  })
  return {
    form,
    isHistory,
    printFlowLogs,
    printTraceLogs,
    logContentRef,
    onSwitchChange,
    onSearch,
    onClickExport,
  }
}
