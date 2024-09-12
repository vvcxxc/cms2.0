import { defineComponent } from 'vue'
import styles from './Flow.module.scss'
import Tag from '../Tag/Tag'
import { scope } from '@/libs/Language/Language'

export default defineComponent({
  name: '流程显示tag',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    LanguageScopeKey: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    const _t = scope(props.LanguageScopeKey)
    return () => {
      return (
        <div
          class={{
            [styles.flows_pick]: true,
            [styles.disabled]: props.disabled,
          }}
        >
          {!props.modelValue?.length ? (
            <span class={styles.flowTag}>{props.placeholder}</span>
          ) : (
            props.modelValue.map((item: any) => {
              return (
                <Tag style={{ marginRight: '5px', marginBottom: '5px' }}>
                  {item.name || item.description}
                </Tag>
              )
            })
          )}
        </div>
      )
    }
  },
})
