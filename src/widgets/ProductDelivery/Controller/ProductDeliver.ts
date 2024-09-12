import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  watch,
  WatchEffect,
  nextTick,
} from 'vue'
import { useHook } from '@/libs/Hook/Hook'
import { Socket } from '@/libs/Socket/index'
import {
  Destroy,
  Init,
  SpeedTime,
  Subscribe,
  Update,
  Diff,
  Visibilitychange,
  DestroyMoveSpeed,
} from '../enum'
import { genSetInterval } from '@/utils'
import { Rect, Timer, TipTypeEnum } from '../Types/index.d'
import { cloneDeep, debounce, isNil } from 'lodash'

export const useProductDelivery = (props: any, emit: any) => {
  const { getComputedProp } = useHook(props, emit)
  const tip = ref('')
  const tipType = ref(TipTypeEnum.tip)
  const visible = ref(false)
  const containerRef = ref<HTMLDivElement>()
  const workStation = getComputedProp('workStation')
  const color = getComputedProp('color', '#9fcdff')
  const width = getComputedProp('width', 50)
  const height = getComputedProp('height', 30)
  const image = getComputedProp('image')
  const border = getComputedProp('border', '#ddd')
  const mode = getComputedProp('mode', 0)
  const rectDiff = getComputedProp('diff', Diff)
  const destroySpeed = getComputedProp('destroySpeed', DestroyMoveSpeed)
  const rectList = ref<Rect[]>([])
  const isCheckout = ref(false)
  const rectMap = ref<Record<string, Rect>>({})
  const containerConfig = ref<{
    dom?: HTMLDivElement
    width?: number
    height?: number
  }>({})
  let renderInstance: Timer
  let socket: Socket
  let watchRef: () => void
  const debuggerData = computed(() => cloneDeep(rectList.value).reverse())

  const onWorkSectionChange = () => {}

  const currentProductNum = computed(() => {
    const stackList = rectList.value.filter((item: Rect) => {
      return item.progress >= 100
    })
    return stackList.length
  })

  /**
   * 校验节点前面是否有节点到达终点
   */
  const checkEndHasRect = () => {
    const rect = rectList.value[0]
    if (rect.x === rect.endpoint || rect.destroy) {
      return true
    }
    if (rectList.value.length > 1) {
      return rectList.value.some((rect) => {
        if (rect.x === rect.endpoint) return true
        if (rect.destroy) return true
        return false
      })
    }
    return false
  }
  /**
   * 插入数据
   * @param data
   */
  const insertData = (data: Rect) => {
    const rect = Object.assign({}, data)
    rect.status = 1
    rectList.value.push(rect)
    rectMap.value[data.serialNumber] = rect
    rect.endpoint = getEndpointBySerialNumber(rect)
    rect.originEndpoint = getOriginEndpoint()
  }
  /**
   * 初始化
   * @param data
   */
  const initData = (data: Rect[]) => {
    if (!Array.isArray(data)) {
      rectList.value = [data]
    } else {
      rectList.value = data.filter((item: Rect) => {
        return item.progress <= 100
      })
    }
    rectList.value.forEach((item: Rect, index: number) => {
      item.index = index
      rectMap.value[item.serialNumber] = item
      const endpoint = getEndpointBySerialNumber(item)
      item.originEndpoint = getOriginEndpoint()
      item.endpoint = endpoint
      item.status = 1
      const { unit } = getUnit(endpoint, item)
      item.unit = unit
      if (item.progress >= 100) {
        item.x = endpoint
      } else {
        item.status = 0
      }
    })
    // nextTick(() => {
    //   initSvgDrag()
    // })
  }
  /**
   * 更新数据
   * @param data
   */
  const updateData = (data: Rect) => {
    if (!rectMap.value[data.serialNumber]) {
      insertData(data)
    }
    // 更新坐标x
    updatePosition(data)
  }
  const destroyData = (data: Rect) => {
    const { serialNumber } = data
    if (rectMap.value[serialNumber]) {
      const delRect = rectMap.value[serialNumber]

      // 2为边框的宽度
      delRect.endpoint = delRect.endpoint + width.value + 2
      // 当涉及销毁时，需要将节点向右统一挪动，速度增加
      delRect.unit = delRect.unit * destroySpeed.value
      delRect.destroy = true
      rectList.value.forEach((rect: Rect, index: number) => {
        if (rect.serialNumber === delRect.serialNumber) return
        rect.endpoint = rect.endpoint + rectDiff.value
      })
      const t = setTimeout(() => {
        delete rectMap.value[serialNumber]
        rectList.value = rectList.value.filter(
          (item) => item.serialNumber !== serialNumber
        )
        clearTimeout(t)
      }, 1000)
    }
  }
  const onDestroyData = (event: Event) => {
    const rect = rectList.value[0]
    destroyData(rect)
  }
  /**
   * 获取当前进度
   * @param rect
   */
  const getCurrentProgress = (rect: Rect, endpoint: number) => {
    const progress = Number(rect.x) / endpoint
    return Number((progress * 100).toFixed(2))
  }
  /**
   * 获取原始终点位置
   * @returns
   */
  const getOriginEndpoint = () => {
    if (!containerConfig.value.width) return 0
    const w = containerConfig.value.width
    const l = w - width.value - 2
    return l
  }

  /**
   * 获取终点坐标
   * @param data
   * @returns
   */
  const getEndpointBySerialNumber = (data: Rect | string) => {
    const isSerialNumber = typeof data === 'string'
    const serialNumber = isSerialNumber ? data : data.serialNumber
    const rect = isSerialNumber ? rectMap.value[serialNumber] : data
    if (!containerConfig.value.width) return 0
    if (!rect) return 0
    const list = rectList.value.filter((rect) => !rect.destroy)
    const index = list.findIndex(
      (item) => item.serialNumber === rect.serialNumber
    )
    const w = containerConfig.value.width
    const l = w - width.value - 2
    const number = index
    const diff = number > 0 ? number * rectDiff.value : 0
    if (checkEndHasRect()) {
      return l - diff
    }

    return l
  }

  /**
   * 获取单位距离
   * @param endpoint
   * @param data Rect
   * @returns
   */
  const getUnit = (endpoint: number, data: Rect) => {
    const { length, speed } = data
    const w = endpoint + width.value + 2
    const rectSpeed = (w * speed) / length
    const unit = rectSpeed * SpeedTime
    return { unit, w }
  }
  /**
   * 渲染节点
   * @param param0
   */
  const render = () => {
    renderInstance?.clear()

    renderInstance = genSetInterval(() => {
      rectList.value.forEach((rect: Rect) => {
        rect.status = 1
        const hasEnd = checkEndHasRect()
        const endpoint = hasEnd ? rect.endpoint : rect.originEndpoint
        if (rect.x === endpoint) return
        if (rect.x) {
          if (rect.x >= endpoint) {
            rect.x = endpoint
            return (rect.progress = 100)
          }
          if (rect.progress <= 100) {
            rect.x += rect.unit
          }
        }
      })
    }, SpeedTime)
    renderInstance.start()
  }
  /**
   * 更新坐标值
   * @param data
   * @returns
   */
  const updatePosition = (data: Rect) => {
    if (!containerConfig.value.width) return
    const { serialNumber } = data
    const progress = Number(data.progress.toFixed(2))
    const endpoint = getEndpointBySerialNumber(serialNumber)
    const { unit, w } = getUnit(endpoint, data)
    const rect: Rect = rectMap.value[serialNumber]
    // 当初始化时，更新坐标
    if ((rect && !rect.x) || isCheckout.value) {
      rect.x = progress * 0.01 * w - width.value
      isCheckout.value = false
    }
    if (progress == -1) {
      destroyData(data)
    } else {
      rect.unit = unit
      rect.progress = progress
      render()
    }
  }

  const initSocket = () => {
    if (workStation.value && !isNil(mode.value)) {
      const start = () => {
        socket = new Socket({
          url: '/hubs/v1/flow/product-delivery',
          name: '产品输送',
        })
        socket.on(Init, initData)
        socket.on(Update, updateData)
        socket.on(Destroy, destroyData)
        socket.connection.start().then(() => {
          socket.call(Subscribe, {
            WorkStationId: workStation.value,
            mode: mode.value,
          })
        })
      }
      const pThen = socket?.connection?.stop()
      if (pThen) {
        pThen.then(start)
      } else {
        start()
      }
    }
  }

  const handleVisibilityChange = () => {
    isCheckout.value = true
  }

  const onShowTip = (event: Event, item: Rect) => {
    event?.stopPropagation()
    tip.value = item.serialNumber
    visible.value = true
    tipType.value = TipTypeEnum.tip
  }

  const onClickSvgContent = (event: Event) => {
    event?.stopPropagation()
    if (rectList.value.length) {
      visible.value = true
      tipType.value = TipTypeEnum.table
    }
  }

  const getContainerSizeChange = (dom: HTMLElement) => {
    const fn = debounce((entries: any) => {
      const entry = entries[0]
      const borderBoxSize = entry.borderBoxSize[0] || {}
      const height = borderBoxSize.blockSize
      const width = borderBoxSize.inlineSize
      if (width && height) {
        containerConfig.value.width = width
        containerConfig.value.height = height
        initData(rectList.value)
      }
    }, 150)
    const resizeObserver = new ResizeObserver(fn)
    resizeObserver.observe(dom)
  }

  const initContainer = () => {
    const dom = containerRef.value
    if (!dom) return
    const style = window.getComputedStyle(dom)
    // 初始化容器
    containerConfig.value = {
      dom,
      width: parseFloat(style.width),
      height: parseFloat(style.height),
    }
    getContainerSizeChange(dom)
  }
  onUnmounted(() => {
    watchRef?.()
    document.removeEventListener(Visibilitychange, handleVisibilityChange)
    socket.off(Init, initData)
    socket.off(Update, updateData)
    socket.off(Destroy, destroyData)
    socket?.connection?.stop()
    renderInstance?.clear()
  })
  onMounted(() => {
    document.addEventListener(Visibilitychange, handleVisibilityChange)
    initContainer()
  })
  watchRef = watch(
    () => workStation.value,
    (id: string) => {
      id && initSocket()
    },
    { immediate: true }
  )

  return {
    workStation,
    color,
    image,
    width,
    height,
    containerRef,
    rectList,
    rectMap,
    containerConfig,
    currentProductNum,
    border,
    tip,
    visible,
    debuggerData,
    tipType,
    onClickSvgContent,
    onShowTip,
    onDestroyData,
    onWorkSectionChange,
  }
}
