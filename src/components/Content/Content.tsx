import { defineComponent } from 'vue'
import styles from './Content.module.scss'
export default defineComponent({
  name: '通用Content',
  props: {
    title: {
      type: String,
      default: '标题',
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class={styles.container}>
        <div class={styles.title}>{props.title}</div>
        <div class={styles.content}>{slots.default?.()}</div>
      </div>
    )
  },
})
