import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp, defineComponent, computed } from 'vue'
import styles from './index.module.scss'
import Icon from '@/components/Icon/Icon'
import { injectStore } from '../../core/store'

interface NodeType {
  name: string
  value: string
  color?: string
}
export default defineComponent({
  name: 'BaseNode',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '#000',
    },
    background: {
      type: String,
      default: '#fff',
    },
    icon: {
      type: String,
    },
    width: {
      type: [String, Number],
      default: '206',
    },
    height: {
      type: [String, Number],
      default: '65px',
    },
  },
  setup(props) {
    const { selected, onSelectNode } = injectStore()

    const nodeFlows = computed(() => {
      const node = props.node?.source || {}

      const nodeBusiness: NodeType[] = []
      if (node.SplitType) {
        nodeBusiness.push({
          name: '迁出模式',
          value: node.SplitType,
          color: '#000',
        })
      }
      if (node.JoinType) {
        nodeBusiness.push({
          name: '迁入模式',
          value: node.JoinType,
          color: '#000',
        })
      }

      if (node.ExitMode) {
        nodeBusiness.push({
          name: '退出模式',
          value: node.ExitMode,
          color: '#000',
        })
      }
      if (node.EnterMode) {
        nodeBusiness.push({
          name: '进入模式',
          value: node.EnterMode,
          color: '#000',
        })
      }
      return nodeBusiness
    })

    return () => {
      const style = {
        background: props.background,
        color: props.color,
        width: props.width,
        height: props.height,
      }
      const node = props.node
      return (
        <div onClick={() => onSelectNode(node)} class={styles.flowNodeContent}>
          <div
            class={{
              [styles.flowNode]: true,
              [styles.flowNodeSelected]: node.id === selected.value,
            }}
          >
            <header style={style} class={styles.flowHeader}>
              <Icon icon={props.icon} width={20} height={20} />
              {node.name}
            </header>
            <main class={styles.flowNodeMain}>
              {nodeFlows.value.map((node: NodeType) => {
                return (
                  <div class={styles.flowInfo} style={{ color: node.color }}>
                    <label class={styles.label}>{node.name}：</label>
                    <span class={styles.info}>{node.value}</span>
                  </div>
                )
              })}
            </main>
          </div>
        </div>
      )
    }
  },
})
