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
}>({
  name: 'LogicFlowCanvas',
  setup(props: any, { slots, attrs }: SetupContext) {
    const logicFlowConfig = {
      grid: {
        size: 20,
        visible: true,
        type: 'dot',
        config: {
          color: '#ababab',
          thickness: 1,
        },
      },
    }

    const baseConfig = computed(() => {
      return {
        ...logicFlowConfig,
        ...props,
        ...attrs,
      }
    })
    return () => {
      const Widgets = (slots.default && slots.default()) || []
      return (
        <span>
          {Widgets.map((Widget: any) => {
            return <Widget {...baseConfig.value} />
          })}
        </span>
      )
    }
  },
})
