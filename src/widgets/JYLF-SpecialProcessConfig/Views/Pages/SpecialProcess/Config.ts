import { reactive } from 'vue'
export const columns = reactive([
  {
    type: 'seq',
    width: 60,
    title: '序号',
  },
  {
    field: 'workSectionName',
    title: '工序名称',
  },
  {
    field: 'workSectionCode',
    title: '工序编号',
  },
  // {
  //   field: 'productionLineSegmentName',
  //   title: '所属产线段',
  //   width: 350,
  // },

  {
    field: 'workSection2DetailParameterDisplayTxt',
    title: '试漏仪参数配置',
  },
])
