import { NODES } from '../../core/enum'
import { width, height, x, y } from './index'

const StartNode: {
  type: string
  options: Record<string, any>
} = {
  type: NODES.ACTIVITY,
  options: {
    drawShape(cfg: Record<string, any>, group: any) {
      const rect = group.addShape('rect', {
        attrs: {
          x: -75 - x,
          y: -25 - y,
          width,
          height,
          radius: 10,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
          lineWidth: 3,
        },
        name: 'rect-shape',
      })
      return rect
    },
  },
}
export default StartNode
