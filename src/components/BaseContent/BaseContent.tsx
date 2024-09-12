import { defineComponent } from 'vue'
import styles from './BaseContent.module.scss'
import Icon from '../Icon/Icon'
export default defineComponent({
  name: '系统配置等Content',
  props: {
    title: {
      type: String,
      default: '标题',
    },
    icon: {
      type: String,
      default: '',
    },
    customClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots, attrs }) {
    return () => (
      <div class={styles.container}>
        <div class={styles.header}>
          <Icon width={22} height={22} icon={props.icon} />
          <div class={styles.title}>{props.title}</div>
        </div>
        <div class={styles.scrollContent}>
          <div class={[styles.content, props.customClass]}>
            {slots.default?.()}
          </div>
        </div>
        <footer class={styles.footer}>{slots.footer?.()}</footer>
      </div>
    )
  },
})
