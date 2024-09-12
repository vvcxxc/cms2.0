import {
  defineComponent,
  computed,
  SetupContext,
  ref,
  PropType,
  Fragment,
  DefineComponent,
  Component,
} from 'vue'
import styles from './Tag.module.scss'
import Empty from '../Empty/Empty'
import Icon from '../Icon/Icon'
import isNil from 'lodash/isNil'
import { _t } from '@/libs/Language/Language'
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
  [key: string]: any
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
  emits: ['click', 'update:modelValue', 'change', 'mouseenter', 'update:data'],
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
    showTip: {
      type: Boolean,
      default: false,
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    labelKey: {
      type: String,
      default: 'label',
    },
    // 默认值
    defaultValue: {
      type: [String, Number],
      default: '',
    },
    // 默认值
    max: {
      type: Number,
      default: 999,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props: TagProps, { attrs, slots, emit }: SetupContext) {
    const key = props.valueKey
    const label = props.labelKey
    const visible = ref(false)

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
     * 选项map
     */
    const optionsMap = computed(() => {
      const acc: Record<string, any> = {}
      props.options?.forEach((item: any) => {
        acc[item[key]] = item
      })
      return acc
    })
    /**
     * 根据value查找label
     * @param value
     * @returns
     */
    const findOptionLabelByValue = (value: string) => {
      const item: Record<string, any> = optionsMap.value[value]
      return (
        item?.[label] ||
        item?.label ||
        item?.name ||
        props.defaultValue ||
        value ||
        ''
      )
    }
    /**
     * 选择
     * @param v
     */
    const onCommand = (v: any) => {
      modelData.value = v
      emit('change', modelData.value)
    }
    /**
     * hover时触发
     */
    const onMouseenter = () => {
      emit('mouseenter')
    }

    const currentName = computed(() => {
      const v = modelData.value
      return findOptionLabelByValue(v)
    })
    /**
     * 当v-model:data时，生效
     */
    const onClose = (item: DataType, evt: Event) => {
      evt?.stopPropagation()
      data.value = data.value.filter((i) => i !== item)
    }

    const onVisibleChange = (v: boolean) => {
      visible.value = v
    }

    /**
     * click
     * @param evt Event
     */
    const onClick = (evt: Event) => {
      evt?.stopPropagation()
      emit('click', evt)
    }

    const Tip = ($props: any, { slots }: SetupContext) => {
      if ($props.showTip) {
        return (
          <el-tooltip
            class="box-item"
            effect="dark"
            content={`<div style="max-width: 300px">${$props.v}</div>`}
            raw-content
            placement="top"
            persistent={false}
          >
            {slots.default?.()}
          </el-tooltip>
          // <span title={$props.v}>{slots.default?.()}</span>
        )
      }
      return slots.default?.()
    }

    const DRender: Component = () => {
      const hideTip = !props.showTip
      let max = props.max >= props.data.length ? props.data.length : props.max
      max = max == 0 ? 1 : max
      const d = props.data.slice(0, max) || []
      const tags = d.map((item: DataType, index: any) => {
        const msg =
          item[label] ||
          item.name ||
          item.label ||
          item.description ||
          item.type
        return (
          <span
            class={styles.tag}
            style="margin: 0 5px 3px 0;cursor: initial;"
            key={index}
            onClick={onClick}
          >
            {hideTip ? (
              // @ts-ignore
              <Tip showTip={hideTip} v={msg}>
                {msg}
              </Tip>
            ) : (
              msg
            )}

            {props.showClose ? (
              <Icon
                class={styles.tagClose}
                icon="tag_close"
                width={8}
                height={8}
                onClick={(evt) => onClose(item, evt)}
              />
            ) : null}
          </span>
        )
      })
      if (props.data.length > max) {
        const l = props.data.length - max
        tags.push(
          <div
            class={styles.more}
            style={{ fontSize: l >= 100 ? '11px' : '12px' }}
          >
            +{l}
          </div>
        )
      }
      return tags
    }

    return () => {
      // showTip
      // 多tag情况，传data[]
      if (Array.isArray(props.data)) {
        const msg = (item: DataType) =>
          item[label] ||
          item.name ||
          item.label ||
          item.description ||
          item.type
        const v = props.data.map((item) => msg(item))?.join('，')
        return (
          // @ts-ignore
          <Tip showTip={props.showTip} v={v}>
            <div
              class={{
                [styles.flex]: true,
                [props.className]: props.className,
              }}
            >
              <DRender />
            </div>
          </Tip>
        )
      }
      // 下拉选择hover
      if (Array.isArray(props.options)) {
        return (
          <el-dropdown
            trigger={'click'}
            popperClass={styles.dropdown}
            onCommand={onCommand}
            placement="bottom-start"
            max-height="230px"
            onVisibleChange={onVisibleChange}
            vSlots={{
              dropdown: () =>
                props.options.length ? (
                  <el-dropdown-menu>
                    {props.options.map((item: OptionType | any) => {
                      return (
                        <el-dropdown-item
                          title={item[label] || item.label || item.name}
                          command={item[key]}
                          class={{
                            [styles.isSelect]: modelData.value === item[key],
                          }}
                        >
                          {item[label] || item.label || item.name}
                        </el-dropdown-item>
                      )
                    })}
                  </el-dropdown-menu>
                ) : (
                  <Empty text={_t('暂无数据')} />
                ),
            }}
          >
            <div
              onMouseenter={onMouseenter}
              class={{
                [styles.tagSelect]: true,
                [styles.isSelectTag]: visible.value,
              }}
            >
              {!isNil(modelData.value) && currentName.value ? (
                <span class={styles.tag} onClick={() => emit('click')}>
                  {currentName.value}
                </span>
              ) : (
                <div class={styles.pl}>{_t('请选择')}</div>
              )}
              <Icon
                class={styles.iconDown}
                style={{
                  transform: visible.value ? 'rotate(-180deg)' : 'rotate(0deg)',
                }}
                icon="d"
                width={13}
                height={12}
              />
            </div>
          </el-dropdown>
        )
      }
      // 默认只展示一个tag

      const content = slots.default && slots.default()[0]?.children

      return (
        <span class={styles.tag} onClick={() => emit('click')}>
          <el-tooltip
            persistent={false}
            class="box-item"
            effect="dark"
            content={content}
            placement="top"
          >
            {slots.default && slots.default()}
          </el-tooltip>
        </span>
      )
    }
  },
})
