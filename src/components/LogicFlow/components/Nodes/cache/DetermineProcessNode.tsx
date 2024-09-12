import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp } from 'vue'
import { NODES } from '../../../core/enum'
import { Node, NodeModel } from '../Node'

class DetermineProcessModel extends NodeModel {}

class DetermineProcessNode extends Node {
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
  type: NODES.DETERMINE_PROCESS_ACTIVITY,
  view: DetermineProcessNode,
  model: DetermineProcessModel,
}
