import { NODES, TYPE } from './enum'
import { Create } from '@/libs/Create/Create'
import { v4 as uuidv4 } from 'uuid'
import { fontSize, nodeFontSize } from '../components/Nodes'

interface NodeItem {
  type: TYPE.NODE | TYPE.EDGE
  label: string
}

interface PointType {
  x: number
  y: number
  properties: any
}
export default class Core {
  createNode({ label, type }: NodeItem, { x, y, properties }: PointType) {
    const id = uuidv4()
    return new Create({
      id,
      type,
      label,
      x,
      y,
      properties,
      Name: label,
      name: label,
    })
  }
  setDefaultProps() {
    return {
      fitCenter: true,
      animate: true,
      minZoom: 0.2,
      maxZoom: 1.4,
      defaultNode: {
        type: NODES.ACTIVITIES,
        labelCfg: {
          style: {
            fill: '#333',
            fontSize: nodeFontSize,
            textAlign: 'center',
            textBaseline: 'middle',
            fontWeight: 'bold',
          },
        },
      },
      defaultEdge: {
        labelCfg: {
          // refX: 10,
          // refY: -5,
          style: {
            fill: '#333',
            stroke: '#aaa',
            fontSize: fontSize - 2,
          },
        },
        style: {
          radius: 20,
          offset: 45,
          endArrow: true,
          lineWidth: 2,
          stroke: '#aaa',
          // router: true,
        },
      },
      edgeStateStyles: {
        active: {
          stroke: '#5a84ff',
          lineWidth: 2,
          'text-shape': {
            fontSize: fontSize,
          },
        },
        hover: {
          stroke: '#5a84ff',
          lineWidth: 4,
          'text-shape': {
            fontSize: fontSize,
          },
        },
      },
      nodeStateStyles: {
        hover: {
          stroke: '#d9d9d9',
          fill: '#8ca9ff',
          'text-shape': {
            fill: '#fff',
          },
        },
        active: {
          stroke: 'rgb(104 53 255 / 50%)',
          shadowColor: '#5b8ff9',
          shadowBlur: 7,
          'text-shape': {
            fill: '#333',
          },
        },
        selected: {
          stroke: 'rgb(104 53 255 / 50%)',
          fill: '#8ca9ff',
          'text-shape': {
            fill: '#fff',
          },
        },
      },
    }
  }
}
