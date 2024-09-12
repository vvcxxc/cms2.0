import { reactive, h } from 'vue'

/**
 * 流程业务类型
 */
export const flowBusinessType = [
  {
    label: '其他交互',
    value: 0,
  },
  {
    label: '出进站交互',
    value: 1,
  },
  {
    label: '进站交互',
    value: 2,
  },
  {
    label: '出站交互',
    value: 3,
  },
  {
    label: '生成码',
    value: 4,
  },
  {
    label: '标签转码',
    value: 5,
  },
]
/**
 * 对象类型
 */
export const ObjectType = {
  WorkSection: 'WorkSection',
}

export const permissionCodes = {
  'specialWorkSection-list': '特殊工序列表-列表',
  'specialWorkStation-list': '特殊工位-列表',

  'specialWorkSection-detail': '特殊工序列表-试漏仪参数配置',

  'specialWorkStation-leakage': '特殊工位列表-试漏仪设备配置',
  'specialWorkStation-print': '特殊工序列表-标签打印配置',
  'specialWorkStation-laser': '特殊工位列表-激光打码配置',
}
