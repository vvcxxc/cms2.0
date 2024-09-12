import { FlowDefinitionType } from './Type.d'
export interface SectionType {
  name?: string
  id?: string
  remark?: string
  flowDefinitions?: FlowDefinitionType[]
  code?: string
}

interface Option {
  name: string
  value: number
  description: string
  data: any | null
}

interface Ability {
  id: number
  code: string
  name: string
  description: string
  defaultValue: number
  creationTime: string
  options: Option[]
  extraProperties: Record<string, any>
  value: string
  code?: string
}

interface AbilitiesType {
  code: string
  creationTime: string
  defaultValue: number
  description: string
  extraProperties: Record<string, any>
  id: string | number
  name: string
  options: Option[]
}

interface Parameter {
  parameterKey: string
  variable: string
  name: string
  description: string | null
}

interface Formula {
  parameterKey: string
  deliverVariable: string
  watchVariable: string
  name: string
  description: string | null
}

interface Quality {
  name: string
  sort: number
  judgmentValue: string
  variable: string
  id: number
  extraProperties: Record<string, any>
}

interface Material {
  key: string
  name: string
  type: {
    name: string
    value: number
    description: string
    data: any | null
  }
  sort: number
  verificationSignal: string
  barcodeVariable: string
  verificationResultSignal: string
  bindMaterialVariable: string
  id: number
  extraProperties: Record<string, any>
  barcode: string
}

interface StationInteraction {
  name: string
  value: number
  description: string
  data: any | null
  objectName: string
  objectValue: any | null
}

interface Configuration {
  abilitys?: Ability[]
  params?: Parameter[]
  formula?: Formula[]
  quality?: Quality[]
  materiel?: Material[]
  [key: string]: StationInteraction[]
}
