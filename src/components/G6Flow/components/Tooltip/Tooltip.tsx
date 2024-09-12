import G6 from '@antv/g6'
import './Tooltip.scss'
export default () =>
  new G6.Tooltip({
    offsetX: 35,
    offsetY: 30,
    itemTypes: ['node'],
    getContent: (e: any) => {
      return `<span>${e?.item.getModel().name}</span>`
    },
  })
