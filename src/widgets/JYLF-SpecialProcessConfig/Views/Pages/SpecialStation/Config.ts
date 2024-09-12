import { reactive } from 'vue'
export const columns = reactive([
  {
    type: 'seq',
    width: 60,
    title: '序号',
  },
  {
    field: 'workStationName',
    title: '工位名称',
  },

  {
    field: 'workSectionName',
    title: '所属工序',
    width: 350,
  },
  {
    field: 'leakageTesterParam',
    title: '试漏仪参数配置',
  },
  {
    field: 'leakageTesterDevice',
    title: '试漏仪设备配置',
  },
  {
    field: 'printConfig',
    title: '标签打印配置',
  },
  {
    field: 'laserCodingConfig',
    title: '激光打码模式',
  },
])
