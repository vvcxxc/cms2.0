import { computed, defineComponent, ref, onMounted, PropType } from 'vue'
import styles from './Tab.module.scss'
import TabPane from './TabPane'
import get from 'lodash/get'
import type { TabsPaneContext } from 'element-plus'

export default defineComponent({
  name: 'Tab',
  emits: ['tab', 'update:active'],
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: [] as any[],
    },
    size: {
      type: String,
      default: '',
    },
    active: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'list',
    },
  },
  setup(props, ctx) {
    const clN = {
      list: styles.csTabs,
    }
    const active = computed({
      get() {
        return props.active || props.data[0]?.name || '1'
      },
      set(val: string) {
        ctx.emit('update:active', val)
      },
    })
    const handleClick = (tab: TabsPaneContext, event: Event) => {
      ctx.emit('tab', tab.paneName)
    }

    const data = computed(() => {
      return (
        props.data.filter((item) => {
          return !item.hidden
        }) || []
      )
    })

    return () => {
      const className = clN[props.type] || styles.csDefaultTabs
      return (
        <el-tabs
          class={{
            [styles['--small']]: props.size === 'small',
            [className]: true,
          }}
          model-value={active.value}
          size={props.size}
          onTabClick={handleClick}
        >
          {!ctx.slots.default
            ? data.value.map((item: any, index) => {
                return (
                  <TabPane {...item}>
                    <item.component />
                  </TabPane>
                )
              })
            : ctx.slots.default?.()}
        </el-tabs>
      )
    }
  },
})
