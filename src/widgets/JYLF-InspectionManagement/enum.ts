import { reactive, ref, onMounted } from 'vue'

export const statusMap: any = {
  0: '未开始',
  1: '点检中',
}

export const ViewDetailColumnsStatusMap: any = {
  0: '点检中',
  1: '合格',
  2: '不合格',
}

export const ChooseWorkStationColumns = [
  {
    field: 'workSectionName',
    title: '工序名称',
  },
  {
    field: 'workSectionCode',
    title: '工序编号',
  },
  {
    field: 'workStationName',
    title: '工位名称',
  },
]

export const TaskDialogColumns = [
  {
    title: '次数',
    type: 'seq',
    width: 80,
  },
  {
    field: 'judge',
    title: '结果要求',
  },
]

export const VariableSettingColumns = [
  {
    field: 'workSectionName',
    title: '工序名称',
  },
  {
    field: 'workStationName',
    title: '工位名称',
  },
  {
    field: 'checkResultTag',
    title: '点检合格信号',
  },
  {
    field: 'blockTag',
    title: '点检屏蔽信号',
  },
]

export const permissionCodes = {
  'task-list': '点检管理-点检任务',
  'record-list': '点检管理-点检记录',
}
