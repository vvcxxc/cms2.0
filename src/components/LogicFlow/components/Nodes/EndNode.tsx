import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp } from 'vue'
import BaseNode from './BaseNode'
import { NODES } from '../../core/enum'

class StartModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false
    const width = 120
    const height = 36
    this.width = width
    this.height = height
    this.anchorsOffset = [
      // [width / 2, 0],//右边
      // [0, height / 2], //下边
      // [-width / 2, 0],
      [0, -height / 2], //上边
    ]
  }
}

class StartNode extends HtmlNode {
  [key: string]: any
  constructor(props: any) {
    super(props)
    this.app = createApp(() => {
      const { properties } = this.props.model
      return (
        <BaseNode
          width="116px"
          height="30px"
          borderColor="rgb(146, 101, 243)"
          icon="end"
          node={properties}
          background="#fff"
          color="#333"
        />
      )
    })
  }

  setHtml(rootEl: HTMLElement) {
    const dom = document.createElement('div')
    rootEl.appendChild(dom)
    this.app.mount(dom)
  }
}

export default {
  type: NODES.END_ACTIVITY,
  view: StartNode,
  model: StartModel,
}
