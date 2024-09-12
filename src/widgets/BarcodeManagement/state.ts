import { Ref, ref } from 'vue'

export interface Row {
  id?: string
  name?: string
  codeDemo?: string
  remark?: string
  barcodeGenerationDetails: BarcodeDetails
}
export interface BarcodeDetails {
  /**条码段名称*/
  name?: string
  /**条码段类型：固定字符：1、自增数字：3、系统字段：10、条码字段：11、业务字段：13、关联变量：7*/
  type?: number
  /**条码段示例*/
  codeDemo?: string
  /**条码段内容*/
  content?: string
  /**位数*/
  digit?: number
  /**排序*/
  sort?: number
  /**格式：比如系统字段时时间格式：YYYY/MM/DD*/
  format?: string
  /**自增数字类型时，按型号/日期自增:1,按工单/日期自增:3,按工单自增:5,按型号自增:7,按日期自增:9*/
  buildType?: number
  /**自增数字进制*/
  decimalSystem?: number
  /**业务对象,工单：1*/
  bussinessObj?: number
  /**关联字段详情，传勾选的项*/
  barcodeRuleItem?: { name: string; key: string }[]
  /**父级ID,条码类型时，传关联字段所勾选的项对于的key*/
  parentID?: string
  /**关联条码下拉框对应的下拉框key值*/
  associatedBarcode?: string
  /**变量名*/
  varName?: string
  /**业务对象,勾选所对应的ID*/
  bussinessID?: number
}
export const columns = [
  {
    title: '序号',
    type: 'seq',
    width: '60',
  },
  {
    title: '条码规则名称',
    field: 'name',
  },
  {
    title: '状态',
    field: 'isUsed',
  },
  {
    title: '条码段组成',
    field: 'barcodeGenerationDetailsDisplay',
  },
  {
    title: '条码示例',
    field: 'codeDemo',
  },
  {
    title: '更新时间',
    field: 'lastModificationTime',
    width: '200',
    sortable: true,
  },
  {
    title: '备注',
    field: 'remark',
    width: '200',
  },
  // {
  //   title: '操作',
  //   field: 'action',
  //   width: '250',
  // },
]

export const current = ref<any>(null)

export const BarcodeAnalysisColumns = [
  {
    title: '序号',
    type: 'seq',
    width: '60',
  },
  {
    title: '条码规则名称',
    field: 'name',
  },
  {
    title: '状态',
    field: 'isUsed',
    width: '90',
  },
  {
    title: '条码段组成',
    field: 'barcodeSegmentComposition',
    width: '250',
  },
  {
    title: '条码示例',
    field: 'codeDemo',
  },
  {
    title: '解析类型',
    field: 'type',
    width: '90',
  },
  {
    title: '具体规则',
    field: 'rule',
  },
  {
    title: '更新时间',
    field: 'lastModificationTime',
    width: 180,
  },
  {
    title: '备注',
    field: 'remark',
    width: '100',
  },
  // {
  //   title: '操作',
  //   field: 'action',
  //   width: '240',
  // },
]
/**解析类型*/
export const BarcodeAnalysisType = {
  0: '分隔符号',
  1: '起止符号',
  2: '固定长度',
}
export interface BarcodeAnalysisRow {
  id?: number | string
  name?: string
  /**示例*/
  codeDemo?: string
  /**解析类型：1分隔符号，3起始符号，5固定长度*/
  type?: number
  /**分隔符号*/
  symbol?: string
  /**起始符号*/
  startSymbol?: string
  /**终止符号*/
  endSymbol?: string
  /**固定长度*/
  fixedLength?: string
  /**校验类型：1总位数校验，3条码段位数校验，5条码段内容校验*/
  verificationType?: number
  /**校验条码段*/
  verifyBarcode?: string
  verifyBarcodeSegment?: string
  /**校验类型中文*/
  displayVerificationType?: string
  /**名称*/
  remark?: string
  barcodeAnalysisDetails?: any[]
}

export const BarcodeAnalysisCurrent: Ref<any> = ref(null)

export const BarcodeCheckRuleColumns = [
  {
    title: '序号',
    type: 'seq',
    width: '60',
  },
  {
    title: '条码规则名称',
    field: 'name',
  },
  {
    title: '状态',
    field: 'isUsed',
  },
  {
    title: '校验条码',
    field: 'verificationRuleDisplay',
  },
  {
    title: '校验类型',
    field: 'verificationTypeDisplay',
  },
  {
    title: '更新时间',
    field: 'lastModificationTime',
    width: '200',
    sortable: true,
  },
  {
    title: '备注',
    field: 'remark',
    width: '200',
  },
]


export const BarcodeCheckType = {
  0: '原始条码',
  1: '解析条码段',
}