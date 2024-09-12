// SCMS.AppSettings.QualityManagement.ManualRepair_Enabled（人工返修）（0-不启用，1-启用）
//   SCMS.AppSettings.QualityManagement.EquipmentRepair_Enabled（设备返修）（0-不启用，1-启用）
//   SCMS.AppSettings.QualityManagement.Scrap_Enabled（）产品报废（0-不启用，1-启用）
//   SCMS.AppSettings.QualityManagement.NgProductOutflow_Enabled（NG品流出）（0-不启用，1-启用）
export interface ConfigureCodeType {
  /**
   * 产线代码
   */
  ProductionLineCode?: string | number
  /**
   * 产线结构
   */
  ProductionLineStructure?: string | number
  /**
   * 产线段定义
   */
  ProductionLineSegment?: any[] | any
  /**
   * 物料产品关联工序
   */
  MaterialAssociationConfig?: string | number
  /**
   * 进站结果值配置
   */
  EntryResultConfig?: string | number
  /**
   * 补充说明映射
   */
  AbnormalCauseConfig?: string | number
  /**
   * 业务字段配置
   */
  BusinessFiled?: string | number
  /**
   * 调试模式
   */
  EnableDebugMode?: string | number
  /**
   * 配方参数
   */
  FormulaDistributionMode?: string | number
  /**
   * 人工返修
   */
  ManualRepair_Enabled?: string | number
  /**
   * 设备返修
   */
  EquipmentRepair_Enabled?: string | number
  /**
   * 产品报废
   */
  Scrap_Enabled?: string | number
  /**
   * NG品流出
   */
  NgProductOutflow_Enabled?: string | number
  /**
   * 过程设置：缓存检测时间范围配置
   */
  TimeRangeForDetection?: number | string
  /**
   * 过程参数：返修数据展示配置（0-展示所有数据，1-展示最新数据）
   */
  ShowTraceDataWithLatestData?: number | string
  /**
   * 产品管理
   */
  Sop_Enabled?: number | string
  /**
   * 版本
   */
  PluginEdition?: string
  /**
   * 工单管理状态
   */
  PluginState?: number | string
  FormulaSwitchingSignal?: string | number
  FormulaTag?: string | number
  FormulaAllowSignal?: string | number
  FormulaMaximumWaitingTime?: string | number
  LeakDetectorMaximumWaitingTime?: string | number
  EquipmentNumber?: string | number
  DeviceName?: string | number
  LoginSigal?: string | number
  CredentialTag?: string | number
}

export interface SettingType {
  settings: {
    name: string
    value: string
  }[]
}
