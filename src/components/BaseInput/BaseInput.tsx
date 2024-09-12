import { defineComponent, SetupContext, ref, computed } from 'vue'
import styles from './BaseInput.module.scss'
import { getScopeT, Language } from '@/libs/Language/Language'

export default defineComponent({
  name: 'BaseInput',
  emits: ['update:modelValue', 'click'],
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '请输入',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    LanguageScopeKey: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs, slots, emit }: SetupContext) {
    const _t = getScopeT(props.LanguageScopeKey)

    const input = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })
    const onClick = (evt: Event) => {
      evt?.stopPropagation()
      emit('click', evt)
    }
    return () => {
      return (
        <div class={styles.baseInput} onClick={onClick}>
          <input
            placeholder={_t(props.placeholder)}
            class={{
              [styles.input]: true,
              [styles.hover]: true,
            }}
            v-model={input.value}
          />
          {/* <span class={styles.hasHover}>
            {input.value ? (
              input.value
            ) : (
              <span style="color:#929AB1;padding-right:200px">
                {props.placeholder}
              </span>
            )}
          </span> */}
        </div>
      )
    }
  },
})
