import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp } from 'vue'
import { NODES } from '../../../core/enum'
import { Node, NodeModel } from '../Node'

class InboundInitializeModel extends NodeModel {}

class InboundInitializeNode extends Node {
  [key: string]: any
  constructor(props: any) {
    const option = {
      color: '#ab47bc',
      background: '#fff',
      height: '36px',
      icon: 'varsetting',
    }
    super(props, option)
  }
}

export default {
  type: NODES.VARIABLE_MONITOR_ACTIVITY,
  view: InboundInitializeNode,
  model: InboundInitializeModel,
}
