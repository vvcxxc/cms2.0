import { defineComponent } from 'vue'
import styles from './Empty.module.scss'
export default defineComponent({
  name: '空数据',
  props: {
    text: {
      type: String,
      default: '暂无数据',
    },
  },
  setup(props, { attrs, slots, emit }) {
    return () => <div class={styles.empty}>{props.text}</div>
  },
})
