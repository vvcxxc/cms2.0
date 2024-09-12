import G6, { Graph } from '@antv/g6'
import {} from './store'
import { onUnmounted, ref } from 'vue'
import { cloneDeep } from 'lodash'
import { fontSize } from '../components/Nodes'

export default class GraphEvent {
  graph: Graph | null = null
  position = ref<{ x: number; y: number }>({ x: 0, y: 0 })
  visible = ref<boolean>(false)
  isShow = ref<boolean>(false)
  model = ref<any>(null)
  item = ref<any>(null)
  type = ref<string>('')
  isContextMenu = ref<boolean>(false)
  layout = {}
  isChange = false
  touchTime = 0
  touchMoveTime = 0
  currentTouchTime = 0
  touchEvent = {} as any
  currentPosition: null | {
    x: number
    y: number
    controlPointsMap?: Record<
      string | number,
      Array<{
        x: number
        y: number
      }>
    >
  } = null
  constructor() {
    this.nodeContextMenu = this.nodeContextMenu.bind(this)
    this.edgeContextMenu = this.edgeContextMenu.bind(this)
    this.edgeMouseOver = this.edgeMouseOver.bind(this)
    this.edgeClick = this.edgeClick.bind(this)
    this.onNodeMouseMove = this.onNodeMouseMove.bind(this)
    this.onNodeTouchStart = this.onNodeTouchStart.bind(this)
    this.onNodeTouchEnd = this.onNodeTouchEnd.bind(this)
    this.onNodeTouchmove = this.onNodeTouchmove.bind(this)
    this.cancelEvent = this.cancelEvent.bind(this)
    document.addEventListener('touchstart', this.cancelEvent, true)
    document.addEventListener(
      'click',
      (...arg) => this.cancelEvent(...arg, 'click'),
      true
    )
  }
  cancelEvent(e?: Event, type?: string) {
    this.touchMoveTime = 0
    if (!type) {
      const t = setTimeout(() => {
        this.isShow.value = false
        clearTimeout(t)
      }, 200)
    } else {
      this.isShow.value = false
    }
  }

  onUnmounted() {
    document.removeEventListener('touchstart', this.cancelEvent, true)
    document.removeEventListener('click', this.cancelEvent, true)
  }

  init(graph: Graph, layout: Record<string, any>) {
    this.touchMoveTime = 0
    this.touchTime = 0
    this.currentTouchTime = 0
    this.graph = graph
    this.layout = layout
    this.graph.on('canvas:touchmove', this.onNodeTouchmove)
    this.graph.on('node:touchstart', this.onNodeTouchStart)
    this.graph.on('edge:touchstart', this.onNodeTouchStart)
    this.graph.on('touchend', this.onNodeTouchEnd)
    this.graph.on('node:contextmenu', this.nodeContextMenu)
    this.graph.on('edge:contextmenu', this.edgeContextMenu)
    this.graph.on('node:mouseenter', (...arg) => {
      this.currentPosition = null
      this.nodeMouseOver(...arg, true)
    })
    this.graph.on('node:mouseleave', (...arg) =>
      this.nodeMouseOver(...arg, false)
    )

    this.graph.on('edge:mouseenter', (...arg) =>
      this.edgeMouseOver(...arg, true)
    )
    this.graph.on('edge:mouseleave', (...arg) =>
      this.edgeMouseOver(...arg, false)
    )
    this.graph.on('edge:click', (...arg) => this.edgeClick(...arg))
  }
  onNodeTouchmove(event: TouchEvent) {
    this.touchTime = 0
    this.touchMoveTime++
    if (this.touchMoveTime < 20) {
      this.touchTime = this.currentTouchTime
    }
  }
  onNodeTouchEnd(event: Event | any) {
    event.stopPropagation()
    if (this.touchTime !== 0) {
      const now = Date.now()
      const time = now - this.touchTime
      if (time > 300) {
        this.nodeContextMenu(this.touchEvent)
      }
    }
    this.touchTime = 0
    this.currentTouchTime = 0
  }
  onNodeTouchStart(event: Event | any) {
    this.touchEvent = event
    this.touchTime = Date.now()
    this.currentTouchTime = Date.now()
    event.stopPropagation()
  }
  contextMenuSetting(event: any | Event) {
    event?.preventDefault()
    this.model.value = event.item?.getModel()
    this.position.value = {
      x: event.clientX,
      y: event.clientY,
    }
    this.visible.value = true
    this.isShow.value = true
    this.item.value = event.item
    this.type.value = event.item?._cfg.type
  }
  nodeContextMenu(event: any | Event) {
    this.item.value = event.item
    this.contextMenuSetting(event)
  }
  edgeContextMenu(event: any | Event) {
    this.item.value = event.item
    this.isContextMenu.value = true
    this.graph?.setItemState(event.item, 'hover', true)
    this.contextMenuSetting(event)
  }
  edgeMouseOver(event: any | Event, type: boolean) {
    const { item } = event
    this.item.value = event.item
    if (!this.isContextMenu.value) {
      const model = item.getModel() || {}
      const style = model.style || {}
      if (!style['text-shape']) {
        style['text-shape'] = {
          fontSize: fontSize,
        }
      }
      this.graph?.setItemState(item, 'hover', type)
    }
  }
  nodeMouseOver(event: any | Event, type: boolean) {
    this.graph?.setItemState(event.item, 'active', type)
  }
  edgeClick(event: any | Event) {
    const { item } = event
    this.item.value = event.item
    this.graph?.setItemState(item, 'selected', true)
  }
  clearAllState() {
    // 清除 'active' 与 'hover' 状态
    this.isContextMenu.value = false
    this.item.value?.clearStates(['actived', 'hover', 'selected'])
    this.item.value = null
  }
  onNodeMouseMove(nodeData: any) {
    if (nodeData.name !== 'drag' && !this.currentPosition) {
      const model = nodeData.item.getModel() || {}
      return (this.currentPosition = {
        x: model.x,
        y: model.y,
      })
    }
    if (this.currentPosition && nodeData.name === 'drag') {
      const edges = nodeData.item.getEdges()
      const model = nodeData.item.getModel() || {}
      const { x, y } = model
      const diffX = x - this.currentPosition.x
      const diffY = y - this.currentPosition.y
      edges.forEach((edge: any, index: number) => {
        const edgeModel = cloneDeep(edge.getModel() || {})

        if (
          this.currentPosition &&
          !this.currentPosition?.controlPointsMap?.[index]
        ) {
          const controlPointsMap = this.currentPosition.controlPointsMap || {}
          controlPointsMap[index] = edgeModel.controlPoints || []
          this.currentPosition.controlPointsMap = controlPointsMap
        }
        const controlPoints = cloneDeep(
          this.currentPosition?.controlPointsMap?.[index] || []
        )

        controlPoints.forEach((point: { x: number; y: number }) => {
          point.x = point.x + diffX
          point.y = point.y + diffY
        })
        edgeModel.controlPoints = controlPoints
        this.graph?.updateItem(edge, edgeModel)
        // edgeModel.controlPoints = []
      })
    }
    // this.graph?.refreshPositions()
    // console.log(edges, this.currentPosition, 'node:mousedown1-2-2-2-11-2210210')
  }
}
