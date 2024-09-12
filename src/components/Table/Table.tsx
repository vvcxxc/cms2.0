import { defineComponent, useAttrs, ref, SetupContext } from 'vue'
import BaseTable from './index.vue'
import type { TablePropsItemType } from './index.d'
import { Language } from '@/libs/Language/Language'
// 重构表格组件
// @ts-ignore
export default defineComponent<TablePropsItemType>({
  name: 'Table',
  props: BaseTable.props,
  emits: BaseTable.emits,
  setup(props: any, ctx: SetupContext) {
    const emits: any = BaseTable.emits
    const eventMap: Record<string, any> = {}
    const tableRef = ref()

    emits.forEach((eventName: string) => {
      const onEventName = `on${eventName
        .slice(0, 1)
        .toUpperCase()}${eventName.slice(1)}`
      eventMap[onEventName] = (...args: any) => ctx.emit(eventName, ...args)
    })

    /**
     * 暴露方法
     * @param exposeMap
     */
    const onUpdatedExpose = (exposeMap: Record<string, () => void>) => {
      ctx.expose(exposeMap)
    }

    return () => {
      return (
        <BaseTable
          ref={tableRef}
          {...props}
          {...ctx.attrs}
          {...eventMap}
          v-slots={{ ...ctx.slots }}
          onUpdate={onUpdatedExpose}
        />
      )
    }
  },
})
