import Icon from '@/components/Icon/Icon'
import styles from './Title.module.scss'
import { defineComponent } from 'vue'

export default defineComponent({
  name: '标题',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class={styles.title}>
        <Icon icon="icon" width={22} height={22} />
        <span class={styles.text}> {props.title}</span>
      </div>
    )
  },
})
