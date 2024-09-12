// @ts-nocheck
import Hierarchy from '@antv/hierarchy'
let NODE_SIZE = 0
let FIRST_ROOT_X = 100
let FIRST_ROOT_Y = 100
export const graphToTree = (graphData: { nodes: any[]; edges: any[] }) => {
  let tree = null
  const nodesMap = new Map()
  graphData.nodes.forEach((node) => {
    const treeNode = {
      ...node,
      children: [],
    }
    nodesMap.set(node.id, treeNode)
    if (node.type === 'ROOT_NODE') {
      tree = treeNode
    }
  })
  graphData.edges.forEach((edge) => {
    const node = nodesMap.get(edge.sourceNodeId)
    node.children.push(nodesMap.get(edge.targetNodeId))
  })
  return tree
}

export const dfsTree = (tree, callback) => {
  const newTree = callback(tree)
  if (tree.children && tree.children.length > 0) {
    newTree.children = tree.children.map((treeNode) =>
      dfsTree(treeNode, callback)
    )
  }
  return newTree
}
export const layoutTree = (tree) => {
  if (!tree || !tree.children || tree.children.length === 0) return tree
  const PEM = 20
  tree.isRoot = true
  const rootNode = Hierarchy.compactBox(tree, {
    direction: 'LR',
    getId(d) {
      return d.id
    },
    getHeight(d) {
      if (d.type === 'ROOT_NODE') {
        return NODE_SIZE * 4
      }
      return NODE_SIZE
    },
    getWidth() {
      return 200 + PEM * 1.6
    },
    getHGap() {
      return PEM
    },
    getVGap() {
      return PEM
    },
    getSubTreeSep(d) {
      if (!d.children || !d.children.length) {
        return 0
      }
      return PEM
    },
  })
  const x = tree.x || FIRST_ROOT_X
  const y = tree.y || FIRST_ROOT_Y
  const x1 = rootNode.x
  const y1 = rootNode.y
  const moveX = x - x1
  const moveY = y - y1
  const newTree = dfsTree(rootNode, (currentNode) => {
    return {
      id: currentNode.id,
      properties: currentNode.data.properties,
      type: currentNode.data.type,
      x: currentNode.x + moveX,
      y: currentNode.y + moveY,
    }
  })
  return newTree
}

export const treeToGraph = (rootNode: any) => {
  const nodes: any[] = []
  const edges: any[] = []
  function getNode(current: any, parent = null) {
    const node = {
      ...current,
    }
    nodes.push(node)
    if (current.children && current.children.length) {
      current.children.forEach((subNode: any) => {
        getNode(subNode, node)
      })
    }
    if (parent) {
      const edge = {
        sourceNodeId: parent.id,
        targetNodeId: node.id,
        type: 'polyline',
      }
      edges.push(edge)
    }
  }
  getNode(rootNode)
  return {
    nodes,
    edges,
  }
}

/**
 * 布局
 * @param graphData
 * @returns
 */
export const getLayoutData = (graphData: any) => {
  NODE_SIZE = graphData.nodes.length
  const tree = graphToTree(graphData)
  console.log(graphData, 'graphData---')
  tree.isRoot = true

  const newTree = layoutTree(tree)
  return treeToGraph(newTree)
}
