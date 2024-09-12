import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp } from 'vue'
import { NODES } from '../../../core/enum'
import { Node, NodeModel } from '../Node'

class DuplicateCodeDetectionModel extends NodeModel {}

class DuplicateCodeDetectionNode extends Node {
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
  type: NODES.DUPLICATE_CODE_DETECTION_ACTIVITY,
  view: DuplicateCodeDetectionNode,
  model: DuplicateCodeDetectionModel,
}
