import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { CURVE, NODES, ActivityKey, TransitionKey, ConditionKey } from './enum'
import { BaseEdgeModel, BaseNodeModel } from '@logicflow/core'
import { v4 as uuidv4 } from 'uuid'
import { injectStore } from './store'
import { FlowType } from '../type'
import { cloneDeep, set } from 'lodash'
const { flowMap, xmlData } = injectStore()

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
 * 获取json的xml字符串
 * @param json
 * @returns
 */
export const getXmlByJson = (Activity: any[], Transition: any[]) => {
  const json = cloneDeep(xmlData.value)
  const Root = Activity.shift()
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

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
  })
  const xml = builder.build(json)

  return xml
}

/**
 * 转换流程图数据为xml
 * @param flowData
 */
export const getFlowDataToXml = ({ nodes, edges }: FlowType) => {
  const Activity: any[] = []
  const Transition: any[] = []
  // Activity
  nodes.forEach((item) => {
    const obj: Record<string, any> = {}
    Object.keys(item.properties || {}).forEach((key) => {
      if (ActivityKey.includes(key)) {
        obj[key] = item.properties[key]
      }
    })
    const oldId = item?.properties?.oldId
    obj.Name = flowMap.get(oldId)?.properties?.Name || ''
    Activity.push(obj)
  })

  edges.forEach((item) => {
    const obj: Record<string, any> = {}
    Object.keys(item.properties).forEach((key) => {
      if (TransitionKey.includes(key)) {
        obj[key] = item.properties[key]
      }
      const condition = item.properties?.Condition || {}
      Object.keys(condition || {}).forEach((key) => {
        obj.Condition = obj.Condition || {}
        if (ConditionKey.includes(key)) {
          obj.Condition[key] = condition[key]
        }
      })
    })
    const oldSourceId = item.properties?.oldSourceId
    const oldTargetId = item.properties?.oldTargetId
    obj.Source = flowMap.get(oldSourceId)?.properties?.Name || ''
    obj.Sink = flowMap.get(oldTargetId)?.properties?.Name || ''
    Transition.push(obj)
  })
  // 流程图结构
  getXmlByJson(Activity, Transition)
}

/**
 * 处理Name为Id的情况，为可改动
 * 数据转换，将Id换成UUID
 */
export const transformFlowStructByNodeId = ({
  nodes,
  edges,
}: {
  nodes: BaseNodeModel[]
  edges: BaseEdgeModel[]
}) => {
  const newNodes = nodes.map((item) => {
    const { id } = item.properties
    const uuid = uuidv4()
    const node = {
      ...item,
      id: uuid,
      dataType: 'alps',
      name: id,
      type: 'sql',
      properties: {
        ...item.properties,
        name: id,
        id: uuid,
        oldId: id,
      },
    }
    flowMap.set(id, node)
    return node
  })

  const newEdges = edges.map((item) => {
    const { sourceNodeId, targetNodeId } = item
    const Id = uuidv4()
    return {
      ...item,
      id: Id,
      type: 'polyline',
      targetNodeId: flowMap.get(targetNodeId)?.id || '',
      target: flowMap.get(targetNodeId)?.id || '',
      source: flowMap.get(sourceNodeId)?.id || '',
      sourceNodeId: flowMap.get(sourceNodeId)?.id || '',
      properties: {
        ...item.properties,
        Id,
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
  const Transition =
    data?.ProcessflowDefine?.Define?.ProcessflowBuilder?.Transitions
      .Transition || []
  const Activities =
    data?.ProcessflowDefine?.Define?.ProcessflowBuilder?.Activities.Activity ||
    []

  const Root = data?.ProcessflowDefine.Define.ProcessflowBuilder.Root

  const nodes = Activities.map((item: Record<string, any>) => {
    const type = item['@_xsi:type']
    const isEnd = type === NODES.END_ACTIVITY
    return {
      id: item.Name,
      // 获取x/y坐标
      // type: item['@_xsi:type'],
      type: isEnd ? NODES.END_ACTIVITY : NODES.ORDINARY_NODE,
      x: item.x || 0,
      y: item.y || 0,
      text: {
        x: item.x || 0,
        y: item.y || 0,
        // value: isEnd ? '' : item.Alias,
      },
      properties: {
        ...item,
        name: item.Alias,
        type: item['@_xsi:type'],
        id: item.Name,

        // source: {
        //   ...item,
        // },
      },
    }
  })
  nodes.unshift({
    id: Root.Name,
    type: NODES.ACTIVITY,
    x: 0,
    y: 0,
    text: {
      x: 0,
      y: 0,
      // value: Root.Name,
    },
    properties: {
      ...Root,

      type: Root['@_xsi:type'],
      id: Root.Name,
      name: Root.Alias,
      // source: {},
    },
  })
  const edges = Transition.map((item: Record<string, any>, index: number) => {
    return {
      id: index + 1,
      type: CURVE,
      // 获取x/y坐标
      targetNodeId: item.Sink,
      sourceNodeId: item.Source,
      text: {
        x: 0,
        y: 0,
        value: item?.Condition?.Label,
      },
      properties: {
        ...item,
        oldSourceId: item.Source,
        oldTargetId: item.Sink,
        name: item?.Label,
      },
    }
  })
  const flows = { nodes, edges }
  const d = transformFlowStructByNodeId(flows)
  console.log(d, '--===')
  return d
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
