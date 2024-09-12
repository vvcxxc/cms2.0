import { VueSvgIcon } from '@yzfe/vue3-svgicon'
import { defineComponent } from 'vue'
import '@yzfe/svgicon/lib/svgicon.css'
import styles from './SvgIcon.module.scss'

const svgFiles = import.meta.glob('../../assets/svg-icon/*.svg', {
  eager: true,
})

const icons: Record<string, any> = Object.entries(svgFiles).reduce(
  (acc, [key, value]: any[]) => {
    const name = key.replace('../../assets/svg-icon/', '').replace('.svg', '')
    return {
      ...acc,
      [name]: value.default,
    }
  },
  {}
)

const SvgIcon = defineComponent({
  name: 'SvgIcon',
  props: {
    type: {
      type: String,
    },
    color: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    height: {
      type: [String, Number],
    },
    scale: {
      type: [String, Number],
    },
    title: {
      type: String,
    },
    class: {
      type: String,
    },
    style: {
      type: Object,
    },
  },
  emits: ['click'],
  setup(props: any, { attrs, emit }) {
    return () => {
      return (
        <VueSvgIcon
          onClick={() => emit('click')}
          class={styles.container}
          data={icons[props.type]}
          {...props}
          {...attrs}
        />
      )
    }
  },
})

export default SvgIcon
