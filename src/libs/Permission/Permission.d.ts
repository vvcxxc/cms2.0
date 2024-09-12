declare global {
  interface Window {
    app: any
  }
}

export interface Permission {
  id: string
  name: string
}

export interface UserInfo {
  permissions: {
    all: boolean
    widgets: string[]
  }
}

export interface Props {
  node: {
    id: string
    name: string
  }
  [key: string]: any
}

export enum EditionTypeEnum {
  A = 'LMES.BarcodeManagement.Enable',
  B = 'LMES.FlowManagement.Enable',
  C = 'LMES.FormulaManagement.Enable',
  D = 'LMES.MaterialManagement.Enable',
  E = 'LMES.OrderManagement.Enable',
  F = 'LMES.ProcessManagement.Enable',
  G = 'LMES.ProcessManagement.ProcessParameter.Enable',
  H = 'LMES.ProcessManagement.FormulaParameter.Enable',
  I = 'LMES.ProcessManagement.MaterialParameter.Enable',
  J = 'LMES.ProcessManagement.KanbanIpAddressEnable.Enable',
  K = 'LMES.ProductionManagement.Enable',
  L = 'LMES.ProductManagement.Enable',
  M = 'LMES.ProductManagement.SOPEnable',
  N = 'LMES.QualityManagement.Enable',
  O = 'LMES.TraceManagement.Enable',
  P = 'LMES.ProcessManagement.MaterialAssociationConfig.Enable',
  Q = 'LMES.FlowManagement.FlowDesignEnable',

  /**
   * SOP管理是否显示
   */
  R = 'LMES.ProductManagement.SOPEnable',
  /**
   * 配方及工艺路线
   */
  S = 'LMES.FormulaManagement.Enable',
  /**
   * 切换工序来源
   */
  T = 'LMES.TraceManagement.WorkSectionSourceEnable',
}
