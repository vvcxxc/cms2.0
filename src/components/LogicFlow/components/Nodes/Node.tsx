import { HtmlNodeModel, HtmlNode } from '@logicflow/core'
import { h, createApp } from 'vue'
import BaseNode from './BaseNode'
import styles from './index.module.scss'
import { NODES } from '../../core/enum'

interface NodeOptionType {
  icon?: string
  background?: string
  color?: string
  width?: string
  height?: string
}

export class NodeModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false
    const width = 206
    const height = 136

    this.width = width
    this.height = height
    this.anchorsOffset = [
      // [width / 2, 0], //右边
      [0, height / 2], //下边
      // [-width / 2, 0], //左边
      [0, -height / 2], //上边
    ]
  }
}

export class Node extends HtmlNode {
  [key: string]: any
  constructor(props: any, option: NodeOptionType) {
    super(props)
    const nodeProps: NodeOptionType = {
      icon: 'lightsetting',
      background: '#fff',
      color: '#000000a6',
      ...option,
    }
    this.isMounted = false
    this.app = createApp(() => {
      const { properties } = this.props.model
      return <BaseNode node={properties} {...nodeProps} type="node" />
    })
  }

  setHtml(rootEl: HTMLElement) {
    const dom = document.createElement('div')
    rootEl.appendChild(dom)
    if (!this.isMounted) {
      this.app.mount(dom)
    }

    this.isMounted = true
  }
}
