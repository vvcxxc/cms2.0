import { defineComponent, SetupContext, onMounted, reactive, ref } from 'vue'
import styles from './LogicFlow.module.scss'
import {
  getFlowDataToXml,
  getJsonByXml,
  getLogicFLowStruct,
} from './core/transformHelp'
import { getFlowXml } from '@/api/logic-flow'
import LogicRenderer from './components/Renderer/Renderer'
import Canvas from './components/Canvas/Canvas'
import Theme from './components/Theme/Theme'
import NodeDrawer from './components/NodeDrawer/NodeDrawer'
import EdgeDrawer from './components/EdgeDrawer/EdgeDrawer'
import { injectStore } from './core/store'
import Empty from '../Empty/Empty'
import { FlowType } from './type'
interface NodeDrawerConfig {
  visible: boolean
  title: string
  node: Record<string, any>
}
export default defineComponent({
  name: 'LogicFlow',
  props: {
    flowType: {
      type: [String, Number],
      default: '',
    },
  },
  setup(props, { slots, attrs }: SetupContext) {
    const { lf } = injectStore()
    const graphData = ref<FlowType | null>(null)
    const logicRenderRef = ref<any>()

    const nodeDrawerConfig = reactive<NodeDrawerConfig>({
      visible: false,
      title: '节点配置',
      node: {},
    })
    const edgeDrawerConfig = reactive<NodeDrawerConfig>({
      visible: false,
      title: '条件配置',
      node: {},
    })
    const initData = async () => {
      const res = await getFlowXml(props.flowType)
      const json = getJsonByXml(res)
      graphData.value = getLogicFLowStruct(json)
    }

    const onAutoLayout = () => {
      logicRenderRef.value?.autoLayout()
    }
    /**
     * 节点双击
     * @param data
     */
    const onNodeDbClick = ({ data }: Record<string, any>) => {
      nodeDrawerConfig.visible = true
      nodeDrawerConfig.node = data
      nodeDrawerConfig.title = data.properties?.name || data.id || '节点配置'
    }

    const onEdgeDbClick = ({ data }: Record<string, any>) => {
      edgeDrawerConfig.visible = true
      edgeDrawerConfig.node = data
      edgeDrawerConfig.title = data.properties?.name || data.id || '条件配置'
    }

    const onView = (properties: Record<string, any>) => {
      onNodeDbClick({
        data: {
          id: properties.id,
          properties,
        },
      })
    }

    const onTransformXml = () => {
      if (graphData.value !== null) {
        getFlowDataToXml(graphData.value)
      }
    }

    onMounted(initData)

    return () => {
      if (!graphData.value) return <el-empty description="暂无数据" />

      return (
        <div class={styles.logicFlow}>
          <NodeDrawer
            lf={lf}
            title={nodeDrawerConfig.title}
            v-model={nodeDrawerConfig.visible}
            node={nodeDrawerConfig.node}
          ></NodeDrawer>
          <EdgeDrawer
            title={edgeDrawerConfig.title}
            v-model={edgeDrawerConfig.visible}
            node={edgeDrawerConfig.node}
          ></EdgeDrawer>
          <el-button
            onClick={onTransformXml}
            class={styles.xmlbeautify}
            size="small"
            type="primary"
          >
            xml
          </el-button>
          <el-button
            onClick={onAutoLayout}
            class={styles.beautify}
            size="small"
            type="primary"
          >
            一键美化
          </el-button>
          <Canvas grid={{ visible: true }} minimap={true}>
            <Theme
              snapline={{
                stroke: '#ff0000', // 对齐线颜色
                strokeWidth: 0.5, // 对齐线宽度
              }}
            />
            <LogicRenderer
              ref={logicRenderRef}
              graphData={graphData.value}
              onNodeDbClick={onNodeDbClick}
              onEdgeDbClick={onEdgeDbClick}
              onView={onView}
              // adjustEdge={true}
              isEdgeAnimation={true}
              // isSilentMode={true}
              // adjustNodePosition={true}
              // hideAnchors={true}
              // edgeTextEdit={false}
              // nodeTextEdit={false}
            ></LogicRenderer>
          </Canvas>
        </div>
      )
    }
  },
})
