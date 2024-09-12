import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp, defineComponent } from 'vue'
import styles from './index.module.scss'
import Icon from '@/components/Icon/Icon'
import { injectStore, emitter } from '../../core/store'

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
      default: '101px',
    },
    height: {
      type: [String, Number],
      default: '33px',
    },
    borderColor: {
      type: String,
      default: '#ccc',
    },
    type: {
      type: String,
      default: 'base',
    },
  },
  emits: ['view'],
  setup(props, { emit }) {
    const { selected, onSelectNode } = injectStore()
    const onClickDetail = () => {
      emitter.emit('view', props.node)
    }
    return () => {
      const style = {
        background: props.background,
        color: props.color,
        width: props.width,
        height: props.height,
        borderColor: props.borderColor,
      }
      const node = props.node
      return (
        <div
          onClick={(event: Event) => onSelectNode(node, event)}
          class={styles.baseNodeContent}
        >
          <div
            class={{
              [styles.baseNode]: true,
              [styles.baseNodeSelected]: node.id === selected.value,
            }}
            style={style}
          >
            {props.type === 'node' ? (
              <Icon
                class={styles.detail}
                icon="detail"
                width={15}
                height={15}
                onClick={onClickDetail}
              />
            ) : null}
            <Icon icon={props.icon} width={25} height={25} />
            <div class={styles.nodeText}>{node?.Name}</div>
          </div>
        </div>
      )
    }
  },
})
