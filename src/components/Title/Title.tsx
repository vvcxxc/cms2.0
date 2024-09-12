import { defineComponent, SetupContext } from 'vue'
import styles from './Title.module.scss'

export default defineComponent({
  name: 'Title',
  emits: ['click'],
  props: {
    desc: {
      type: String,
      default: '',
    },
    top: {
      type: Number,
      default: 0,
    },
    bottom: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { attrs, slots, emit }: SetupContext) {
    return () => (
      <h3
        style={{ margin: `${props.top}px 0 ${props.bottom}px 0` }}
        class={styles.title}
        onClick={() => emit('click')}
      >
        <div class={styles.label}>{slots.default && slots.default()}</div>
        {slots.content ? (
          <div class={styles.label}>{slots.content()}</div>
        ) : (
          <el-tooltip
            effect="dark"
            content={props.desc}
            placement="top"
            disabled={!props.desc}
            show-after={200}
          >
            <div class={styles.desc}>{props.desc}</div>
          </el-tooltip>
        )}
      </h3>
    )
  },
})
