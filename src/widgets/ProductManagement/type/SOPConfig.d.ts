export interface StepType {
  sort?: number
  name: string
  annexName?:string
  description: string
  hasAnnex?: boolean
  id?: string
  file?:File
}




export interface StepMap {
  processId: string
  sopSteps: StepType[]
}

