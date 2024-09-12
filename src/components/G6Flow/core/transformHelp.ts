import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import {
  CURVE,
  NODES,
  ActivityKey,
  TransitionKey,
  ConditionKey,
  ConditionType,
} from './enum'
import { v4 as uuidv4 } from 'uuid'
import { injectStore } from './store'
import { Condition, FlowType } from '../type'
import { cloneDeep, isNil, set, get } from 'lodash'
import { nodeFontSize } from '../components/Nodes'
const { flowMap, xmlData, flowNodeMap } = injectStore()

import G6 from '@antv/g6'

export const isFirstLetterUpperCase = (str: string) => {
  // 使用正则表达式检查首字母是否为大写
  return /^[A-Z]/.test(str) || str === ConditionType
}

export const fittingString = (
  str: string,
  maxWidth: number,
  fontSize: number
) => {
  const ellipsis = '...'
  const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0]
  let currentWidth = 0
  let res = str
  const pattern = new RegExp('[\u4E00-\u9FA5]+') // distinguish the Chinese charactors and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth - ellipsisLength) return
    if (pattern.test(letter)) {
      // Chinese charactors
      currentWidth += fontSize
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize)
    }
    if (currentWidth > maxWidth - ellipsisLength) {
      res = `${str.substr(0, i)}${ellipsis}`
    }
  })
  return res
}

/**
 * 获取xml字符串的json对象
 * @param xml
 * @returns
 */
export const getJsonByXml = (xml: string) => {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  }
  const parser = new XMLParser(options)
  const json = parser.parse(xml)
  xmlData.value = json
  return json
}

/**
 * 转换流程图数据为xml
 * @param flowData
 */
export const getFlowDataToXml = ({ nodes, edges }: FlowType) => {
  console.log({ nodes, edges }, '{ nodes, edges }>>>>>>')
  const Activity: any[] = []
  const Transition: any[] = []
  const nodeMap: Record<string, any> = {}

  nodes.forEach((item) => {
    const obj: Record<string, any> = {}
    Object.keys(item.properties || {}).forEach((key) => {
      if (isFirstLetterUpperCase(key)) {
        obj[key] = item.properties[key]
      }
    })
    const oldId = item?.properties?.oldId
    const flow = flowMap.get(oldId)
    obj.Name = flow?.properties?.Name || item.properties.Name || ''
    nodeMap[obj.Name] = {
      x: item.x,
      y: item.y,
    }
    Activity.push(obj)
  })

  edges.forEach((item) => {
    const obj: Record<string, any> = {}
    Object.keys(item?.properties || {}).forEach((key) => {
      if (isFirstLetterUpperCase(key)) {
        obj[key] = item.properties[key]
      }
      const condition = item.properties?.Condition || {}
      Object.keys(condition || {}).forEach((key) => {
        obj.Condition = obj.Condition || {}
        if (isFirstLetterUpperCase(key)) {
          obj.Condition[key] = condition[key]
        }
      })
    })
    obj.Condition = handleConditionChildren(obj.Condition)

    if (!Object.keys(obj.Condition).length) {
      delete obj.Condition
    }
    const oldSourceId = item.properties?.oldSourceId
    const oldTargetId = item.properties?.oldTargetId
    const flowSource = flowMap.get(oldSourceId)
    const flowTarget = flowMap.get(oldTargetId)
    if (oldSourceId && oldTargetId) {
      obj.Source = flowSource?.properties?.Name || ''
      obj.Sink = flowTarget?.properties?.Name || ''
    } else {
      const sourceName = flowNodeMap.get(item?.source)?.name
      const sinkName = flowNodeMap.get(item?.target)?.name
      obj.Source = sourceName
      obj.Sink = sinkName
    }
    nodeMap[`${obj.Source}_${obj.Sink}`] = {
      controlPoints: item.controlPoints,
      endPoint: item.endPoint,
      startPoint: item.startPoint,
    }
    Transition.push(obj)
  })

  // 流程图结构
  return getXmlByJson(Activity, Transition, nodeMap)
}
/**
 * 转换对象，小写和大写的分流
 */
export const translationObj = (obj: Record<string, any>) => {
  const up: Record<string, any> = {}
  const low: Record<string, any> = {}
  if (isNil(obj)) return null
  Object.entries(obj).forEach(([key, value]) => {
    if (isFirstLetterUpperCase(key)) {
      up[key] = value
    } else {
      low[key] = value
    }
  })
  return {
    up,
    low,
  }
}
/**
 * 处理复杂条件的子集
 */
const handleConditionChildren = (condition: Condition) => {
  const newCondition = cloneDeep(condition)
  const deepConditionFn = (condition: Condition) => {
    let conditionObj: any = {}
    const obj = translationObj(condition)

    if (Array.isArray(condition?.children) && condition?.children?.length > 0) {
      const Condition: any[] = []
      condition?.children.forEach((item) => {
        Condition.push(deepConditionFn(item))
      })
      conditionObj = {
        Conditions: {
          Condition,
        },
      }
    }
    if (obj) {
      Object.assign(conditionObj, obj.up)
    }
    return conditionObj
  }
  return deepConditionFn(newCondition)
}

/**
 * 处理Name为Id的情况，为可改动
 * 数据转换，将Id换成UUID
 */
export const transformFlowStructByNodeId = ({
  nodes,
  edges,
}: {
  nodes: any[]
  edges: any[]
}) => {
  const newNodes = nodes.map((item) => {
    const { id } = item.properties
    const uuid = uuidv4()
    const node = {
      ...item,
      id: uuid,
      name: id,
      type: NODES.ACTIVITIES,
      properties: {
        ...item.properties,
        name: id,
        id: uuid,
        oldId: id,
      },
    }
    flowMap.set(id, node)
    flowNodeMap.set(uuid, node)
    return node
  })

  const newEdges = edges.map((item) => {
    const { sourceNodeId, targetNodeId } = item
    const id = uuidv4()
    return {
      ...item,
      id,
      type: 'polyline',
      targetNodeId: flowMap.get(targetNodeId)?.id || '',
      target: flowMap.get(targetNodeId)?.id || '',
      source: flowMap.get(sourceNodeId)?.id || '',
      sourceNodeId: flowMap.get(sourceNodeId)?.id || '',
      properties: {
        ...item.properties,
      },
    }
  })
  return {
    nodes: newNodes,
    edges: newEdges,
  }
}
/**
 * 获取并解析流程图结构
 * @param data
 * @returns
 */
export const getLogicFLowStruct = (data: Record<string, any>) => {
  if (Object.keys(data).length === 0) return null
  // 边
  const Transition =
    data?.ProcessflowDefine?.Define?.ProcessflowBuilder?.Transitions
      .Transition || []
  // 节点
  const Activities =
    data?.ProcessflowDefine?.Define?.ProcessflowBuilder?.Activities.Activity ||
    []
  const nodeMap =
    data?.ProcessflowDefine?.Appearance.ProcessflowAppearance || {}
  const Root = data?.ProcessflowDefine.Define.ProcessflowBuilder.Root
  const nodes = Activities.map((item: Record<string, any>) => {
    const type = item[ConditionType]
    const isEnd = type === NODES.END_ACTIVITY
    const { x, y } = nodeMap[item.Name] || {}
    return {
      id: item.Name,
      type: isEnd ? NODES.END_ACTIVITY : NODES.ACTIVITIES,
      x: x || item.x || 0,
      y: y || item.y || 0,
      text: {
        x: item.x || 0,
        y: item.y || 0,
      },
      label: fittingString(item.Name, 195, nodeFontSize + 2),
      properties: {
        ...item,
        name: item.Alias,
        type: item[ConditionType],
        id: item.Name,
        label: item.Name,
      },
    }
  })
  const { x, y } = nodeMap[Root.Name] || {}
  nodes.unshift({
    id: Root.Name,
    type: NODES.ACTIVITY,
    x: x || 0,
    y: y || 0,
    text: {
      x: 0,
      y: 0,
    },
    label: fittingString(Root.Name, 195, nodeFontSize + 2),
    properties: {
      ...Root,

      type: Root[ConditionType],
      id: Root.Name,
      name: Root.Alias,
      label: Root.Name,
    },
  })
  // 判断是否需要自定义布局
  nodes[0].isEdit = !!(x + y)
  const edges = Transition.map((item: Record<string, any>, index: number) => {
    const Condition = item?.Condition
      ? handlerConditionToChildren(item?.Condition)
      : {}
    const edgeItem = nodeMap[`${item.Source}_${item.Sink}`] || {}
    return {
      id: index + 1,
      type: CURVE,
      targetNodeId: item.Sink,
      sourceNodeId: item.Source,
      // text: {
      //   x: 0,
      //   y: 0,
      //   value: item?.Condition?.Label,
      // },
      label: item?.Condition?.Label || '',
      properties: {
        ...item,
        Condition,
        oldSourceId: item.Source,
        oldTargetId: item.Sink,
        name: item?.Label,
      },
      ...edgeItem,
    }
  })

  const flows = { nodes, edges }
  return transformFlowStructByNodeId(flows)
}

/**
 * 将Condition处理成tree结构
 */
const handlerConditionToChildren = (c: any) => {
  const condition = cloneDeep(c)
  const getConditionTree = (condition: any) => {
    let newCondition: any = {}
    // 复合条件-> Condition

    if (condition?.Conditions) {
      const Condition = condition.Conditions?.Condition
      const children = []
      if (!Array.isArray(Condition) && Condition[ConditionType]) {
        children.push(Condition)
      } else {
        children.push(...Condition)
      }
      if (Array.isArray(children) && children?.length > 0) {
        const newChildren: any[] = []
        children.forEach((child) => {
          newChildren.push(getConditionTree(child))
        })
        newCondition.children = newChildren
      }
      delete condition.Conditions
    }
    Object.assign(newCondition, condition)
    return newCondition
  }
  return getConditionTree(condition)
}

/**
 * 获取json的xml字符串
 * @param json
 * @returns
 */
export const getXmlByJson = (
  Activity: any[],
  Transition: any[],
  ProcessflowAppearance?: any
) => {
  const json = cloneDeep(xmlData.value)
  const Root = Activity.shift()
  const flowAppearance = get(
    json,
    'ProcessflowDefine.Appearance.ProcessflowAppearance'
  )
  set(
    json,
    'ProcessflowDefine.Define.ProcessflowBuilder.Transitions.Transition',
    Transition
  )
  set(
    json,
    'ProcessflowDefine.Define.ProcessflowBuilder.Activities.Activity',
    Activity
  )

  set(json, 'ProcessflowDefine.Define.ProcessflowBuilder.Root', Root)
  set(json, 'ProcessflowDefine.Appearance.ProcessflowAppearance', {
    '@_xmlns:xsi': flowAppearance['@_xmlns:xsi'],
    '@_xmlns:xsd': flowAppearance['@_xmlns:xsd'],
    ...ProcessflowAppearance,
  })

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
  })
  const xml = builder.build(json)

  return xml
}
/**
 * 首字母小写
 * @param str
 * @returns
 */
export const toLowerCaseFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * 筛选节点的target线条有哪些，用来开启动画
 * @param nodeId
 * @param edges
 * @returns
 */
export const getNodeTargetLines = (
  nodeId: string,
  edges: Record<string, any>[]
) => {
  const lines = edges.filter((item: Record<string, any>) => {
    return item.targetNodeId === nodeId
  })
  return lines
}
