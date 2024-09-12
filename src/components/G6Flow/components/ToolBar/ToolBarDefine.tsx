import G6, { Graph } from '@antv/g6'
import styles from './ToolBar.module.scss'
import { h, createApp } from 'vue'
import ToolBar from './ToolBar'

export default class ToolBarDefine {
  #className: string
  #toolBarInstance: any
  #downName: string | undefined
  #format?: () => void
  #animateCfg = { duration: 200, easing: 'easeCubic' }
  constructor({ className, format, downName }: any) {
    this.#className = className
    this.#format = format
    this.#downName = downName
  }
  get container() {
    return document.querySelector(`.${this.#className}`)
  }
  get getContent() {
    return () => {
      const div = document.createElement('div')

      const app = createApp(() => {
        return <ToolBar />
      })
      app.mount(div)
      return div
    }
  }
  handleClick(code: string, graph: Graph) {
    if (this.#toolBarInstance) {
      const toolBar: typeof G6.ToolBar | any = this.#toolBarInstance

      const fnMap: Record<string, () => void> = {
        redo: () => {
          toolBar.redo()
        },
        undo: () => {
          toolBar.undo()
        },
        enlarge: () => {
          graph.zoom(1.1, { x: 0, y: 0 }, true, this.#animateCfg)
        },
        reduce: () => {
          graph.zoom(0.9, { x: 0, y: 0 }, true, this.#animateCfg)
        },
        format: () => {
          this.#format && this.#format()
        },
        download: () => {
          const oldRatio = window.devicePixelRatio
          window.devicePixelRatio = 3
          graph.downloadFullImage(this.#downName, 'image/png', {
            backgroundColor: '#fff',
            padding: 10,
          })
          setTimeout(() => {
            window.devicePixelRatio = oldRatio
          }, 0)
        },
      }
      const fn = fnMap[code]
      fn && fn()
    }
  }
  instanceToolBar() {
    this.#toolBarInstance = new G6.ToolBar({
      container: this.container as any,
      getContent: this.getContent,
      handleClick: this.handleClick.bind(this) as () => void,
    })
    return this.#toolBarInstance
  }
}
