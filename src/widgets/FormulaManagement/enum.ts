// 补充说明映射
export const productionLine = Symbol('productionLine')

export const mapDescData = [
  {
    reason: '无产品码上传',
    origin: '/[工序编号]/  NO product entry/',
    mapValue: '',
  },
  {
    reason: '产品状态异常',
    origin: '/[工序编号]/Product status is NG/',
    mapValue: '',
  },
  { reason: '进站重码', origin: '/[工序编号]/ Repeated entry/', mapValue: '' },
  {
    reason: '前工序漏加工',
    origin: '/[工序编号]/ Missing processing/',
    mapValue: '',
  },
  {
    reason: '物料校验异常',
    origin: '/[工序编号]/[物料关联变量] checks NG/',
    mapValue: '',
  },
  {
    reason: '工装校验异常',
    origin: '/[工序编号]/ Fixture checks NG/',
    mapValue: '',
  },
  {
    reason: '其他校验异常',
    origin: '/[工序编号]/ other test result is NG/',
    mapValue: '',
  },
  {
    reason: 'MES对接异常',
    origin: '/[工序编号]/ MES connection exception/',
    mapValue: '',
  },
]

export interface TabType {
  label: string
  name: string
  columns?: any[]
  data?: any[]
  isFooter: boolean
  [key: string]: any
}

export const stationTabsMap: Record<string, TabType> = {
  abilitys: {
    label: '功能配置',
    name: 'abilitys',
    isFooter: false,
  },
  params: {
    label: '采集参数',
    name: 'params',
    isContextMenu: true,
    isFooter: true,
  },
  formula: {
    label: '配方参数',
    name: 'formula',
    isFooter: true,
    isContextMenu: true,
  },
  quality: {
    label: '不良原因',
    name: 'quality',
    isFooter: true,
  },
  materiel: {
    label: '物料参数',
    name: 'materiel',
    isFooter: true,
  },
}

/**
 * 不良品
 */
export const qualityColumns = [
  {
    title: '不良品原因名称',
    field: 'name',
    key: 'name',
    el: 'input',
    required: true,
  },
  {
    title: '判断值',
    field: 'value',
    key: 'value',
    el: 'input',
    required: true,
  },
  {
    title: '不良品原因变量',
    field: 'variable',
    key: 'variable',
    el: 'variable',
    required: true,
  },
]

/**
 * 功能配置
 */
export const fnColumn = [
  {
    title: '功能名称',
    field: 'name',
  },
  {
    title: '功能描述',
    field: 'description',
  },
  {
    title: '功能选项',
    field: 'option',
    el: 'tag',
    required: true,
  },
]
// 采集参数
export const paramsColumns = [
  {
    title: '参数名',
    field: 'param',
    key: 'param',
    required: true,
  },
  {
    title: '参数描述',
    field: 'desc',
    key: 'desc',
  },
  {
    title: '采集变量',
    field: 'variable',
    key: 'desc',
    el: 'variable',
    required: true,
  },
]

// 配方参数
export const formulaColumns = [
  {
    title: '参数名',
    field: 'param',
    key: 'param',
    required: true,
  },
  {
    title: '参数描述',
    field: 'desc',
    key: 'desc',
  },
  {
    title: '下发关联变量',
    field: 'delivered',
    key: 'delivered',
    el: 'input',
  },
  {
    title: '监听关联变量',
    field: 'watch',
    key: 'watch',
    el: 'input',
  },
]

// 动态表格配置
export const dyColumns = [
  {
    title: '功能字段',
    field: 'fnField',
    key: 'fnField',
  },
  {
    title: '描述',
    field: 'desc',
    key: 'desc',
  },
  {
    title: '变量规则',
    field: 'rule',
    key: 'rule',
    el: 'input',
  },
]

export const dyColumnsMap = {
  name: {
    title: '功能字段',
    field: 'name',
    key: 'name',
  },
  description: {
    title: '描述',
    field: 'description',
    key: 'description',
  },
  rule: {
    title: '变量规则',
    field: 'rule',
    key: 'rule',
    el: 'input',
    required: true,
  },
}

/**
 * 关联物料
 */
export const relationColumns = [
  {
    title: '物料编号',
    field: 'code',
  },
  {
    title: '物料名称',
    field: 'name',
  },
  {
    title: '物料类型',
    field: 'type',
  },
  {
    title: '关联工序',
    field: 'process',
  },
  {
    title: '单位',
    field: 'unit',
  },
  {
    title: '备注',
    field: 'remark',
  },
]

/**
 * 关联物料
 */
export const relationCodeColumns = [
  {
    title: '规则类型',
    field: 'type',
  },
  {
    title: '条码名称',
    field: 'name',
  },
  {
    title: '条码段组成',
    field: 'barcode',
  },
  {
    title: '条码实例',
    field: 'instance',
  },
  {
    title: '更新时间',
    field: 'updateTime',
  },
  {
    title: '备注',
    field: 'remark',
  },
]

export const permissionCodes = {
  'formula-management-add': '配方管理-添加',
  'formula-management-edit': '配方管理-编辑',
  'formula-management-import': '配方管理-导入',
  'formula-management-export': '配方管理-导出',
  'formula-management-delete': '配方管理-删除',
  'formula-management-create-copy': '配方管理-复制',
  'formula-management-version': '配方管理-版本',
  'formula-management-distribute': '配方应用-配方下发',
  'formula-management-log-export': '配方日志-导出',
}
