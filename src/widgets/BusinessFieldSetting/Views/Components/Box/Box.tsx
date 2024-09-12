import { defineComponent } from 'vue'
import styles from './Box.module.scss'
interface PropsType {
  height?: string // 高度
  title?: string // 标题
}
export default defineComponent((props: PropsType, { attrs }: any) => {
  return () => (
    <div>
      {attrs.title ? <span>{attrs.title}</span> : null}
      <div class={styles.box} style={{ height: attrs.height }}></div>
    </div>
  )
})
