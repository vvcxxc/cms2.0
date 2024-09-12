import styles from './IconButton.module.scss'
import { defineComponent, SetupContext, computed } from 'vue'
import { CirclePlusFilled } from '@element-plus/icons-vue'

interface IconButtonProps {
  icon?: string
  type?: string
  popoverWidth?: number
  isPopover?: boolean
  [key: string]: any
}

export default defineComponent<IconButtonProps>({
  // @ts-ignore
  props: ['icon', 'type', 'popoverWidth', 'isPopover'],
  name: '图标按钮',
  emits: ['click'],
  setup(props: IconButtonProps, { attrs, slots, emit }: SetupContext) {
    const imgName = computed(() => props.icon)

    let status = attrs.status === undefined ? true : attrs.status
    let isAdd = attrs.status === 'add'
    const imgUrl = () =>
      new URL(`../../assets/images/${imgName.value}.png`, import.meta.url).href
    const BtnRender = () => {
      return (
        <el-button
          {...attrs}
          type={props.type}
          text
          class={{
            [styles.btn]: true,
            [styles.status]: attrs.disabled ? false : status,
          }}
          onClick={(evt: Event) => emit('click', evt)}
        >
          {imgName.value ? <img src={imgUrl()} class={styles.img} /> : null}
          <span style={props.type === 'primary' ? { color: '#5a84ff' } : {}}>
            {slots.default?.()}
          </span>
        </el-button>
      )
    }
    const Popover = ($props: any, { slots }: any) => {
      return (
        <el-popover
          placement="bottom-start"
          width={props.popoverWidth || 212}
          show-arrow={false}
          popper-class={styles.popover}
          persistent={false}
          popper-style={{
            marginTop: '-7px',
            padding: '10px',
          }}
          trigger="click"
          vSlots={{
            reference: BtnRender,
          }}
        >
          {slots.default?.()}
        </el-popover>
      )
    }
    return () => {
      if (slots.content) {
        return (
          <span>
            <Popover>{slots.content && slots.content()}</Popover>
          </span>
        )
      }
      return <BtnRender />
    }
  },
})
