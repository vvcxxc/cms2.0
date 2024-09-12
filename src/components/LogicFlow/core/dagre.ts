// @ts-nocheck
import { DagreLayout, DagreLayoutOptions } from '@antv/layout'
import * as d3 from 'd3-hierarchy'
export default class Dagre {
  static pluginName = 'dagre'
  lf: any
  option: DagreLayoutOptions
  nodeMap: Record<string, any>
  checkHasSourceNode(node, sourceId, Name) {
    let current = node
    let check = false
    while (current && current?.parent?.data?.id !== sourceId) {
      current = current?.parent
      // console.log(
      //   current?.parent,
      //   current?.data?.name,
      //   sourceId,
      //   Name,
      //   '---===='
      // )
      if (current?.parent === sourceId) {
        check = true
      }
    }
    return check
  }
  convertToTree(nodes, edges) {
    this.nodeMap = {}
    // 创建一个空对象，用于将节点ID映射到其自身对象
    const nodeMap = {}

    // 遍历节点列表，将每个节点ID映射到其自身对象，并初始化children属性为空数组
    nodes.forEach((node) => {
      nodeMap[node.id] = { ...node, children: [] }
    })

    // 遍历边列表，将每个边的源节点连接到目标节点
    edges.forEach((edge) => {
      const sourceNode = nodeMap[edge.source]
      const targetNode = nodeMap[edge.target]
      sourceNode.children.push(targetNode)
    })
    const rootId = nodes.find((node) => node.type === 'Activity')?.id
    const treeData = nodeMap[rootId]
    let treemap = d3.tree().size([1066, 1145])
    const root = d3.hierarchy(treeData, function (d) {
      return d.children
    })
    treemap(root)
    root.each((d) => {
      this.nodeMap[d.data.id] = d
    })
    // 返回根节点对象
    // return this.nodeMap
  }
  render(lf: any) {
    this.lf = lf
  }
  getBytesLength(word: string): number {
    if (!word) {
      return 0
    }
    let totalLength = 0
    for (let i = 0; i < word.length; i++) {
      const c = word.charCodeAt(i)
      if (word.match(/[A-Z]/)) {
        totalLength += 1.5
      } else if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
        totalLength += 1
      } else {
        totalLength += 2
      }
    }
    return totalLength
  }
  /**
   * option: {
   *   rankdir: "TB", // layout 方向, 可选 TB, BT, LR, RL
   *   align: undefined, // 节点对齐方式，可选 UL, UR, DL, DR
   *   nodeSize: undefined, // 节点大小
   *   nodesepFunc: undefined, // 节点水平间距(px)
   *   ranksepFunc: undefined, // 每一层节点之间间距
   *   nodesep: 40, // 节点水平间距(px) 注意：如果有grid，需要保证nodesep为grid的偶数倍
   *   ranksep: 40, // 每一层节点之间间距 注意：如果有grid，需要保证ranksep为grid的偶数倍
   *   controlPoints: false, // 是否保留布局连线的控制点
   *   radial: false, // 是否基于 dagre 进行辐射布局
   *   focusNode: null, // radial 为 true 时生效，关注的节点
   * };
   */
  layout(option = {}) {
    const { nodes, edges, gridSize } = this.lf.graphModel
    // 为了保证生成的节点在girdSize上，需要处理一下。
    let nodesep = 40
    let ranksep = 40
    if (gridSize > 20) {
      nodesep = gridSize * 2
      ranksep = gridSize * 2
    }
    this.option = {
      type: 'dagre',
      rankdir: 'TB',
      // align: 'UL',
      // align: 'UR',
      preventOverlap: true,
      begin: [120, 120],
      controlPoints: true,
      // nodesepFunc: (node) => {
      //   return node
      // },
      ...option,
    }
    const layoutInstance = new DagreLayout(this.option)
    const newNodes = nodes.map((node) => ({
      id: node.id,
      size: {
        width: node.width,
        height: node.height,
      },
      model: node,
      type: node.type,
      name: node.properties.Name,
    }))
    const newEdges = edges.map((edge) => ({
      source: edge.sourceNodeId,
      target: edge.targetNodeId,
      model: edge,
      type: edge.type,
    }))
    const layoutData = layoutInstance.layout({
      nodes: newNodes,
      edges: newEdges,
    })
    this.convertToTree(newNodes, newEdges)
    const newGraphData = {
      nodes: [],
      edges: [],
    }
    layoutData.nodes.forEach((node) => {
      // @ts-ignore: pass node data
      const { model } = node
      const data = model.getData()
      // @ts-ignore: pass node data
      data.x = node.x
      // @ts-ignore: pass node data
      data.y = node.y

      if (data.text) {
        data.text = {
          x: node.x + 10,
          y: node.y - this.getBytesLength(data.text) * 6 - 10,
          value: data.text.value,
        }
      }
      newGraphData.nodes.push(data)
    })
    layoutData.edges.forEach((edge) => {
      // @ts-ignore: pass edge data
      const { model } = edge
      const data = model.getData()
      data.pointsList = this.calcPointsList(model, newGraphData.nodes)
      if (data.pointsList) {
        const first = data.pointsList[0]
        const last = data.pointsList[data.pointsList.length - 1]
        data.startPoint = { x: first.x, y: first.y }
        data.endPoint = { x: last.x, y: last.y }
        if (data.text && data.text.value) {
          data.text = {
            x: last.x,
            y: last.y - 80,
            value: data.text.value,
          }
        }
      } else {
        data.startPoint = undefined
        data.endPoint = undefined
        if (data.text && data.text.value) {
          data.text = data.text.value
        }
      }
      newGraphData.edges.push(data)
    })
    this.lf.render(newGraphData)
  }
  pointFilter(points) {
    const allPoints = points
    let i = 1
    while (i < allPoints.length - 1) {
      const pre = allPoints[i - 1]
      const current = allPoints[i]
      const next = allPoints[i + 1]
      if (
        (pre.x === current.x && current.x === next.x) ||
        (pre.y === current.y && current.y === next.y)
      ) {
        allPoints.splice(i, 1)
      } else {
        i++
      }
    }
    return allPoints
  }
  calcPointsList(model, nodes) {
    // 在节点确认从左向右后，通过计算来保证节点连线清晰。
    // TODO: 避障
    const pointsList = []
    if (this.option.rankdir === 'TB') {
      const sourceNodeModel = this.lf.getNodeModelById(model.sourceNodeId)
      const targetNodeModel = this.lf.getNodeModelById(model.targetNodeId)
      const newSourceNodeData = nodes.find(
        (node) => node.id === model.sourceNodeId
      )
      const newTargetNodeData = nodes.find(
        (node) => node.id === model.targetNodeId
      )
      if (newSourceNodeData.x < newTargetNodeData.x) {
        pointsList.push({
          x: newSourceNodeData.x + sourceNodeModel.width / 2,
          y: newSourceNodeData.y,
        })
        pointsList.push({
          x:
            newSourceNodeData.x +
            sourceNodeModel.width / 2 +
            (model.offset || 50),
          y: newSourceNodeData.y,
        })
        pointsList.push({
          x:
            newSourceNodeData.x +
            sourceNodeModel.width / 2 +
            (model.offset || 50),
          y: newTargetNodeData.y,
        })
        pointsList.push({
          x:
            newTargetNodeData.x -
            targetNodeModel.width / 2 +
            (model.offset || 50) -
            10,
          y: newTargetNodeData.y,
        })
        return this.pointFilter(pointsList)
      }
      // 向回连线
      if (newSourceNodeData.x > newTargetNodeData.x) {
        if (newSourceNodeData.y >= newTargetNodeData.y) {
          pointsList.push({
            x: newSourceNodeData.x,
            y: newSourceNodeData.y + sourceNodeModel.height / 2,
          })
          pointsList.push({
            x: newSourceNodeData.x,
            y:
              newSourceNodeData.y +
              sourceNodeModel.height / 2 +
              (model.offset || 50),
          })
          pointsList.push({
            x: newTargetNodeData.x,
            y:
              newSourceNodeData.y +
              sourceNodeModel.height / 2 +
              (model.offset || 50),
          })
          pointsList.push({
            x: newTargetNodeData.x,
            y: newTargetNodeData.y + targetNodeModel.height / 2,
          })
        } else {
          pointsList.push({
            x: newSourceNodeData.x,
            y:
              newSourceNodeData.y -
              sourceNodeModel.height / 2 +
              (model.offset || 50) +
              30,
          })
          pointsList.push({
            x: newSourceNodeData.x,
            y:
              newSourceNodeData.y -
              sourceNodeModel.height / 2 -
              (model.offset || 50) +
              100,
          })
          pointsList.push({
            x: newTargetNodeData.x,
            y:
              newSourceNodeData.y -
              sourceNodeModel.height / 2 -
              (model.offset || 50) +
              100,
          })
          pointsList.push({
            x: newTargetNodeData.x,
            y: newTargetNodeData.y - targetNodeModel.height / 2,
          })
        }

        return this.pointFilter(pointsList)
      } else if (newSourceNodeData.x == newTargetNodeData.x) {
        if (newSourceNodeData.y < newTargetNodeData.y) {
          const sourceNodeId = model.sourceNodeId
          const targetNodeId = model.targetNodeId

          const sourceNode = this.nodeMap[sourceNodeId]
          const targetNode = this.nodeMap[targetNodeId]

          if (
            sourceNode.children?.length > 1 &&
            targetNode.parent.data.id !== sourceNodeId
          ) {
            pointsList.push({
              x: newSourceNodeData.x,
              y: newSourceNodeData.y - sourceNodeModel.height / 2,
            })
            pointsList.push({
              x: newSourceNodeData.x + 200,
              y: newSourceNodeData.y,
            })
            pointsList.push({
              x: newTargetNodeData.x - 200,
              y: newSourceNodeData.y,
            })
            pointsList.push({
              x: newTargetNodeData.x,
              y: newTargetNodeData.y - targetNodeModel.height / 2,
            })
            console.log(targetNode.data.name, targetNode, '====-11')
          }
          //     const checked = this.checkHasSourceNode(
          //       targetNode,
          //       sourceNodeId,
          //       newSourceNodeData.properties.Name
          //     )
          //     console.log(checked, '---===--0')
        }
        return undefined
      }
    }
    return undefined
  }
}
