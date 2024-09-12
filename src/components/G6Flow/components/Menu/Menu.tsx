import { defineComponent, ref, computed } from 'vue'
import Icon from '@/components/Icon/Icon'
import styles from './Menu.module.scss'
import './index.scss'
import { isNil } from 'lodash'

interface contextMenuItemType {
  current: Record<string, any> | null
  options: any
}
interface CurrentType {
  row: any
  index: number
}

interface ItemType {
  label: string
  icon: string
  fn: (c: CurrentType) => void
  disabled?: boolean
  divided?: boolean
}

export default defineComponent({
  name: '右键菜单',
  props: {
    contextMenu: {
      type: Array,
    },
    graph: {
      type: Object,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => {},
    },
    model: {
      type: Object,
      default: () => {},
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const menuRef = ref<any>()
    // const contextMenu: ItemType[] | unknown[] = props.contextMenu || []
    const contextMenu = computed(() => {
      return props.contextMenu || []
    })
    //  [
    //   {
    //     label: '复制',
    //     fn: (c: CurrentType) => {},
    //     divided: true,
    //     icon: 'o',
    //   },
    //   {
    //     label: '删除',
    //     fn: (c: CurrentType) => {},
    //     divided: true,
    //     disabled: false,
    //     icon: 'up',
    //   },
    //   {
    //     label: '查看属性',
    //     fn: (c: CurrentType) => {},
    //     divided: true,
    //     disabled: false,
    //     icon: 'up',
    //   },
    // ]

    const visible = computed({
      get: () => {
        return props.visible
      },
      set(value) {
        emit('update:visible', value)
      },
    })

    const isShow = computed({
      get: () => {
        return props.isShow
      },
      set(value) {
        emit('update:isShow', value)
      },
    })

    const contextMenuConfig = computed(() => {
      return {
        options: {
          zIndex: 2000,
          minWidth: 132,
          x: 0,
          y: 0,
          ...props.options,
        },
      }
    })

    const contextDisabled: any = computed(() => {
      return (item: any) => {
        if (item.disabled !== undefined) {
          if (!isNil(item.disabled?.value)) {
            return item.disabled?.value
          } else {
            return item.disabled
          }
        }
        return false
      }
    })
    /**
     * 菜单
     * @param item
     */
    const onHandleMenuItem = (event: TouchEvent | MouseEvent, item: any) => {
      event?.stopPropagation()
      item.fn && item.fn(props.model, isShow)
    }
    return () => {
      return isShow.value ? (
        <context-menu
          // v-if="contextMenu?.length > 0"
          ref={menuRef}
          v-model:show={visible.value}
          options={contextMenuConfig.value.options}
        >
          {
            // @ts-ignore
            contextMenu.value.map((item: ItemType, index: number) => {
              return (
                <span
                  onTouchstart={(event) => onHandleMenuItem(event, item)}
                  onClick={(event) => onHandleMenuItem(event, item)}
                >
                  <context-menu-item
                    key={index}
                    label={item.label}
                    disabled={!!contextDisabled.value(item)}
                    style={{
                      filter: contextDisabled.value(item)
                        ? 'opacity(0.4)'
                        : 'none',
                    }}
                  >
                    <div
                      style={{
                        cursor: !contextDisabled.value(item)
                          ? 'pointer'
                          : 'not-allowed',
                      }}
                      class={styles.contextMenuItemC}
                    >
                      <div style="width: 16px; margin-right: 7px">
                        <Icon
                          height={16}
                          class={styles.iconBox}
                          icon={item.icon}
                        />
                      </div>
                      <div class={styles.labelC}>{item.label}</div>
                    </div>
                  </context-menu-item>
                </span>
              )
            })
          }
        </context-menu>
      ) : null
    }
  },
})
