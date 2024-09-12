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
import { injectStore } from '../../core/store'
import { StoreKey } from '../../type/index.d'
import { getFlowDetail } from '@/api/logic-flow'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import ElInputNumber from 'element-plus/es/components/input-number/index'
import { cloneDeep, sortBy } from 'lodash'
import { fittingString } from '../../core/transformHelp'
import { width, nodeFontSize } from '../Nodes'
import TableArray from '@/components/TableArray/TableArray'

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
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm', 'update:title'],
  setup(props, { slots, emit }) {
    const { flowMap } = injectStore()
    const isOpen = ref(false)
    const title = ref(props.title)
    const formRef = ref<any>(null)

    const customWidgetMap = {
      inputNumber: ElInputNumber,
      switch: (props: PropType<any>, { attrs }: SetupContext) => {
        return <el-switch {...attrs} />
      },
      tableArray: TableArray,
    }

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
      ArrayList: {
        type: 'tableArray',
        placeholder: '',
      },
      Object: {
        type: 'tableArray',
        placeholder: '',
      },
    }

    const visible = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
      },
    })
    const model = computed(() => props.model)

    const formData: Record<string, any> = ref({})

    const formItemProps = ref<FormItemPropType>([])

    const currentNode = computed(() => {
      return model.value?.properties
    })
    const onClose = () => {
      visible.value = false
      isOpen.value = false
    }

    const onConfirm = async () => {
      const valid = await formRef.value?.validate()
      if (!valid) return
      const graph = props.graph
      const item = graph.findById(model.value.id)
      const modelData = cloneDeep(model.value)
      const label = formData.value.Name
      modelData.properties = formData.value
      modelData.name = label
      modelData.label = fittingString(label, width - 5, nodeFontSize + 2)
      item.update(modelData)
      visible.value = false
      emit('confirm', formData.value)
    }

    const formItemSort = (formItems: FormItemPropType[]) => {
      return sortBy(formItems, ['sort'])
    }

    const updateFormData = () => {
      formData.value = {}
      nextTick(() => {
        const properties = model.value?.properties
        formData.value = {
          ...formData.value,
          ...properties,
        }
      })
    }

    const getRule = (key: string) => {
      const ruleMap: Record<string, any> = {
        Name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur',
          },
          {
            validator: (rule: any, value: any, callback: any) => {
              let isSameValue = false
              flowMap.forEach((item: any) => {
                if (item?.properties?.Name === value) {
                  if (currentNode.value?.id !== item.id) {
                    return (isSameValue = true)
                  }
                }
              })
              if (isSameValue) {
                callback('节点名称重复，请检查后重试')
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      }
      return ruleMap[key] || []
    }

    const onOpen = async () => {
      if (!currentNode.value?.type) return
      isOpen.value = true

      const data = await getFlowDetail(model.value?.properties?.type)
      const attributes = data.attributes || []
      const formItems: FormItemPropType[] = []
      attributes?.forEach((item: FormItemPropType) => {
        const placeholder = WidgetNameType[item.propertyType]?.placeholder
        const formItem: FormItemPropType = {
          category: item.category,
          label: item.name,
          prop: item.propertyKey,
          el: WidgetNameType[item.propertyType]?.type,
          rules: getRule(item.propertyKey),
          readonly: item.readonly,
          tip: item.description,
          icon: 'wen',
          options: item.propertyData?.map((item: any) => {
            return {
              label: item.name,
              tip: item.description,
              value: item.value,
            }
          }),
          defaultValue: item.propertyValue,
          clearable: true,
          controlsPosition: 'right',
          step: 1,
          min: 0,
          propertyType: item.propertyType,
          elementAttributes: item.elementAttributes,
          elementType: item.elementType,
        }

        if (placeholder) {
          formItem.placeholder = placeholder + item.name
        }
        if (item.visible) {
          formItems.push(formItem)
        }
      })
      formItemProps.value = formItemSort(formItems)
      title.value = data.name
      nextTick(() => {
        formRef.value?.initFormData()
        updateFormData()
      })
    }

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
          width="850px"
          v-model={visible.value}
          submitDisabled={!formItemProps.value.length || !props.isEdit}
          destroy-on-close
        >
          {formItemProps.value.length ? (
            <DyForm
              isCategory={true}
              ref={formRef}
              customWidgetMap={customWidgetMap}
              formItemProps={formItemProps.value}
              v-model:formData={formData.value}
              labelWidth="140px"
            ></DyForm>
          ) : (
            <el-empty image-size={200} description="暂无数据" />
          )}
        </BaseDrawer>
      )
    }
  },
})
