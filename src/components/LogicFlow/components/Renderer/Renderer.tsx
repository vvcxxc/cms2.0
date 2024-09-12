import {
  defineComponent,
  onMounted,
  ref,
  nextTick,
  watch,
  computed,
  getCurrentInstance,
  SetupContext,
} from 'vue'
import LogicFlow, { BaseEdgeModel } from '@logicflow/core'
import '@logicflow/core/dist/style/index.css'
import Dagre from '../../core/dagre'
import { createStore } from '../../core/store'
import { MiniMap } from '@logicflow/extension'
import Curve from '../Edges/Curve'
import StartNode from '../Nodes/StartNode'
import EndNode from '../Nodes/EndNode'
import OrdinaryNode from '../Nodes/OrdinaryNode'
import { eventMap } from '../../core/event'
import {
  toLowerCaseFirstLetter,
  getNodeTargetLines,
} from '../../core/transformHelp'
import { isFunction } from 'lodash'
import styles from './Renderer.module.scss'
import { emitter } from '../../core/store'
import Empty from '@/components/Empty/Empty'

interface PropsType {
  graphData: Record<string, any>
  [key: string]: any
  style: Record<string, any>
}

export default defineComponent<PropsType>({
  // @ts-ignore
  name: 'LogicFlowRenderer',
  props: {
    graphData: {
      type: Object,
      required: true,
    },
    style: { type: Object, default: () => ({}) },
    minimap: { type: [Boolean, Object], default: false },
    isEdgeAnimation: { type: Boolean, default: false },
  },
  // emits: Object.keys(eventMap),
  setup(props: PropsType, { expose, attrs, slots, emit }: SetupContext) {
    const lfRef = ref()
    const lf = ref()
    const store = createStore()
    const { onCancelSelect, showEdgeAnimation } = store
    const logicFlowConfig = computed(() => {
      return {
        ...attrs,
      }
    })
    /**
     * 注册边与节点
     */
    const batchRegister = () => {
      lf.value.batchRegister([Curve, StartNode, EndNode, OrdinaryNode])
    }
    /**
     * 主题设置
     */
    const setTheme = () => {
      const theme = store.theme
      lf.value.setTheme(theme.value)
    }
    /**
     * 自动布局
     */
    const autoLayout = () => {
      if (lf.value?.extension?.dagre) {
        lf.value.extension.dagre.layout({
          nodesep: 40,
          ranksep: 30,
          // radial: true,
          // controlPoints: true,
        })
      }
    }

    const showMiniMap = () => {
      if (!props.minimap) return

      let params: {
        leftPosition?: number | string
        topPosition?: number | string
      } = {
        leftPosition: 20,
        topPosition: 20,
      }
      if (typeof props.minimap === 'object') {
        params = props.minimap
      }
      lf.value?.extension.miniMap.show(params.leftPosition, params.topPosition)
    }
    /**
     * 渲染逻辑流
     * @param graphData
     */
    const renderLogicFlow = () => {
      if (!Object.keys(props.graphData).length) return
      lf.value.render(props.graphData)

      return nextTick(autoLayout)
    }
    /**
     * 初始化渲染
     */
    const initializeRenderer = async () => {
      batchRegister()
      setTheme()
      await renderLogicFlow()
      showMiniMap()

      initializeEvent()
    }
    /**
     * 实例化LogicFlow
     */
    const instanceLogicFlow = () => {
      if (!Object.keys(props.graphData).length) return
      lf.value = new LogicFlow({
        container: lfRef.value,
        plugins: [Dagre, MiniMap],
        ...logicFlowConfig.value,
      })
      store.lf.value = lf.value
      initializeRenderer()
    }

    /**
     * 注册事件
     */
    const initializeEvent = () => {
      const eventBox: string[] = []
      const eventNameMap: Record<string, any> = {}
      // 注册节点事件
      emitter.on('view', (node: any) => emit('view', node))
      // click事件单独做处理
      lf.value?.on(eventMap.nodeClick, (...arg: any) => {
        const { data } = arg[0]
        emit(eventMap.nodeClick, ...arg)
        if (props.isEdgeAnimation) {
          showEdgeAnimation(data)
        }
      })
      Object.entries(attrs).forEach(([eventName, fn]) => {
        if (eventName.includes('on')) {
          const name = toLowerCaseFirstLetter(eventName.replace('on', ''))
          eventNameMap[name] = fn
          if (eventMap.nodeClick !== name) {
            eventBox.push(name)
          }
        }
      })

      Object.entries(eventMap).forEach(([key, eventName]: string[]) => {
        if (eventBox.includes(key)) {
          lf.value?.on(eventName, (...arg: any) => {
            emit(key, ...arg)
          })
        }
      })
    }
    /**
     * 获取当前LogicFlow实例
     * @returns
     */
    const getCurrentInstance = () => {
      return lf.value
    }

    watch(
      () => props.graphData,
      (v, oldV) => {
        if (v !== oldV && v) {
          instanceLogicFlow()
        }
      }
    )

    onMounted(() => {
      instanceLogicFlow()
    })

    expose({
      autoLayout,
      getCurrentInstance,
    })
    return () => {
      return (
        <div
          class={styles.renderer}
          onClick={(event: Event) => onCancelSelect(event)}
          ref={lfRef}
          style={{ width: '100%', height: '100%', ...props.style }}
        >
          {slots.default?.()}
        </div>
      )
    }
  },
})
