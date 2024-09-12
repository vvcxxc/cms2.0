import { defineComponent } from 'vue'
import styles from './Box.module.scss'
interface PropsType {
  height?: string // 高度
  title?: string // 标题
  padding?: string // 内边距
  space?: string // 间距
  description?: string // 描述
  hideBorder?: boolean // 是否显示边框
  backgroundColor?: string // 背景色
  width?: string // 宽度
}
export default defineComponent(
  (props: PropsType, { attrs, slots }: { attrs: PropsType; slots: any }) => {
    const style = attrs.padding ? { padding: attrs.padding } : {}
    return () => (
      <div style={attrs.space ? { marginBottom: attrs.space } : {}}>
        {attrs.title ? (
          <div class={styles.title}>
            {attrs.title}
            {attrs.description ? (
              <span class={styles.description}>{attrs.description}</span>
            ) : null}
          </div>
        ) : null}
        <div
          class={styles.box}
          style={{
            width: attrs.width,
            height: attrs.height,
            border: attrs.hideBorder ? 'none' : '1px solid #e1e1e1',
            'background-color': attrs.backgroundColor,
            ...style,
          }}
        >
          {slots.default?.()}
        </div>
      </div>
    )
  }
)
