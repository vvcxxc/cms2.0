import {
  defineComponent,
  SetupContext,
  onMounted,
  reactive,
  ref,
  computed,
} from 'vue'
import styles from './G6Flow.module.scss'
import {
  fittingString,
  getFlowDataToXml,
  getJsonByXml,
  getLogicFLowStruct,
} from './core/transformHelp'
import { getFlowXml, getFlowData, saveFlowData } from '@/api/logic-flow'
import LogicRenderer from './components/Renderer/Renderer'
import Canvas from './components/Canvas/Canvas'
import { createStore } from './core/store'
import { FlowType } from './type'
import Tools from './components/Tools/Tools'
import { cloneDeep, uniqBy } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import NodeDrawer from './components/NodeDrawer/NodeDrawer'
import EdgeDrawer from './components/EdgeDrawer/EdgeDrawer'
import { nodeFontSize } from './components/Nodes'
import { ConditionType } from './core/enum'
import { ElMessage } from 'element-plus'

interface NodeDrawerConfig {
  visible: boolean
  title: string
  model: Record<string, any>
}
export default defineComponent({
  name: 'G6Flow',
  props: {
    flowType: {
      type: [String, Number],
      default: '',
    },
    height: {
      type: [String, Number],
      default: 750,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    flowName: {
      type: String,
    },
  },
  setup(props, { slots, attrs, expose }: SetupContext) {
    const { graphEvent } = createStore()
    const graphData = ref<FlowType | null>(null)
    const g6RenderRef = ref<any>()
    const selectedEdgeToolType = ref<string>('')
    const flowConfig: {
      type?: number
      version?: number
    } = {}
    const isEdit = computed(() => {
      return props.isEdit
    })
    const nodeData = ref<Record<string, any>[]>([])
    const edgeData = ref<Record<string, any>[]>([])
    const nodeItem = ref<Record<string, any> | null>(null)
    const nodeDrawerConfig = reactive<NodeDrawerConfig>({
      visible: false,
      title: '节点配置',
      model: {},
    })

    const sortNodeDataUniq = (Activities: any[]) => {
      const data = Activities.sort(
        (a: { sort: number }, b: { sort: number }) => {
          return a.sort - b.sort
        }
      )
      return uniqBy(data, 'type')
    }
    const initData = async () => {
      graphData.value = null
      const res = await getFlowXml(props.flowType)
      flowConfig.type = res.type
      flowConfig.version = res.version
      const json = getJsonByXml(res.content)
      graphData.value = getLogicFLowStruct(json)
      const data = await Promise.all([
        getFlowData('Activities'),
        getFlowData('Transitions'),
      ])

      const Activities = sortNodeDataUniq(data[0].Activities)
      const Transitions = sortNodeDataUniq(data[1].Transitions)
      nodeData.value = Activities
      edgeData.value = Transitions
    }

    const onAutoLayout = () => {
      g6RenderRef.value?.autoLayout()
    }

    const onDrop = (event: DragEvent) => {
      if (nodeItem.value) {
        g6RenderRef.value?.addNode(nodeItem.value, {
          x: event.x,
          y: event.y,
        })
      }
    }

    const onDragstart = (node: Event) => {
      nodeItem.value = node
    }

    const onToolsEdgeClick = (type: string) => {
      selectedEdgeToolType.value = type
    }

    const onCopy = (model: any, isShow: any) => {
      if (g6RenderRef.value) {
        const graph = g6RenderRef.value.getGraph()
        const newModel = cloneDeep(model)
        const label = newModel.properties.Name + '_副本'
        newModel.id = uuidv4()
        newModel.x = model.x + 10
        newModel.y = model.y + 10
        newModel.name = label
        newModel.properties.Name = label
        newModel.label = fittingString(label, 195, nodeFontSize + 2)
        graph?.addItem('node', newModel)
      }
      isShow.value = false
    }

    const onDelete = (model: any, isShow: any) => {
      if (g6RenderRef.value) {
        const graph = g6RenderRef.value.getGraph()
        const item = graph?.findById(model.id)
        graph?.removeItem(item)
      }
      isShow.value = false
    }

    const onViewDialog = (model: any, isShow: any) => {
      nodeDrawerConfig.visible = true
      nodeDrawerConfig.model = model
      isShow.value = false
    }

    // const onConfirm = () => {
    //   clear()
    // }
    // const onClose = () => {
    //   clear()
    // }
    const clear = () => {
      nodeDrawerConfig.model = {}
      graphEvent.clearAllState()
    }

    const graphSave = async () => {
      const graph = g6RenderRef.value.getGraph()
      const { nodes, edges } = graph.save()
      const xml = getFlowDataToXml({ nodes, edges })
      const data = {
        ...flowConfig,
        content: xml,
      }

      await saveFlowData(data)
      ElMessage.success('保存成功')
    }

    expose({ graphSave })
    onMounted(initData)

    return () => {
      if (!graphData.value) return <el-empty description="暂无数据" />
      const Drawer = graphEvent.type.value === 'edge' ? EdgeDrawer : NodeDrawer
      const contextMenu = computed<any[]>(() => {
        const menu = [
          {
            label: '查看属性',
            fn: onViewDialog,
            divided: true,
            disabled: false,
            icon: 'viewProps',
          },
        ]
        if (isEdit.value) {
          menu.push({
            label: '删除',
            fn: onDelete,
            divided: true,
            disabled: false,
            icon: 'delete-menu',
          })
        }
        return menu
      })
      return (
        <div class={styles.logicFlow}>
          {isEdit.value ? (
            <Tools
              nodeData={nodeData.value}
              edgeData={edgeData.value}
              onDragstart={onDragstart}
              onEdgeClick={onToolsEdgeClick}
            />
          ) : null}

          <Drawer
            title={nodeDrawerConfig.title}
            v-model={nodeDrawerConfig.visible}
            isEdit={isEdit.value}
            model={
              nodeDrawerConfig.visible ? nodeDrawerConfig.model : undefined
            }
            onConfirm={clear}
            onClose={clear}
            graph={g6RenderRef.value?.getGraph()}
            type={graphEvent.type.value}
            edgeData={edgeData.value}
          ></Drawer>
          <Canvas
            onDrop={onDrop}
            grid={{ visible: true }}
            minimap={true}
            height={props.height}
          >
            <LogicRenderer
              ref={g6RenderRef}
              graphData={graphData.value}
              drag-node={isEdit.value}
              click-select={isEdit.value}
              editing={isEdit.value}
              zoom-canvas
              drag-canvas
              edgeType={!!selectedEdgeToolType.value}
              create-edge={!!selectedEdgeToolType.value}
              edgeContextMenu={contextMenu.value}
              flowName={props.flowName}
              contextMenu={[
                {
                  label: '复制',
                  fn: onCopy,
                  divided: true,
                  icon: 'copy',
                },
                ...contextMenu.value,
              ]}
            ></LogicRenderer>
          </Canvas>
        </div>
      )
    }
  },
})
