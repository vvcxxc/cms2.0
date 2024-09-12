export const processColumns = [
  {
    title: '工序序号',
    field: 'oper',
    width: 150,
  },
  {
    title: '工艺路线版本',
    field: 'floW_SEQ',
    width: 150,
  },
  {
    title: '工艺路线',
    field: 'flow',
    width: 150,
  },
  {
    title: '工序标准文本码',
    field: 'oper',
    width: 150,
  },
  {
    title: '工序名称',
    field: 'opeR_NAME',
    width: 150,
  },
  {
    title: '前一工序文本码',
    field: 'prE_OPER',
    width: 150,
  },
  {
    title: '后一工序文本码',
    field: 'nexT_OPER',
    width: 150,
  },
  {
    title: '计划开始时间',
    field: 'plaN_STAR_TIME',
    width: 150,
  },
  {
    title: '计划结束时间',
    field: 'plaN_END_TIME',
    width: 150,
  },
  {
    title: '对应主工艺路线',
    field: 'maiN_FLOW',
    width: 150,
  },
]
export const bomColumns = [
  {
    title: 'BOM编号',
    field: 'boM_SET_ID',
  },
  {
    title: '物料描述',
    field: 'maT_DESC',
  },
  {
    title: '数量',
    field: 'maT_QTY',
  },
  {
    title: '重要追溯件',
    field: 'seriaL_INPUT_FLAG',
  },
  {
    title: '所属工序',
    field: 'oper',
  },
]
export const lotColumns = [
  {
    title: 'LOT号',
    field: 'loT_ID',
  },
  {
    title: 'LOT描述',
    field: 'loT_DESC',
  },
  {
    title: 'LOT状态',
    field: 'loT_STATUS',
  },
  {
    title: 'LOT类型',
    field: 'loT_TYPE',
  },
  {
    title: '序列号',
    field: 'subloT_ID',
  },
]
