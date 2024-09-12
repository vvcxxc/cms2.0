import { get, set } from 'lodash'
import { ref } from 'vue'
import { saveTraceBackFieldWidth } from '@/api'

export const useDnd = (data: any) => {
  const baseColor = '#5a84ff'
  const tableStyleMap = ref({})
  /**
   * 浏览器空闲时执行
   * @param cb
   * @returns
   */
  const delayedExecution = (cb: () => void) => {
    if (window.requestIdleCallback) return window.requestIdleCallback(cb)
    if (window.queueMicrotask) return window.queueMicrotask(cb)
    const t = setTimeout(() => {
      cb()
      clearTimeout(t)
    })
  }
  const saveConfig = (key: string, width: number) => {
    const traceData = {
      columnKey: key,
      width: width,
    }
    saveTraceBackFieldWidth(traceData, data.curProcessId)
  }
  /**
   * 鼠标按下执行
   * @param e
   * @param index
   * @returns
   */
  const onMousedown = (
    e: MouseEvent,
    index: number,
    key: string,
    className?: string
  ) => {
    const draggable = e.target as HTMLElement
    if (!draggable) return
    let bWidth = 0
    let startX = 0
    let left = 0
    const tableDom = document.querySelector('.table-contentFlex') as HTMLElement
    tableDom.style.userSelect = 'none'
    const height = window.getComputedStyle(tableDom).height
    const parentNode = draggable.parentNode as HTMLElement
    draggable.style.height = height
    draggable.style.backgroundColor = baseColor
    draggable.style.display = 'block'
    let broNode = parentNode?.lastChild as HTMLElement
    broNode = broNode.tagName ? broNode : parentNode
    let moveWidth = parseInt(broNode?.style?.width)
    if (parentNode) {
      const style = window.getComputedStyle(broNode)
      bWidth = parseInt(style.width)
      startX = e.clientX
      const rect = broNode.getBoundingClientRect()
      left = startX - rect.left
    }
    /**
     * 鼠标移动
     * @param e
     */
    const onMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX + left
      if (newX - 2 >= 50) {
        draggable.style.left = `${newX - 2}px`
        moveWidth = newX
      }
    }
    /**
     * 执行宽度渲染及样式重置
     */
    const handleNodeEnd = () => {
      delayedExecution(() => {
        const bodyLine = className || 'body-line'
        const nodes = document.querySelectorAll(
          `.${bodyLine} .body-item:nth-of-type(${index + 2})`
        )

        const width = `${moveWidth}px`
        broNode.style.width = width
        draggable.style.height = '100%'
        tableDom.style.userSelect = 'auto'
        draggable.style.backgroundColor = ''
        draggable.style.display = ''
        set(tableStyleMap.value, `${key}.width`, moveWidth)
        if (className) {
          nodes.forEach((node: any) => {
            node.style.width = width
          })
        }
        saveConfig(key, parseInt(width))
      })
    }
    /**
     * 鼠标抬起
     */
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      handleNodeEnd()
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  return { onMousedown, tableStyleMap }
}
