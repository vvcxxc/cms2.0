import {
  defineComponent,
  Fragment,
  computed,
  Component,
  DefineComponent,
  SetupContext,
} from 'vue'

export default defineComponent<{
  grid: Record<string, any>
  minimap: Record<string, any> | boolean
  height?: number
  width?: number
  [key: string]: any
}>({
  name: 'Canvas',
  emits: ['drop'],
  setup(props: any, { slots, attrs, emit }: SetupContext) {
    const config = {
      layout: {
        type: 'dagre',
        nodesep: 100,
        ranksep: 40,
        controlPoints: true,
      },
      fitView: true,
      autoFit: false,
    }

    const baseConfig = computed(() => {
      return {
        ...config,
        ...props,
        ...attrs,
      }
    })
    return () => {
      const Widgets = (slots.default && slots.default()) || []
      return (
        <span onDrop={(...arg) => emit('drop', ...arg)}>
          {Widgets.map((Widget: any) => {
            return <Widget {...baseConfig.value} />
          })}
        </span>
      )
    }
  },
})
