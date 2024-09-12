import { defineComponent, ref } from 'vue'
import styles from './Search.module.scss'
import Icon from '../Icon/Icon'
import { useVModel } from '@vueuse/core'
import debounce from 'lodash/debounce'
import { t } from '@/libs/Language/Language'

export default defineComponent({
  name: '搜索输入',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索',
    },
    modelValue: {
      type: String,
      default: '',
    },
    tableRef: {
      type: Object,
      default: null,
    },
    field: {
      type: String,
      default: '',
    },
  },
  emits: ['confirm', 'update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    const innerValue = useVModel(props)
    return () => {
      const confirm = (event: KeyboardEvent | string) => {
        if (
          typeof event === 'string' ||
          event.key === 'Enter' ||
          event.keyCode === 13
        ) {
          emit('confirm', innerValue.value)
          const rf = props.tableRef?.value || props.tableRef
          if (rf) {
            rf.getList({
              [props.field || 'Name']: innerValue.value,
            })
          }
        }
      }

      const fn = debounce(confirm, 100)

      return (
        <div class={styles.inputContent}>
          <el-input
            v-model={innerValue.value}
            class={styles.searchInner}
            // size="small"
            prefix-icon={<Icon icon="s_input" width={12} height={12} />}
            placeholder={t(props.placeholder)}
            {...attrs}
            onKeydown={fn}
            onChange={fn}
          />
        </div>
      )
    }
  },
})
