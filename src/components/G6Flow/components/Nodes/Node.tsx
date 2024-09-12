import { defineComponent } from 'vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'Node',
  props: {
    cfg: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return () => {
      return <div class={styles.nodeContent}>Node</div>
    }
  },
})
