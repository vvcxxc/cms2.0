import { NODES } from '../../core/enum'
import { width, height, x, y } from './index'
// import Node from './Node'
// import { createApp } from 'vue'
// const imgUrl = new URL('../../../../assets/images/node1.png', import.meta.url)
// .href
import imgUrl from '../../../../assets/images/node1.png'
const OrdinaryNode: {
  type: string
  options: Record<string, any>
} = {
  type: NODES.ACTIVITIES,
  options: {
    drawShape(cfg: Record<string, any>, group: any) {
      // const div = document.createElement('div')
      // div.setAttribute('draggable', 'true')
      // const app = createApp(() => <Node cfg={cfg} />)
      // app.mount(div)

      // const rect = group.addShape('dom', {
      //   attrs: {
      //     x: -75 - x,
      //     y: -25 - y,
      //     width,
      //     height,
      //     radius: 1,
      //     stroke: '#5B8FF9',
      //     fill: '#C6E5FF',
      //     lineWidth: 2,
      //     html: div.innerHTML,
      //   },
      //   name: 'dom-shape',
      // })

      const rect = group.addShape('rect', {
        zIndex: 1,
        attrs: {
          x: -75 - x,
          y: -25 - y,
          width,
          height,
          radius: 1,
          stroke: '#5B8FF9',
          fill: '#C6E5FF',
          lineWidth: 2,
        },
        name: 'rect-shape',
      })
      group.addShape('image', {
        zIndex: 100,
        draggable: false,
        attrs: {
          x: -98,
          y: -28,
          radius: 1,
          width: 20,
          height: 20,
          img: imgUrl,
        },
        name: 'node-icon',
      })
      return rect
    },
  },
}

export default OrdinaryNode
