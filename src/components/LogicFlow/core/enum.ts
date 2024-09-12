export const CURVE = 'curve'

export const NODES = {
  ACTIVITY: 'Activity',
  VARIABLE_MONITOR_ACTIVITY: 'VariableMonitorActivity',
  VARIABLE_READ_ACTIVITY: 'VariableReadActivity',
  MATERIAL_ASSOCIATION_ACTIVITY: 'MaterialAssociationActivity',
  TRAY_ASSOCIATION_ACTIVITY: '"TrayAssociationActivity"',
  VARIABLE_WRITE_ACTIVITY: 'VariableWriteActivity',
  INBOUND_INITIALIZE_ACTIVITY: 'InboundInitializeActivity',
  DETERMINE_PROCESS_ACTIVITY: 'DetermineProcessActivity',
  BUSINESS_ACTIVITY: 'BusinessActivity',
  PRODUCT_STATEDETECTION_ACTIVITY: 'ProductStateDetectionActivity',
  DUPLICATE_CODE_DETECTION_ACTIVITY: 'DuplicateCodeDetectionActivity',
  MISSING_PROCESS_DETECTION_ACTIVITY: 'MissingProcessDetectionActivity',
  OUTBOUND_INITIALIZE_ACTIVITY: 'OutboundInitializeActivity',
  PARAMETER_COLLECT_ACTIVITY: 'ParameterCollectActivity',
  PLC_QUALIFICATION_JUDGMENT_ACTIVITY: 'PLCQualificationJudgmentActivity',
  LOCAL_QUALIFICATION_JUDGMENT_ACTIVITY: 'LocalQualificationJudgmentActivity',
  PARAMETER_SAVE_ACTIVITY: 'ParameterSaveActivity',
  END_ACTIVITY: 'EndActivity',
  ORDINARY_NODE: 'OrdinaryNode', //普通节点
}

export const ActivityKey = [
  'Alias',
  'Name',
  'EnterMode',
  'ExitMode',
  'JoinType',
  'SplitType',
  'NeedTagChange',
  'TaskDelay',
  'MonitorVariableName',
  'CompareVariableValue',
  'ExtendedProperty',
  '@_xsi:type',
]

export const TransitionKey = ['Label', 'Condition', 'Sink', 'Source']

export const ConditionKey = [
  'Label',
  'Expression',
  'NOT',
  'Operator',
  'Property',
  'Value',
  '@_xsi:type',
]
