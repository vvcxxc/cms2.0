//@ts-ignore
import * as d3 from 'd3'
import styles from '../Views/ProductDelivery.module.scss'

export const useDrag = ({ width, height }: any) => {
  const onDragSvg = function (event: any) {
    //@ts-ignore
    const that = this
    let pt = d3.pointer(event, that)
    d3.select(that)
      .attr('x', pt[0] - width.value / 2)
      .attr('y', pt[1] - height.value / 2)
  }

  const onDragStartSvg = function (event: any) {
    //@ts-ignore
    d3.select(this).attr('fill', '#f56c6c')
  }

  const initSvgDrag = () => {
    const rects = d3.selectAll(`.${styles.svgRect}`)
    rects.call(d3.drag().on('start', onDragStartSvg))
    rects.call(d3.drag().on('drag', onDragSvg))
  }
  return {
    initSvgDrag,
  }
}
