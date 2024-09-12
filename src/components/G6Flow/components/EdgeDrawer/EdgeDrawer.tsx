import {
  computed,
  defineComponent,
  ref,
  onMounted,
  watch,
  SetupContext,
  PropType,
  nextTick,
} from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import DyForm from '@/components/DyForm/DyForm'
import { getFlowDetail, getFlowData } from '@/api/logic-flow'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import ElInputNumber from 'element-plus/es/components/input-number/index'
import { cloneDeep, debounce, isFunction, sortBy, throttle } from 'lodash'
import styles from './EdgeDrawer.module.scss'
import { fittingString } from '../../core/transformHelp'
import { width, fontSize } from '../Nodes'
import ConditionDialog from '../ConditionDialog/ConditionDialog'
import { ConditionType, ValueText, CompositeCondition } from '../../core/enum'
import { Condition } from '../../type'
import { injectStore } from '../../core/store'

export default defineComponent({
  name: 'NodeDrawer',
  props: {
    title: {
      type: String,
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    modelValue: {
      type: Boolean,
    },
    graph: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: '',
    },
    edgeData: {
      type: Array,
      default: [],
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm', 'update:title'],
  setup(props, { slots, emit }) {
    const WidgetNameType: Record<string, any> = {
      String: {
        type: 'input',
        placeholder: '请输入',
      },
      Boolean: {
        type: 'switch',
      },
      Enum: {
        type: 'select',
        placeholder: '请选择',
      },
      Int32: {
        type: 'inputNumber',
        placeholder: '请输入',
      },
      Int64: {
        type: 'inputNumber',
        placeholder: '请输入',
      },
      ConditionCollection: {
        type: 'condition',
      },
      Object: {
        type: 'input',
        placeholder: '请输入',
      },
    }
    enum OpType {
      RelOpEqual = '=',
      RelOpLess = '<',
      RelOpLarge = '>',
      RelOpLessEq = '<=',
      RelOpLargeEq = '>=',
      RelOpNotEqual = '!=',
      RelOpContain = 'Contains',
    }
    const { flowMap, flowNodeMap } = injectStore()
    const isOpen = ref(false)
    const edgeType = ref('')
    const title = ref(props.title)
    const formRef = ref<any>(null)
    const formConditionRef = ref<any>(null)
    const conditionFormItemProps = ref<FormItemPropType>([])
    const formDataCondition = ref({})
    const conditionOptions = ref<
      {
        label: string
        value: string
      }[]
    >([])

    const visible = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
      },
    })
    const model = computed(() => props.model)

    const formData: Record<string, any> = ref()

    const formItemProps = ref<FormItemPropType>([])

    const customWidgetMap = {
      inputNumber: ElInputNumber,
      condition: (props: any, { attrs }: SetupContext) => (
        <ConditionDialog
          formItemProps={conditionFormItemProps.value}
          conditionOptions={conditionOptions.value}
          onConditionChange={onConditionChange}
          onUpdateFormData={onUpdateFormData}
          getCondition={getCondition}
          v-model:formData={formData.value.Condition}
          {...props}
          {...attrs}
        />
      ),
    }

    const onClose = () => {
      visible.value = false
      isOpen.value = false
      emit('close')
    }

    const onUpdateFormData = (data: Condition) => {
      formData.value.Condition = data
    }

    const onConfirm = () => {
      const graph = props.graph
      const item = graph.findById(model.value.id)
      const modelData = cloneDeep(model.value)
      modelData.properties = formData.value
      modelData.label = formData.value?.Condition?.Label

      item.update(modelData)
      visible.value = false
      emit('confirm')
    }

    const formItemSort = (formItems: FormItemPropType[]) => {
      return sortBy(formItems, ['sort'])
    }

    const getConditionsItems = async (type: string) => {
      const data = await getFlowDetail(type)
      return generateFormItems(data.attributes || [])
    }

    const getConditions = async () => {
      const data = await getFlowData('Conditions')
      const conditions: Record<string, any> = data.Conditions || []
      conditionOptions.value = conditions.map((item: any) => {
        let name = item.type === CompositeCondition ? '复合条件' : item.name
        return {
          ...item,
          label: name,
          value: item.type,
          tip: item.description,
        }
      })
    }

    const onConditionChange = async (val: string, isNative: boolean = true) => {
      const data = await getConditionsItems(val)

      if (isNative) {
        edgeType.value = val
        conditionFormItemProps.value = data
      }
      return data
    }

    const generateFormItems = (attributes: any[]) => {
      const formItems: any[] = []
      attributes?.forEach((item: FormItemPropType) => {
        const placeholder = WidgetNameType[item.propertyType]?.placeholder
        const formItem: FormItemPropType = {
          label: item.name,
          prop:
            item.propertyType === 'Object'
              ? `${item.propertyKey}.${ValueText}`
              : item.propertyKey,
          readonly: item.readonly,
          el: WidgetNameType[item.propertyType]?.type,
          rules: [],
          tip: item.description || item.name,
          icon: 'wen',
          options: item.propertyData?.map((item: any) => {
            return {
              label: item.name,
              tip: item.description,
              value: item.value,
            }
          }),
          disabled: ['Source', 'Sink'].includes(item.propertyKey),
          defaultValue: item.propertyValue,
          clearable: true,
          controlsPosition: 'right',
          step: 1,
          min: 0,
        }
        if (placeholder) {
          formItem.placeholder = placeholder + item.name
        }
        if (item.visible) {
          formItems.push(formItem)
        }
      })
      return formItems
    }

    const onOpen = async () => {
      const type =
        model.value?.properties?.[ConditionType] || 'BusinessTransition'
      if (!props.model && type) return
      isOpen.value = true
      getConditions()
      const data = await getFlowDetail(type)
      const attributes = data.attributes || []
      const formItems: FormItemPropType[] = generateFormItems(attributes)
      title.value = data.name
      formItemProps.value = formItemSort(formItems)
      formItemProps.value.push({
        label: '条件',
        prop: `Condition.${ConditionType}`,
        clearable: true,
        el: 'select',
        placeholder: '请选择',
        defaultValue: '',
        options: conditionOptions.value,
        onChange: onConditionChange,
      })
      nextTick(() => {
        formRef.value?.initFormData()
        initEdgeFormData()
      })
    }
    const initEdgeFormData = () => {
      formData.value = {}
      nextTick(() => {
        const properties = cloneDeep(model.value?.properties)
        const Condition = properties?.Condition || {}
        formData.value = {
          ...formData.value,
          ...properties,
        }
        onConditionChange(Condition[ConditionType])
        const { oldSourceId, oldTargetId } = formData.value

        if (oldSourceId && oldTargetId) {
          const sourceName = flowMap.get(oldSourceId).name
          const sinkName = flowMap.get(oldTargetId).name
          formData.value.Source = sourceName
          formData.value.Sink = sinkName
        } else {
          const sourceName = flowNodeMap.get(model.value?.source)?.name
          const sinkName = flowNodeMap.get(model.value?.target)?.name
          formData.value.Source = sourceName
          formData.value.Sink = sinkName
        }
      })
    }
    const OperatorType: Record<string, string> = {
      RelOpEqual: '=',
      RelOpLess: '<',
      RelOpLarge: '>',
      RelOpLessEq: '<=',
      RelOpLargeEq: '>=',
      RelOpNotEqual: '!=',
      RelOpContain: 'Contains',
    }
    /**
     * 获取条件
     * @returns
     */
    const getCondition = (type: string, data: Record<string, any>) => {
      const not = data.NOT ? '!' : ''
      const typeMap: Record<string, Function> = {
        PropertyCondition() {
          const result = data.PropertyToCompare || data.Value?.[ValueText]
          const value =
            data.Parameter && data.PropertyToCompare
              ? `${data.Parameter}.${result}`
              : result

          const property = data.Parameter
            ? `${data.Parameter}.${data.Property}`
            : data.Property
          if (property && OperatorType[data.Operator] && value) {
            return `${not} ${property} ${OperatorType[data.Operator]} ${value}`
          }
        },
        CompositeCondition() {
          const treeToString: any = (tree: any[]) => {
            if (!Array.isArray(tree) || tree.length === 0) {
              return ''
            }

            return tree
              .map((node) => {
                if (node.children && node.children.length > 0) {
                  // 递归处理子节点
                  return `(${treeToString(node.children)})`
                } else {
                  // 处理当前节点
                  return node.condition?.trim()
                }
              })
              .join(` ${tree[0].operator?.trim()} `)
          }
          const fn = (data: any[], root: boolean = false) => {
            let sumArray: any[] = []
            data.forEach((item) => {
              const operator = item.Operator
              if (Array.isArray(item.children)) {
                item.children.forEach((composition: any) => {
                  const type = composition[ConditionType]

                  if (type === CompositeCondition) {
                    if (composition.children) {
                      sumArray.push({
                        children: fn([composition]),
                        operator,
                      })
                    }
                  } else {
                    const condition = getCondition(type, composition)
                    sumArray.push({
                      condition,
                      operator,
                    })
                  }
                })
              }
            })
            return sumArray
          }
          const condition = treeToString(fn([data]))
          return `${not} ${condition}`
        },
        ChoiceCondition() {
          const name = data.ActivityRowName
          const choice = data.Choice
          if (name && choice) {
            return `${not} ${name}.Choice = ${choice}`
          }
        },
        TableCondition() {
          const name = data.PropertyName
          const operator = OperatorType[data.Operator]
          const value = data.Value[ValueText]
          if (name && operator && value) {
            return `${not} ${name} ${operator} ${value}`
          }
        },
        XMLCondition() {
          const parameter = data.Parameter
          const prefix = data.Prefix
          const xPath = data.XPath
          if (parameter && prefix && xPath) {
            return `${not} ${parameter}[${prefix}:${xPath}].Result>0`
          }
        },
      }
      const fn = typeMap[type]
      return isFunction(fn) && fn()
    }
    const currentCondition = computed(() => {
      const data = formData.value?.Condition || {}

      return getCondition(edgeType.value, data)
    })
    onMounted(() => {
      if (!isOpen.value) {
        onOpen()
      }
    })

    return () => {
      return (
        <BaseDrawer
          onClose={onClose}
          onConfirm={onConfirm}
          onOpen={onOpen}
          title={title.value || model.value.label}
          width="700px"
          v-model={visible.value}
          submitDisabled={!formItemProps.value.length || !props.isEdit}
          destroy-on-close
        >
          <div class={styles.drawContent}>
            {formItemProps.value.length ? (
              <DyForm
                ref={formRef}
                customWidgetMap={customWidgetMap}
                formItemProps={formItemProps.value}
                v-model:formData={formData.value}
                labelWidth="140px"
              ></DyForm>
            ) : (
              <el-empty image-size={200} description="暂无数据" />
            )}
            <div class={styles.formDrawer}>
              <DyForm
                ref={formConditionRef}
                customWidgetMap={customWidgetMap}
                formItemProps={conditionFormItemProps.value}
                v-model:formData={formData.value.Condition}
                labelWidth="140px"
              ></DyForm>
            </div>
            <div class={styles.condition}>{currentCondition.value}</div>
          </div>
        </BaseDrawer>
      )
    }
  },
})
