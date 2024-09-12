import { computed, ref, defineComponent } from 'vue'
import styles from './Tools.module.scss'
import Icon from '@/components/Icon/Icon'

export default defineComponent({
  props: {
    nodeData: {
      type: Array,
      default: () => [],
    },
    edgeData: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['dragstart', 'edgeClick'],
  setup(props, ctx) {
    const lineMap: Record<string, any> = {
      BusinessTransition: 'b',
      ChoiceTransition: 'duoxuan-line',
      SortableTransition: 'sortMove',
      FiltrableTransition: 'fitl',
    }
    const visible = ref(false)
    const selected = ref('')
    let flag = false
    const onClickBox = (event: MouseEvent | TouchEvent) => {
      if (!flag) {
        event.stopPropagation()
        visible.value = !visible.value
      }
    }
    const onTouchstart = (event: TouchEvent) => {
      flag = true
      visible.value = !visible.value
      event.stopPropagation()
    }
    const onTouchstartBox = (event: TouchEvent) => {
      event.stopPropagation()
    }
    const onClickEdge = (item: any) => {
      selected.value = item.type === selected.value ? null : item.type
      ctx.emit('edgeClick', selected.value)
    }
    const nodeData = computed(() => {
      return props.nodeData || []
    })
    const edgeData = computed(() => {
      return props.edgeData || []
    })

    const onDragstart = (item: Record<string, any>, event: DragEvent) => {
      ctx.emit('dragstart', item)
    }

    document.addEventListener('click', () => {
      if (visible.value && !flag) {
        visible.value = false
      }
    })
    document.addEventListener('touchstart', () => {
      if (visible.value) {
        visible.value = false
      }
    })

    return () => {
      return (
        <div>
          {/* 工具箱 */}
          <div class={[styles.tools]}>
            <el-popover
              placement="right-end"
              width={365}
              trigger="click"
              popper-class={styles.popover}
              visible={visible.value}
              v-slots={{
                reference: () => {
                  return (
                    <div
                      onClick={onClickBox}
                      onTouchstart={onTouchstart}
                      class={{
                        [styles.box]: true,
                        [styles.nodeBox]: true,
                        [styles.boxShow]: visible.value,
                      }}
                    >
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="活动节点"
                        placement="right"
                      >
                        <div
                          class={{
                            [styles.icon]: true,
                            [styles.selectNode]: visible.value,
                          }}
                        >
                          <Icon
                            class={styles.img}
                            icon="node1"
                            width={20}
                            height={20}
                            draggable={false}
                          ></Icon>
                        </div>
                      </el-tooltip>
                    </div>
                  )
                },
              }}
            >
              <div
                class={{
                  [styles.nodes]: true,
                }}
                onTouchstart={onTouchstartBox}
              >
                <ul class={styles.ul}>
                  {nodeData.value.map((item: any, index: number) => {
                    return (
                      <li
                        onDragstart={(event) => onDragstart(item, event)}
                        draggable
                        key={item.type}
                        class={styles.li}
                      >
                        <Icon
                          class={styles.icon}
                          icon="node"
                          width={15}
                          height={15}
                        ></Icon>

                        {item.name}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </el-popover>

            {edgeData.value.map((item: any, index: number) => {
              return (
                <div
                  key={item.type}
                  onClick={() => onClickEdge(item)}
                  class={{
                    [styles.box]: true,
                    [styles.boxLi]: true,
                    [styles.boxShow]: selected.value === item.type,
                  }}
                >
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content={item.name}
                    placement="right"
                  >
                    <div
                      class={{
                        [styles.icon]: true,
                        [styles.selectNode]: selected.value === item.type,
                      }}
                    >
                      <Icon
                        class={{
                          [styles.img]: true,
                        }}
                        draggable={false}
                        icon={lineMap[item.type]}
                        width={20}
                        height={20}
                      ></Icon>
                    </div>
                  </el-tooltip>

                  {/* <span>{item.name}</span> */}
                </div>
              )
            })}
          </div>
          {/* 节点 */}
        </div>
      )
    }
  },
})
