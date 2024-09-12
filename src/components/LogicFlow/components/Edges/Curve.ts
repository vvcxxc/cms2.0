// 贝塞尔曲线
import { BezierEdge, BezierEdgeModel } from '@logicflow/core'
import { CURVE } from '../../core/enum' // 折线
import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core'
import { CurvedEdge, CurvedEdgeModel } from '@logicflow/extension'

class CurveModel extends BezierEdgeModel {
  initEdgeData(data: any) {
    super.initEdgeData(data)
    this.radius = 500
  }
  setAttributes() {
    this.isAnimation = true
    this.text.editable = false
    this.offset = 20
    const t = setTimeout(() => {
      this.isAnimation = false
      clearTimeout(t)
    }, 3000)
  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle()
    style.strokeDasharray = '15 2'
    style.animationDuration = '30s'
    style.stroke = '#5a84ff'
    // #9265f3
    return style
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle()
    const { properties } = this
    if (properties.isActived) {
      style.strokeDasharray = '2 2'
    }
    if (this.isSelected || this.isHovered) {
      style.stroke = '#5a84ff'
    } else {
      style.stroke = '#c4c8d5'
    }
    return style
  }
  getTextStyle() {
    const style: Record<string, any> = super.getTextStyle()
    style.color = '#444'
    style.fontSize = 13
    if (this.isSelected || this.isHovered) {
      style.color = '#5a84ff'
    } else {
      style.color = '#444'
    }
    return style
  }

  getOutlineStyle() {
    const style: Record<string, any> = super.getOutlineStyle()
    style.stroke = '#5a84ff'
    style.hover.stroke = '#5a84ff'
    return style
  }
  getAdjustStart() {}
}

export default {
  type: CURVE,
  view: BezierEdge,
  model: CurveModel,
}
