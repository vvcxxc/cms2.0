import { reactive, ref, onMounted } from 'vue'
import { useGlobalState } from '@/libs/Store/Store'

let state = {}

onMounted(() => {
  const { productionLineList } = useGlobalState()
  state = productionLineList.state
})

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
    el: 'input',
    required: true,
  },
  {
    title: '判断值',
    field: 'judgmentValue',
    el: 'input',
    required: true,
  },
  {
    title: '不良品原因变量',
    field: 'variable',
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
    field: 'value',
    el: 'tag',
    required: true,
  },
]
// 采集参数
export const paramsColumns = [
  {
    title: '参数名',
    field: 'name',
    required: true,
  },
  {
    title: '参数描述',
    field: 'description',
  },
  {
    title: '采集变量',
    field: 'variable',
    el: 'variable',
    required: true,
  },
]

// 配方参数
export const formulaColumns = [
  {
    title: '参数名',
    field: 'name',
    required: true,
  },
  {
    title: '参数描述',
    field: 'description',
  },
  {
    title: '下发关联变量',
    field: 'deliverVariable',
    el: 'variable',
  },
  {
    title: '监听关联变量',
    field: 'watchVariable',
    el: 'variable',
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
    field: 'value',
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
    field: 'value',
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
    field: 'materialTypeDisplay',
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

/**
 * 关联物料
 */
export const relationFlowColumns = [
  {
    title: '流程名称',
    field: 'name',
  },
  {
    title: '交互类型',
    field: 'type',
  },
  {
    title: '功能项',
    field: 'abilitys',
  },
  {
    title: '关联工序',
    field: 'associationObjects',
  },
  {
    title: '备注',
    field: 'remark',
  },
]

/**
 * 添加工序的form字段
 */
export const formItems = reactive([
  {
    label: '工序名称',
    prop: 'name',
    el: 'input',
    placeholder: '请输入工序描述',
    rules: [{ required: true, message: '工序名称', trigger: 'blur' }],
  },
  {
    label: '工序编号',
    prop: 'code',
    el: 'input',
    placeholder: '请输入工序编号',
  },
  {
    label: '所属产线段',
    prop: 'segment',
    el: 'select',
    placeholder: '请选择产线段',
    options: state,
    width: '100%',
  },
  {
    label: '关联流程',
    prop: 'flowDefinitions',
    el: 'flow',
    placeholder: '请选择关联流程',
    collapseTags: true,
    maxCollapseTags: 8,
    labelIcon: 'refresh',
    width: '100%',
  },
  {
    label: '备注',
    prop: 'remark',
    el: 'input',
    placeholder: '请输入',
    type: 'textarea',
    rows: 3,
  },
])

/**
 * 工位默认需要提交的key
 */
export const stationKeys = [
  'abilitys',
  'formula',
  'materiel',
  'params',
  'quality',
]
