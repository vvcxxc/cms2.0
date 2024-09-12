import { Component, h } from 'vue'
import Provider from './index.vue'
/**
 *
 * @param Widget 组件
 * @param notPage 是否为组件
 * @param isFullyCover 是否铺满
 * @param defaultConfig 默认样式配置，支持width,height,padding,background
 * @returns
 */
export function provider(
  Widget: Component,
  notPage: boolean = false,
  isFullyCover: boolean = false,
  defaultConfig: Record<string, any> = {}
) {
  return (arg: any) => {
    return h(
      Provider,
      {
        widgetProps: arg,
        widgetName: Widget.name,
        isFullyCover,
        notPage,
        defaultConfig,
      },
      {
        default: (props: any) => {
          return h(Widget, {
            ...props,
          })
        },
      }
    )
  }
}
