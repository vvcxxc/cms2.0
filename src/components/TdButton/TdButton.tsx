import { Component, defineComponent, h } from 'vue'
import styles from './TdButton.module.scss'
import Text from '../Text/Text'
import IconButton from '../IconButton/IconButton'

export default defineComponent({
  name: 'TdButton',
  props: {
    text: {
      type: [String, Object],
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => {
      const style = {
        filter: `grayscale(${props.disabled ? 1 : 0})`,
        cursor: props.disabled ? 'no-drop' : 'pointer',
      }
      return (
        <div
          class={{ [styles.text]: true, 's-row--td-hover': props.hover }}
          style={style}
        >
          <div class="s-td-name" style={props.style}>
            <Text truncated={true} tip={props.tip}>
              {slots.default?.()}
            </Text>
          </div>
          <IconButton
            disabled={props.disabled}
            onClick={() => emit('click')}
            icon={props.icon}
            class="s-icon-btn"
          >
            {props.text}
          </IconButton>
        </div>
      )
    }
  },
})
