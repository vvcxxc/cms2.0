import { reactive, h } from 'vue'
import { _t } from './app'

// 补充说明映射
export const productionLine = Symbol('productionLine')

export interface TabType {
  label: string
  name: string
  columns?: any[]
  data?: any[]
  isFooter: boolean
  [key: string]: any
}

/**
 * 物料检测
 */
export const materielColumns = [
  {
    title: _t('物料名称'),
    field: 'name',
    key: 'name',
    // el: 'relationMateriel',
  },
  {
    title: _t('物料类型'),
    field: 'description',
    key: 'description',
    // el: 'relationMateriel',
  },
  {
    title: _t('物料检验信号'),
    field: 'verificationSignal',
    key: 'verificationSignal',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
  {
    title: _t('物料条码变量'),
    field: 'barcodeVariable',
    key: 'barcodeVariable',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
  {
    title: _t('物料校验结果'),
    field: 'verificationResultSignal',
    key: 'verificationResultSignal',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
  {
    title: _t('绑定物料'),
    field: 'bindMaterialVariable',
    key: 'bindMaterialVariable',
    el: 'variable',
    required: true,
    tipConfig: {
      tip: _t('物料条码信息缓存变量'),
      icon: 'tip',
      style: { marginRight: '20px' },
    },
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
]
/**
 * 不良品
 */
export const qualityColumns = [
  {
    title: _t('不良品原因名称'),
    field: 'name',
    el: 'input',
    required: true,
  },
  {
    title: _t('判断值'),
    field: 'judgmentValue',
    el: 'input',
    required: true,
  },
  {
    title: _t('不良品原因变量'),
    field: 'variable',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
    required: true,
  },
]

/**
 * 功能配置
 */
export const fnColumn = [
  {
    title: _t('功能名称'),
    field: 'name',
  },
  // 下个版本添加
  // {
  //   title:  _t('所属流程'),
  //   field: 'flow',
  // },
  {
    title: _t('功能描述'),
    field: 'description',
  },
  {
    title: _t('功能选项'),
    field: 'abilityValue',
    el: 'tag',
    // config: {
    //   valueKey: 'value',
    //   labelValue: 'description',
    // },
    required: true,
  },
]
// 采集参数
export const paramsColumns = [
  {
    title: _t('参数名'),
    field: 'name',
    // required: true,
  },
  {
    title: _t('参数描述'),
    field: 'description',
  },
  {
    title: _t('采集变量'),
    field: 'variable',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
    required: true,
  },
]

// 配方参数
export const formulaColumns = [
  {
    title: _t('参数名'),
    field: 'name',
    // required: true,
  },
  {
    title: _t('参数描述'),
    field: 'description',
  },
  {
    title: _t('下发关联变量'),
    field: 'deliverVariable',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
  {
    title: _t('监听关联变量'),
    field: 'watchVariable',
    el: 'variable',
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
]

// 动态表格配置
export const dyColumns = [
  {
    title: _t('功能字段'),
    field: 'fnField',
    key: 'fnField',
  },
  {
    title: _t('描述'),
    field: 'desc',
    key: 'desc',
  },
  {
    title: _t('变量规则'),
    field: 'value',
    el: 'input',
    config: {
      isMultiple: true,
    },
  },
]

export const dyColumnsMap = {
  name: {
    title: _t('功能字段'),
    field: 'name',
    key: 'name',
    el: 'text',
  },
  description: {
    title: _t('描述'),
    field: 'description',
    key: 'description',
  },
  rule: {
    title: _t('变量规则'),
    field: 'value',
    el: 'input',
    customRequired: true,
    config: {
      isMultiple: true,
      type: 'select',
    },
  },
}

/**
 * 关联物料
 */
export const relationColumns = [
  // {
  //   title:  _t('物料编号'),
  //   field: 'code',
  // },
  {
    title: _t('物料名称'),
    field: 'name',
  },
  {
    title: _t('物料类型'),
    field: 'materialTypeDisplay',
  },
  {
    title: _t('关联工序'),
    field: 'associationWorkStation',
  },
  {
    title: _t('单位'),
    field: 'unit',
  },
  {
    title: _t('备注'),
    field: 'remark',
  },
]

/**
 * 关联条码
 */
export const relationCodeColumns = [
  {
    title: _t('序号'),
    field: 'seq',
    type: 'seq',
  },
  {
    title: _t('规则类型'),
    field: 'type',
  },
  {
    title: _t('条码名称'),
    field: 'name',
  },
  {
    title: _t('条码段组成'),
    field: 'barcodeGenerationDetail',
  },
  {
    title: _t('条码示例'),
    field: 'codeDemo',
  },
  {
    title: _t('更新时间'),
    field: 'lastModificationTime',
  },
  {
    title: _t('备注'),
    field: 'remark',
  },
]

export const checkCodeColumns = [
  {
    title: _t('条码名称'),
    field: 'name',
  },
  {
    title: _t('校验类型'),
    field: 'verificationType',
  },
  {
    title: _t('校验条码'),
    field: 'verificationRule',
  },
  {
    title: _t('更新时间'),
    field: 'lastModificationTime',
  },
  {
    title: _t('备注'),
    field: 'remark',
  },
]

/**
 * 关联流程
 */
export const relationFlowColumns = [
  {
    title: _t('流程名称'),
    field: 'name',
  },
  {
    title: _t('交互类型'),
    field: 'type',
  },
  {
    title: _t('功能项'),
    field: 'abilitys',
  },
  {
    title: _t('关联工序'),
    field: 'associationObjects',
  },
  {
    title: _t('备注'),
    field: 'remark',
  },
]

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
/**
 * 分组类型
 */
export const groupType: any = {
  productLine: 1,
  relationFlow: 2,
}

export const permissionCodes = {
  'workSection-list': _t('工序列表-列表'),
  'workStation-list': _t('工位-列表'),
  'workSection-add': _t('工序列表-添加'),
  'workSection-setting': _t('工序列表-设置'),
  'workSection-filter': _t('工序列表-过滤'),
  'workSection-group': _t('工序列表-分组'),
  'workSection-import': _t('工序列表-导入'),
  'workSection-output': _t('工序列表-输出'),
  'workStation-add': _t('工位列表-添加'),
  'workStation-batch-config': _t('工位列表-批量配置'),
  'workStation-filter': _t('工位列表-过滤'),
  'workStation-group': _t('工位列表-分组'),
  'workStation-import': _t('工位列表-导入'),
  'workStation-output': _t('工位列表-输出'),
}
