export interface IVariables {
  UUID?: string
  displayName: string
  name: string
  value: string
}

export interface IPeriod {
  name: string
  type: string
  startTime: string
  endTime: string
}

export interface IPeriodSetting {
  variables: IVariables[]
  periods: IPeriod[]
}
