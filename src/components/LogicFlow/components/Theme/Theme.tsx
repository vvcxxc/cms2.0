import { defineComponent } from 'vue'
import { injectStore } from '../../core/store'

export default defineComponent({
  name: 'Theme',
  props: [
    'ellipse',
    'polygon',
    'outline',
    'edgeAdjust',
    'text',
    'snapline',
    'line',
    'anchorLine',
    'arrow',
    'edgeText',
    'bezier',
    'polyline',
    'baseEdge',
    'nodeText',
    'anchor',
  ],
  setup(props, { attrs }) {
    const { theme } = injectStore()
    theme.value = { ...theme.value, ...attrs, ...props }
    return () => null
  },
})
