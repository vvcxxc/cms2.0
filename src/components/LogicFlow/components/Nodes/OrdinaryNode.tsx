import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp } from 'vue'
import { NODES } from '../../core/enum'
import { Node, NodeModel } from './Node'

const style = {
  width: 165,
  height: 50,
}

class OrdinaryNodeNodeModel extends NodeModel {
  setAttributes() {
    this.text.editable = false
    this.width = style.width
    this.height = style.height
    this.anchorsOffset = [
      // [style.width / 2, 0], //右边
      [0, style.height / 2], //下边
      // [-style.width / 2, 0], //左边
      [0, -style.height / 2], //上边
    ]
  }
}

class OrdinaryNodeNodeNode extends Node {
  [key: string]: any
  constructor(props: any) {
    const option = {
      color: 'rgba(0, 0, 0, 0.85)',
      background: '#fff',
      height: `${style.height - 6}px`,
      width: `${style.width - 6}px`,
      icon: 'varsetting',
      borderColor: '#9265f3',
    }
    super(props, option)
  }
}

export default {
  type: NODES.ORDINARY_NODE,
  view: OrdinaryNodeNodeNode,
  model: OrdinaryNodeNodeModel,
}
