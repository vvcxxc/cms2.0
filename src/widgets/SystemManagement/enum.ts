import { reactive, h } from 'vue'
import { _t } from './app'
// 产线代码：SCMS.AppSettings.ProductionLineCode
// 产线结构：SCMS.AppSettings.ProductionLineStructure 产线结构（0=工序 -工位，1=产线段 -工序 -工位）
// 产线段定义：SCMS.AppSettings.ProductionLineSegment
// 物料产品关联工序：SCMS.AppSettings.MaterialAssociationConfig
// 进站结果值配置：SCMS.AppSettings.EntryResultConfig
// 补充说明映射：SCMS.AppSettings.AbnormalCauseConfig
// 业务字段配置：SCMS.AppSettings.BusinessFiled
// SCMS.AppSettings.EnableDebugMode    1=启用调试模式，0=禁用调试模式
import { ConfigureCodeType } from './type/Configure.d'
export const ConfigureCodeMap: ConfigureCodeType = {
  // 产线代码
  ProductionLineCode: 'SCMS.AppSettings.ProductionLineCode',
  // 产线结构
  ProductionLineStructure: 'SCMS.AppSettings.ProductionLineStructure',
  // 产线段定义
  ProductionLineSegment: 'SCMS.AppSettings.ProductionLineSegment',
  // 物料产品关联工序
  MaterialAssociationConfig: 'SCMS.AppSettings.MaterialAssociationConfig',
  // 进站结果值配置
  EntryResultConfig: 'SCMS.AppSettings.EntryResultConfig',
  // 补充说明映射
  AbnormalCauseConfig: 'SCMS.AppSettings.AbnormalCauseConfig',
  // 业务字段配置
  BusinessFiled: 'SCMS.AppSettings.BusinessFiled',
  // 启用调试模式（1=启用调试模式，0=禁用调试模式）
  EnableDebugMode: 'SCMS.AppSettings.EnableDebugMode',
  // 工艺配方（0=仅工单可操作下发，1=仅工艺配方可操作下发）
  FormulaDistributionMode: 'SCMS.AppSettings.FormulaDistributionMode',
  FormulaSwitchingSignal: 'SCMS.AppSettings.Formula.SwitchingSignal',
  FormulaTag: 'SCMS.AppSettings.Formula.Tag',
  FormulaAllowSignal: 'SCMS.AppSettings.Formula.AllowSignal',
  FormulaMaximumWaitingTime: 'SCMS.AppSettings.Formula.MaximumWaitingTime',
  LeakDetectorMaximumWaitingTime:
    'SCMS.AppSettings.LeakDetector.MaximumWaitingTime',
  EquipmentNumber: 'SCMS.AppSettings.ProductionReport.EquipmentNumber',
  DeviceName: 'SCMS.AppSettings.Login.DeviceName',
  LoginSigal: 'SCMS.AppSettings.Login.Sigal',
  CredentialTag: 'SCMS.AppSettings.Login.CredentialTag',
  // 过程设置：缓存检测时间范围配置
  TimeRangeForDetection:
    'SCMS.AppSettings.TraceManagement.TimeRangeForDetection',
  // 过程参数：返修数据展示配置（0-展示所有数据，1-展示最新数据）
  ShowTraceDataWithLatestData:
    'SCMS.AppSettings.TraceManagement.ShowTraceDataWithLatestData',
  // 不良品管理
  // 人工返修（0-不启用，1-启用）
  ManualRepair_Enabled:
    'SCMS.AppSettings.QualityManagement.ManualRepair_Enabled',
  // 设备返修（0-不启用，1-启用）
  EquipmentRepair_Enabled:
    'SCMS.AppSettings.QualityManagement.EquipmentRepair_Enabled',
  // 产品报废（0-不启用，1-启用）
  Scrap_Enabled: 'SCMS.AppSettings.QualityManagement.Scrap_Enabled',
  // NG品流出（0-不启用，1-启用）
  NgProductOutflow_Enabled:
    'SCMS.AppSettings.QualityManagement.NgProductOutflow_Enabled',
  /**
   * 产品管理
   */
  Sop_Enabled: 'SCMS.AppSettings.ProductManagement.Sop_Enabled',
  /**
   * 版本
   */
  PluginEdition: 'SCMS.AppSettings.PluginEdition',
  /**
   * 工单管理状态
   */
  PluginState: 'SCMS.AppSettings.OrderManagement.PluginState',
}

const swapKeysAndValues = (obj: ConfigureCodeType | any) => {
  const swappedObj: Record<string, any> = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      swappedObj[obj[key]] = key
    }
  }
  return swappedObj
}

/**
 * key value 转换
 */
export const SwappedConfigureCodeMap = swapKeysAndValues(ConfigureCodeMap)

/**
 * 产线段表格配置
 */

export const columns = [
  {
    title: _t('产线段名称'),
    field: 'name',
    required: true,
    el: 'input',
    placeholder: _t('请输入产线段名称'),
  },
  {
    title: _t('加工产品名称'),
    required: true,
    field: 'product',
    el: 'input',
    placeholder: _t('请输入加工产品名称'),
  },
  {
    title: _t('操作'),
    field: 'action',
    width: '80px',
    icon: 'del',
  },
]

export const permissionCodes = {
  'system-management-update': '更新配置',
}
