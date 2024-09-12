import { computed, defineComponent, ref } from 'vue'
import styles from './Container.module.scss'
import Icon from '@/components/Icon/Icon'
import { useVModel } from '@vueuse/core'
import { debounce } from 'lodash'
export default defineComponent({
  name: '通用头部',
  props: {
    title: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '请输入搜索',
    },
    modelValue: {
      type: String,
      default: '',
    },
    isSearch: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['confirm', 'update:modelValue'],
  setup(props, { slots, emit }) {
    const innerValue = useVModel(props)
    const isBlur = ref(false)
    const confirm = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.keyCode === 13) {
        emit('confirm', innerValue.value)
      }
    }

    const onEventChange = (isFocus: boolean) => {
      isBlur.value = isFocus
    }
    return () => {
      return (
        <div class={styles.container}>
          <div class={styles.header}>
            <span class={styles.title}>{props.title}</span>
            {props.isSearch && (
              <el-input
                size="small"
                onKeydown={confirm}
                v-model={innerValue.value}
                class={styles.innerInput}
                onBlur={() => onEventChange(false)}
                onFocus={() => onEventChange(true)}
                placeholder={!isBlur.value ? props.placeholder : ''}
                prefix-icon={
                  <Icon icon="white_search" width={12} height={12} />
                }
              />
            )}
          </div>
          <div class={styles.content}>{slots.default?.()}</div>
        </div>
      )
    }
  },
})
