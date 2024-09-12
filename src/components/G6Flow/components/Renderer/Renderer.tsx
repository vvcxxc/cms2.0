import {
  defineComponent,
  onMounted,
  ref,
  nextTick,
  watch,
  computed,
  SetupContext,
  Fragment,
  onUnmounted,
} from 'vue'
import styles from './Renderer.module.scss'
import { NODES } from '../../core/enum'
import G6, { Graph } from '@antv/g6'
import { behaviorMap } from '../../core/behavior'
import StartNode from '../Nodes/StartNode'
import EndNode from '../Nodes/EndNode'
import OrdinaryNode from '../Nodes/OrdinaryNode'
import Core from '../../core/Core'
import { injectStore } from '../../core/store'
import { fontSize, nodeFontSize } from '../Nodes'
import Menu from '../Menu/Menu'
import { cloneDeep } from 'lodash'
import ToolBar from '../ToolBar/ToolBarDefine'
import Tooltip from '../Tooltip/Tooltip'

interface PropsType {
  graphData: Record<string, any>
  [key: string]: any
  style: Record<string, any>
}

export default defineComponent<PropsType>({
  // @ts-ignore
  name: 'G6FlowRenderer',
  props: {
    graphData: {
      type: Object,
      required: true,
    },
    style: { type: Object, default: () => ({}) },
    minimap: { type: [Boolean, Object], default: false },
    isEdgeAnimation: { type: Boolean, default: false },
    dragCanvas: { type: Boolean, default: false },
    dragNode: { type: Boolean, default: false },
    activateRelations: { type: Boolean, default: false },
    zoomCanvas: { type: Boolean, default: false },
    clickSelect: { type: Boolean, default: false },
    createEdge: { type: Boolean, default: false },
    flowName: { type: String, default: '流程图' },
    editing: {
      type: Boolean,
      default: false,
    },
    contextMenu: {
      type: Array,
    },
    edgeContextMenu: {
      type: Array,
    },
  },
  // emits: Object.keys(behaviorMap),
  emits: [],
  setup(props: PropsType, { expose, attrs, slots, emit }: SetupContext) {
    const { graphEvent, flowMap, flowNodeMap } = injectStore()
    const core = new Core()

    const canvasConfig = computed(() => {
      return {
        ...attrs,
      }
    })
    let graph: Graph | null = null
    const graphConfig = {
      width: 0,
      height: 0,
    }
    /**
     * 注册边与节点
     */
    const batchRegister = () => {
      G6.registerNode(NODES.ACTIVITY, StartNode.options, 'single-node')
      G6.registerNode(NODES.END_ACTIVITY, EndNode.options, 'single-node')
      G6.registerNode(NODES.ACTIVITIES, OrdinaryNode.options, 'single-node')
    }
    /**
     * 自动布局
     */
    const autoLayout = () => {
      if (graph) {
        const layout = canvasConfig.value?.layout || {}
        graph.updateLayout({ ...layout })
      }
    }

    /**
     * 自动布局
     */
    const render = () => {
      if (graph) {
        const isEdit = props.graphData?.nodes?.[0].isEdit
        if (isEdit) {
          graph.destroyLayout()
          graph.changeData(props.graphData)
        }
        graph.render()

        setTimeout(zoomCanvas)
      }
    }
    /**
     * 缩放到中间
     */
    const zoomCanvas = (x?: number, y?: number) => {
      if (graph) {
        const { width, height } = graphConfig
        graph?.zoomTo(0.7, {
          x: x || width / 2 - 33,
          y: y || 0,
          // duration: 1000,
        })
      }
    }

    const getTools = () => {
      const toolBarInstance = new ToolBar({
        className: styles.toolBar,
        format: autoLayout,
        downName: props.flowName,
      })
      const g6ToolInstance = toolBarInstance.instanceToolBar()
      return g6ToolInstance
    }

    const getMiniMap = () => {
      const container = document.querySelector(
        `.${styles.miniMap}`
      ) as HTMLDivElement
      if (!container) return
      const minimap = new G6.Minimap({
        container,
      })
      return minimap
    }
    /**
     * 渲染逻辑流
     * @param graphData
     */
    const renderG6Graph = () => {
      if (!Object.keys(props.graphData).length) return
      if (graph) {
        graph.data(props.graphData)
      }
      render()
    }
    /**
     * 获取功能事件配置
     * @returns
     */
    const getBaseBehaviorConfig = () => {
      const events: string[] = []
      Object.entries(props || {}).forEach(([key, value]: any[]) => {
        if (behaviorMap[key] && value) {
          events.push(behaviorMap[key])
        }
      })
      return events
    }
    /**
     * 初始化渲染
     */
    const initializeRenderer = async () => {
      batchRegister()
      await renderG6Graph()
    }
    /**
     * 实例化LogicFlow
     */
    const instanceG6Graph = () => {
      const container = document.querySelector(
        `.${styles.renderer}`
      ) as HTMLElement
      if (!container) return
      const width = container.scrollWidth
      const height = container.scrollHeight || 500
      graphConfig.width = width
      graphConfig.height = height
      const defaultProps = core.setDefaultProps()
      const behavior = getBaseBehaviorConfig()
      const minimap = getMiniMap()
      const toolBar = props.editing ? getTools() : null
      const toolTip = Tooltip()
      const plugins = [minimap, toolBar, toolTip].filter((v) => v)
      graph = new G6.Graph({
        container,
        width,
        height,
        modes: {
          default: [...behavior],
        },
        // 设置为true，启用 redo & undo 栈功能
        enabledStack: true,
        plugins,
        ...defaultProps,
        ...canvasConfig.value,
      })

      graphEvent.init(graph, canvasConfig.value.layout)
      initializeRenderer()
    }
    /**
     * 获取当前LogicFlow实例
     * @returns
     */
    const getCurrentInstance = () => {
      return graph
    }

    const currentHeight = computed(() => {
      const height = canvasConfig.value?.height
      if (height) {
        return height + 'px'
      }
      return window.innerHeight + 'px'
    })

    const addNode = (node: any, position: any) => {
      if (!graph) return
      const point = graph?.getPointByClient(position.x, position.y)
      const config = {
        label: node.name,
        type: node.category,
      }
      const model = core.createNode(config, {
        x: point.x,
        y: point.y,
        properties: {
          Name: node.name,
          type: node.type,
        },
      })
      flowNodeMap.set(model.id, model)
      flowMap.set(node.name, model)
      graph?.addItem('node', model)
    }

    const getGraph = () => {
      return graph
    }

    watch(
      () => props.graphData,
      (v, oldV) => {
        if (v !== oldV && v) {
          instanceG6Graph()
        }
      }
    )

    watch(
      () => props.createEdge,
      () => {
        if (!props.createEdge) {
          graph?.removeBehaviors('create-edge', 'default')
        } else {
          graph?.addBehaviors('create-edge', 'default')
        }
      }
    )

    onMounted(() => {
      instanceG6Graph()
    })

    onUnmounted(() => {
      graph?.destroy()
      graphEvent?.onUnmounted()
    })

    expose({
      getGraph,
      render,
      autoLayout,
      getCurrentInstance,
      zoomCanvas,
      addNode,
    })
    return () => {
      const contextMenu =
        graphEvent.type.value === 'edge'
          ? props.edgeContextMenu
          : props.contextMenu
      return (
        <div
          class={styles.renderer}
          // onClick={(event: Event) => onCancelSelect(event)}
          style={{
            width: '100%',
            height: currentHeight.value,
            ...props.style,
          }}
        >
          <div class={styles.miniMap}></div>
          <div class={styles.toolBar}></div>
          {contextMenu && contextMenu.length > 0 && (
            <Menu
              contextMenu={contextMenu}
              visible={true}
              v-model:isShow={graphEvent.isShow.value}
              options={graphEvent.position.value}
              model={graphEvent.model.value}
            />
          )}
        </div>
      )
    }
  },
})
