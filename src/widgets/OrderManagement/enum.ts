export const DIALOG_STATUS = {
  ADD: 'add',
  EDIT: 'edit',
}

export const DIALOG_STATUS_OPTIONS = [
  { label: '创建工单', value: DIALOG_STATUS.ADD },
  { label: '编辑工单', value: DIALOG_STATUS.EDIT },
]

export const ORDER_STATUS = {
  NOT_ACTIVE: -2, // 未激活
  PAUSED: -1, // 已暂停
  PRODUCED: 0, // 待生产
  PRODUCTION: 1, // 生产中
  FINISHED: 4, // 已完成
  ENDED: 5, // 已结束
}

export const ORDER_STATUS_MAP = {
  [ORDER_STATUS.NOT_ACTIVE]: '未激活',
  [ORDER_STATUS.PAUSED]: '已暂停',
  [ORDER_STATUS.PRODUCED]: '待生产',
  [ORDER_STATUS.PRODUCTION]: '生产中',
  [ORDER_STATUS.FINISHED]: '已完成',
  [ORDER_STATUS.ENDED]: '已结束',
}

export const ORDER_STATUS_OPTIONS = [
  { label: '已暂停', value: ORDER_STATUS.PAUSED },
  { label: '待生产', value: ORDER_STATUS.PRODUCED },
  { label: '生产中', value: ORDER_STATUS.PRODUCTION },
  { label: '已完成', value: ORDER_STATUS.FINISHED },
  { label: '已结束', value: ORDER_STATUS.ENDED },
]

export const ORDER_ACTIONS_STATUS = {
  DELIVER: 'deliver', // 下发
  PAUSE: 'pause', // 暂停
  FINISHED: 'finished', // 结束
  REVOKE: 'revoke', // 撤销
  ACTIVATION: 'activation', // 激活
  EDIT: 'edit', // 编辑
  DELETE: 'delete', //删除
  UPDATE: '更新',
  COMPLTE: '完成',
  UPLOAD: '上传',
  DOWNLOADTEMPLATE: '导出模板',
}

export const TYPE_MAP = {
  PROCESS: 'process',
  BOM: 'bom',
  LOT: 'lot',
}
