import { Component, defineComponent, h } from 'vue'
import styles from './Text.module.scss'
export default defineComponent({
  name: '文本',
  props: {
    truncated: {
      type: Boolean,
      default: false,
    },
    tag: {
      type: String,
      default: 'span',
    },
    lineClamp: {
      type: Number,
      default: 1,
    },
    tip: {
      type: String,
      default: '',
    },
    fontSize: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    LanguageScopeKey: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
    const tag: string = props.tag
    const style = {
      color: props.color,
      fontSize: props.fontSize,
    }
    const RenderComponent = () => {
      return h(
        tag,
        {
          class: props.truncated ? styles.truncated : '',
          style: { '-webkit-line-clamp': props.lineClamp, ...style },
          ...attrs,
        },
        {
          ...slots,
        }
      )
    }
    return () => {
      if (props.tip) {
        return (
          <el-tooltip
            effect="dark"
            content={`<div style="max-width:300px">${props.tip}</div>`}
            raw-content
            placement="top"
          >
            <RenderComponent />
          </el-tooltip>
        )
      }
      return <RenderComponent />
    }
  },
})
