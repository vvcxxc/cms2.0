import { reactive, h } from 'vue'

/**
 * 流程业务类型
 */
export const flowBusinessType = [
  {
    label: '进出站交互',
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
    label: '其他交互',
    value: 0,
  },
]
/**
 * 对象类型
 */
export const ObjectType = {
  WorkSection: 'WorkSection',
}

// 补充说明映射
export const permissionCodes = {
  'flow-filter': '筛选',
}
