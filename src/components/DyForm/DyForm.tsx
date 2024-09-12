// import { ElInput } from "element-plus";
import {
  defineComponent,
  PropType,
  ref,
  onMounted,
  SetupContext,
  computed,
  unref,
  markRaw,
  Component,
  watch,
  Fragment,
} from 'vue'
import styles from './DyForm.module.scss'
import DyInput from '../Input/Input'
import Option from '@/components/Select/Option'
import Select from '@/components/Select/Select'
import SelectInput from '@/components/SelectInput/SelectInput'
import type { FormInstance } from 'element-plus'
import Icon from '../Icon/Icon'
import { Warning } from '@element-plus/icons-vue'
import RelationFlowDialog from '@/widgets/ProcessManagement/Views/Pages/Dialog/RelationFlowDialog/RelationFlowDialog'
import {
  FormPropsType,
  FormItemPropType,
  PropsType,
  OptionItemType,
} from './DyForm.d'
import Variable from '../Variable/Variable'
import Title from '../Title/Title'
import TextareaFlow from '../Flow/Flow'
import get from 'lodash/get'
import set from 'lodash/set'
import { has } from 'lodash'
import Tab from '@/components/Tab/Tab'
import TabPane from '@/components/Tab/TabPane'

const formItemElementMap: Record<string, any> = markRaw({
  input: DyInput,
  select: Select,
  selectInput: SelectInput,
  flow: RelationFlowDialog,
  variable: Variable,
  textareaFlow: TextareaFlow,
  switch: (props: PropType<any>, { attrs }: SetupContext) => {
    return <el-switch {...attrs} />
  },
})

const Type: Record<string, any> = {
  select: 'select',
}
export default defineComponent<FormPropsType>({
  //@ts-ignore
  name: '动态表单',
  props: {
    labelWidth: {
      type: String,
      default: '100px',
    },
    labelPosition: {
      type: String,
      default: 'left',
    },
    formData: {
      type: Object as PropType<{ [key: string]: any }>,
      default: () => ({}),
    },
    formItemProps: {
      type: Array,
      default: () => [],
    },
    inLine: {
      type: Boolean,
      default: false,
    },
    customWidgetMap: {
      type: Object,
      default: () => ({}),
    },
    isCategory: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: PropsType, { attrs, emit, expose }: SetupContext) {
    const formRef = ref<FormInstance>()
    const active = ref('')
    const form: any = computed({
      get() {
        return props.formData
      },
      set(v) {
        emit('update:formData', v)
      },
    })

    const currentWidgetModel = computed(() => {
      return (path: string) => {
        return get(form.value, path)
      }
    })

    const validate = () => {
      if (!formRef.value) return false
      return new Promise((resolve, reject) => {
        formRef.value?.validate((valid: boolean) => {
          if (valid) {
            resolve(true)
          } else {
            reject(false)
          }
        })
      })
    }

    const resetForm = () => {
      if (!formRef.value) return false
      formRef.value.resetFields()
    }

    const formItemProps = computed(() => {
      if (props.isCategory) {
        const tabMap: Record<string, FormItemPropType> = {}
        const tabs: FormItemPropType[] = []
        if (Array.isArray(props.formItemProps)) {
          props.formItemProps.forEach((item: any) => {
            tabMap[item.category] = tabMap[item.category] || []
            tabMap[item.category].push(item)
          })
          Object.keys(tabMap).forEach((key: string) => {
            tabs.push({
              name: key,
              content: tabMap[key],
            })
          })
        }
        return tabs
      }
      return props.formItemProps || []
    })

    const FormRender: any = ($props: any) => {
      const item: FormItemPropType = $props.item
      const options = $props.item.options || []
      if (item.el && Type[item.el as string]) {
        return options.map((el: OptionItemType) => (
          <Option
            value={el.value}
            label={el.label || el.description || el.name}
            class={styles.optionLabel}
          >
            {el.label || el.description || el.name}
            {el.tip ? (
              <el-tooltip
                class="box-item"
                effect="dark"
                content={el.tip}
                placement="top"
                persistent={false}
              >
                <el-icon>
                  <Warning />
                </el-icon>
              </el-tooltip>
            ) : null}
          </Option>
        ))
      }
      return null
    }

    const onUpdateModelValue = (v: string | number, prop: string) => {
      set(form.value, prop, v)
    }

    const initFormData = () => {
      props.formItemProps.forEach((item: FormItemPropType) => {
        if (item.defaultValue) {
          form.value[item.prop] = form.value[item.prop] || item.defaultValue
        }
      })
      active.value = formItemProps.value[0].name
    }

    const RenderItemProps = ($props: any) => {
      const WidgetMap = {
        ...formItemElementMap,
        ...props.customWidgetMap,
      }
      const formItemProps = $props.formItemProps
      return (
        <Fragment>
          {formItemProps.map((item: FormItemPropType, index: number) => {
            if (item.isTitle) {
              if (typeof item.title === 'string') {
                return <Title style="margin-bottom: 10px">{item.title}</Title>
              }
              return item.title
            }

            const itemProps: FormItemPropType = {}
            Object.entries(item).forEach(([key, value]) => {
              itemProps[key] = unref(value)
            })
            const el =
              typeof itemProps.el === 'string'
                ? WidgetMap[itemProps.el]
                : itemProps.el || null
            const Component = el
            const isHide = has(item.isHide, 'value')
              ? item.isHide?.value
              : item.isHide
            return Component && !isHide ? (
              <el-form-item
                label={itemProps.label}
                prop={itemProps.prop}
                rules={itemProps.rules}
                key={itemProps.prop + index}
                class={styles.itemDistance}
                vSlots={
                  itemProps.icon
                    ? {
                        label: () => (
                          <label class={styles.formitemPropsLabel}>
                            {itemProps.label}
                            {itemProps.icon ? (
                              <el-tooltip
                                class="box-item"
                                effect="dark"
                                content={itemProps.tip}
                                placement="top"
                                persistent={false}
                              >
                                <Icon
                                  style="margin-left: 5px"
                                  icon={itemProps.icon}
                                />
                              </el-tooltip>
                            ) : null}
                          </label>
                        ),
                      }
                    : null
                }
              >
                <Component
                  style={{
                    width: itemProps.width,
                    height: itemProps.height,
                  }}
                  {...itemProps}
                  // v-model={form.value[itemProps.prop as keyof any]}
                  placeholder={itemProps.placeholder}
                  modelValue={currentWidgetModel.value(itemProps.prop)}
                  onUpdate:modelValue={(val: string | number) =>
                    onUpdateModelValue(val, itemProps.prop)
                  }
                >
                  <FormRender item={itemProps} />
                </Component>
              </el-form-item>
            ) : null
          })}
        </Fragment>
      )
    }

    expose({ validate, resetForm, initFormData })

    return () => {
      return (
        <div class={styles.formStyle}>
          <el-form
            labelPosition={props.labelPosition}
            labelWidth={props.labelWidth}
            model={form.value}
            ref={formRef}
            inline={props.inLine}
          >
            {props.isCategory ? (
              <Tab
                active={active.value}
                class={styles.tabContent}
                size="small"
                type="params"
              >
                {formItemProps.value.map((item: any) => {
                  return (
                    <TabPane key={item.name} label={item.name} name={item.name}>
                      <RenderItemProps formItemProps={item.content} />
                    </TabPane>
                  )
                })}
              </Tab>
            ) : (
              <RenderItemProps formItemProps={props.formItemProps} />
            )}
          </el-form>
        </div>
      )
    }
  },
})
