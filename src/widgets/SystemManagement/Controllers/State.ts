import { Create } from '@/libs/Create/Create'
import { SetupContext, reactive, ref, onMounted } from 'vue'
import type { ConfigureCodeType } from '../type/Configure.d'
import uniqWith from 'lodash/uniqWith'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
//   产线代码：SCMS.AppSettings.ProductionLineCode
// 产线结构：SCMS.AppSettings.ProductionLineStructure 产线结构（0=工序 -工位，1=产线段 -工序 -工位）
// 产线段定义：SCMS.AppSettings.ProductionLineSegment
// 物料产品关联工序：SCMS.AppSettings.MaterialAssociationConfig
// 进站结果值配置：SCMS.AppSettings.EntryResultConfig
// 补充说明映射：SCMS.AppSettings.AbnormalCauseConfig
// 业务字段配置：SCMS.AppSettings.BusinessFiled
// SCMS.AppSettings.EnableDebugMode    1=启用调试模式，0=禁用调试模式
// SCMS.AppSettings.FormulaDistributionMode
// ManualRepair_Enabled: string
// /**
//  * 设备返修
//  */
// EquipmentRepair_Enabled: string
// /**
//  * 产品报废
//  */
// Scrap_Enabled: string
// /**
//  * NG品流出
//  */
// NgProductOutflow_Enabled: string
const f = new Create<ConfigureCodeType>({
  ProductionLineCode: '',
  ProductionLineStructure: '',
  ProductionLineSegment: [],
  MaterialAssociationConfig: '',
  EntryResultConfig: '',
  AbnormalCauseConfig: '',
  BusinessFiled: '',
  EnableDebugMode: 0,
  FormulaDistributionMode: 0,
  ManualRepair_Enabled: 1,
  EquipmentRepair_Enabled: 1,
  Scrap_Enabled: 1,
  NgProductOutflow_Enabled: 1,
  Sop_Enabled: 0,
  ShowTraceDataWithLatestData: 1,
  TimeRangeForDetection: 0,
  PluginState: 1,
  FormulaSwitchingSignal: '',
  FormulaTag: '',
  FormulaAllowSignal: '',
  FormulaMaximumWaitingTime: '',
  LeakDetectorMaximumWaitingTime: '',
  EquipmentNumber: '',
  DeviceName: '',
  LoginSigal: '',
  CredentialTag: '',
})
export const formData = reactive<ConfigureCodeType>(
  f as unknown as ConfigureCodeType
)
/**
 * 表单form
 */
export const formRef = ref()

/**
 * 产线段表格ref
 */
export const productTableRef = ref()

export const systemData = ref<any>({})

export const checkUnique = (v: any[]) => {
  const data = cloneDeep(v)
  const name = data.map((item) => ({
    name: item.name,
  }))
  const product = data.map((item) => ({
    product: item.product,
  }))
  return (
    !isEqual(name, uniqWith(name, isEqual)) ||
    !isEqual(product, uniqWith(product, isEqual))
  )
}
