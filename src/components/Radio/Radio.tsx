import { defineComponent, computed, SetupContext } from 'vue'
import styles from './Radio.module.scss'
import Empty from '../Empty/Empty'
import Icon from '../Icon/Icon'
interface OptionType {
  label: string
  value: string
  name: string
}

interface DataType {
  name?: string
  label?: string
  value?: string
  description?: string
  type?: string
}

interface TagProps {
  data: DataType[]
  options: OptionType[]
  modelValue: string
  [key: string]: any
}

export default defineComponent<TagProps>({
  // @ts-ignore
  name: 'Tag',
  emits: ['click', 'update:modelValue', 'change', 'update:data'],
  props: {
    data: {
      type: [Array, Object],
      default: null,
    },
    options: {
      type: Array,
      default: null,
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    trigger: {
      type: String,
      default: 'hover',
    },
    showClose: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: '100px',
    },
  },
  setup(props: TagProps, { attrs, slots, emit }: SetupContext) {
    const modelData = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })
    const data = computed({
      get() {
        return props.data
      },
      set(value) {
        emit('update:data', value)
      },
    })
    /**
     * 根据value查找label
     * @param value
     * @returns
     */
    const findOptionLabelByValue = (value: string) => {
      const item: any = props.options.find((item) => item.value === value)
      return item?.label || item?.name || ''
    }
    /**
     * 选择
     * @param v
     */
    const onCommand = (v: any) => {
      modelData.value = findOptionLabelByValue(v) || v
      emit('change', v)
    }
    /**
     * 当v-model:data时，生效
     */
    const onClose = (item: DataType, evt: Event) => {
      evt?.stopPropagation()
      data.value = data.value.filter((i) => i !== item)
    }

    /**
     * click
     * @param evt Event
     */
    const onClick = (evt: Event) => {
      evt?.stopPropagation()
      emit('click', evt)
    }

    return () => {
      // 多tag情况，传data[]
      if (Array.isArray(props.data)) {
        return props.data.map((item: DataType, index: any) => {
          return (
            <div
              class={styles.tag}
              style="margin-right: 5px;cursor: initial;"
              key={index}
              onClick={onClick}
            >
              {item.name || item.label || item.description || item.type}
              {props.showClose ? (
                <Icon
                  class={styles.tagClose}
                  icon="tag_close"
                  width={8}
                  height={8}
                  onClick={(evt) => onClose(item, evt)}
                />
              ) : null}
            </div>
          )
        })
      }
      // 下拉选择hover
      if (Array.isArray(props.options)) {
        return (
          <el-tooltip
            effect="dark"
            content={
              modelData.value
                ? findOptionLabelByValue(modelData.value)
                : '请选择'
            }
            placement="top"
          >
            <el-dropdown
              trigger={props.trigger}
              popperClass={styles.dropdown}
              onCommand={onCommand}
              placement="bottom-start"
              max-height={500}
              vSlots={{
                dropdown: () =>
                  props.options.length ? (
                    <el-dropdown-menu>
                      {props.options.map((item: OptionType) => {
                        return (
                          <el-dropdown-item command={item.value}>
                            <div class={styles.lineTag}>
                              <div class={styles.fitTag}>
                                {' '}
                                {item.label || item.name}
                              </div>
                            </div>
                          </el-dropdown-item>
                        )
                      })}
                    </el-dropdown-menu>
                  ) : (
                    <Empty />
                  ),
              }}
            >
              {modelData.value ? (
                <div
                  class={styles.tag}
                  style={{ width: props.labelWidth }}
                  onClick={() => emit('click')}
                >
                  {findOptionLabelByValue(modelData.value)}
                </div>
              ) : (
                <div
                  class={[styles.tag, styles.pl]}
                  style={{ width: props.labelWidth }}
                >
                  请选择
                </div>
              )}
            </el-dropdown>
          </el-tooltip>
        )
      }
      // 默认只展示一个tag
      return (
        <div
          class={styles.tag}
          style={{ width: props.labelWidth }}
          onClick={() => emit('click')}
        >
          {slots.default && slots.default()}
          {/* {props.showClose ? (
            <Icon
              class={styles.tagClose}
              icon="tag_close"
              width={8}
              height={8}
              onClick={(evt) => onClose(item, evt)}
            />
          ) : null} */}
        </div>
      )
    }
  },
})
