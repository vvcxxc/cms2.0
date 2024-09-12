import dayjs from 'dayjs'

export const btnListOptions = [
  {
    key: 0,
    text: '固定字符',
  },
  {
    key: 1,
    text: '自增数字',
  },
  {
    key: 3,
    text: '关联字段',
  },
  {
    key: 2,
    text: '关联变量',
  },
]

export const btnMap = {
  1: 'fixed',
  3: 'increment',
  5: 'field',
  7: 'variable',
}

export const rules = {
  name: [
    {
      required: true,
      message: '请输入',
    },
  ],
  content: [
    {
      required: true,
      message: '请输入',
    },
  ],
  autoIncrementType: [
    {
      required: true,
      message: '请选择',
    },
  ],
  carrySystemType: [
    {
      required: true,
      message: '请选择',
    },
  ],
  format: [
    {
      required: true,
      message: '请选择',
    },
  ],
  barcodeAnalysisId: [
    {
      required: true,
      message: '请选择',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择',
    },
  ],
  varName: [
    {
      required: true,
      message: '请选择',
    },
  ],
  barcodeGenerationDetails: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (!value?.length) {
          callback(new Error('不能为空'))
        } else {
          callback()
        }
      },
    },
  ],
}

export const BarcodeAnalysisRules = {
  name: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  codeDemo: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  symbol: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  startSymbol: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  endSymbol: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  fixedLength: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
}

export const BarcodeCheckRules = {
  name: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  verificationRule: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  verificationType: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur',
    },
  ],
  barcodeAnalysisId: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  barcodeAnalysisDetails: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
  barcodeLength: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  ],
}

// 条码段类型
export const barCodeMap = {
  0: '固定字符',
  1: '自增数字',
  2: '关联变量',
  3: '系统字段',
  4: '业务字段',
  5: '规则解析字段',
}

export const options = [
  {
    label: '系统字段',
    value: 10,
  },
  {
    label: '条码字段',
    value: 11,
  },
  {
    label: '业务字段',
    value: 13,
  },
]

export const businessOptions = [
  {
    label: '工单',
    value: '1',
  },
]

export const columns1 = [
  {
    title: '序号',
    type: 'seq',
    width: '100',
  },
  {
    title: '字段名称',
    field: 'fieldName',
  },
  {
    title: '<span style="color:red">*</span>条码段示例',
    field: 'codeDemo',
    type: 'html',
  },
]

export const columns2 = [
  {
    title: '序号',
    type: 'seq',
    width: '100',
  },
  {
    title: '字段名称',
    field: 'name',
  },
  {
    title: '条码段示例',
    field: 'codeDemo',
    type: 'html',
  },
]

// 自增数字类型
export const numbOptions = [
  {
    label: '按型号/日期自增',
    value: 1,
  },
  {
    label: '按工单/日期自增',
    value: 3,
  },
  {
    label: '按工单自增',
    value: 5,
  },
  {
    label: '按型号自增',
    value: 7,
  },
  {
    label: '按日期自增',
    value: 9,
  },
]

// 日期格式
export const dayFormatOption = [
  {
    label: 'YYYYMMDD',
    value: 'YYYYMMDD',
  },
  {
    label: 'YYMMDD',
    value: 'YYMMDD',
  },
  {
    label: 'YYMMDDHHMMSS',
    value: 'YYMMDDHHMMSS',
  },
]

export const entity = {
  barcodeID: undefined,
  type: undefined,
  name: undefined,
  content: undefined,
  digit: undefined,
  sort: undefined,
  format: '',
  buildType: 0,
  bussinessObj: 0,
  bussinessID: 0,
  associatedBarcode: undefined,
  parentID: undefined,
  varName: '',
  concurrencyStamp: undefined,
  id: undefined,
  extraProperties: undefined,
}

export const verificationTypeMap = {
  1: '总位数校验',
  3: '条码段位数校验',
  5: '条码段内容校验',
}

export const dateFormat = [
  {
    label: 'YY/MM',
    value: 0,
  },
  {
    label: 'YY/M',
    value: 1,
  },
  {
    label: 'YYYY/MM',
    value: 2,
  },
  {
    label: 'YY/MM/DD',
    value: 3,
  },
  {
    label: 'YYYY/MM/DD',
    value: 4,
  },
  {
    label: 'YY/M/DD',
    value: 5,
  },
  {
    label: 'YY/MM/DD/hh/mm/ss',
    value: 6,
  },
]

export const dateFormatDemo = (val: string) => {
  const formatFlag = val.split('/')
  const month = { 10: 'A', 11: 'B', 12: 'C' }
  return dayjs(new Date())
    .format(val)
    .split('/')
    .map((e, i) => {
      if (e.length !== formatFlag[i].length) {
        e = month[e]
      }
      return e
    })
    .join('')
}
