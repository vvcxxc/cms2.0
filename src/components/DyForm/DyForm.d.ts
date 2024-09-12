import { VNode, Component, DefineComponent } from 'vue'

export interface OptionItemType {
  label?: string
  description?: string
  name?: string
  value: string | number
  tip?: string
}

export interface FormItemPropType {
  prop?: string | Ref<string>
  label?: String | Ref<string>
  rules?: any[] | Ref<any[]>
  disabled?: boolean | Ref<boolean>
  placeholder?: string | Ref<string>
  type?: string | Ref<string>
  width?: string | Ref<string>
  el?: string | Component | DefineComponent | Ref<string>
  options?: OptionItemType[] | any[] | Ref<any>
  isTitle?: boolean
  title?: string | Component
  [key: string]: any | Ref<string>
}

export interface FormPropsType {
  formData: { [key: string]: any }
  formItemProps: FormItemPropType[]
  [key: string]: any
}

export interface PropsType {
  formItemProps: FormItemPropType[]
  formData: { [key: string]: any }
  labelWidth: string
  [key: string]: any
}
