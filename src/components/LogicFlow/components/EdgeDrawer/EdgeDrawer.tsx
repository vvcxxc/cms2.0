import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import DyForm from '@/components/DyForm/DyForm'
import { injectStore } from '../../core/store'
import { StoreKey } from '../../type/index.d'
import { BaseEdgeModel } from '@logicflow/core'
export default defineComponent({
  name: 'NodeDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, { slots, emit }) {
    const lf = injectStore(StoreKey.LF)
    const visible = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit('update:modelValue', value)
      },
    })
    const node = computed(() => props.node)

    const formData = ref<any>({})

    const formItemProps = [
      {
        label: '名称',
        prop: 'Name',
        el: 'input',
        placeholder: '请输入名称',
        rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      },
      {
        label: '目标环节',
        prop: 'Sink',
        el: 'input',
        placeholder: '请输入目标环节',
        disabled: true,
      },
      {
        label: '源环节',
        prop: 'Source',
        el: 'input',
        placeholder: '请输入源环节',
        disabled: true,
      },
      {
        label: '比较符',
        prop: 'Operator',
        el: 'select',
        placeholder: '请输入比较符',
        options: [
          {
            label: '相等',
            value: 'RelOpEqual',
          },
          {
            label: '或者',
            value: 'Or',
          },
          {
            label: '并且',
            value: 'And',
          },
        ],
      },
      {
        label: '标签',
        prop: 'Label',
        el: 'input',
        placeholder: '请输入标签',
      },
      {
        label: '常量值',
        prop: 'Value',
        el: 'input',
        placeholder: '请输入常量值',
      },
      {
        label: '求反',
        prop: 'NOT',
        el: 'select',
        placeholder: '请输入求反',
        options: [
          {
            label: '否',
            value: 'false',
          },
          {
            label: '是',
            value: 'true',
          },
        ],
      },
      {
        label: '属性名',
        prop: 'Property',
        el: 'input',
        placeholder: '请输入属性名',
      },
      {
        label: '参数名',
        prop: 'Parameter',
        el: 'input',
        placeholder: '请输入参数名',
      },
    ]
    const onClose = () => {
      visible.value = false
    }

    const onConfirm = () => {
      const edgeModel: BaseEdgeModel = lf.value.getEdgeModelById(node.value.id)
      edgeModel.setProperties({
        Label: formData.value.Name,
        Sink: formData.value.Sink,
        Source: formData.value.Source,
        Condition: {
          Expression: formData.value.Label,
          Operator: formData.value.Operator,
          Property: formData.value.Property,
          Value: formData.value.Value,
          NOT: formData.value.NOT,
          Parameter: formData.value.Parameter,
        },
      })
      edgeModel.updateText(formData.value.Name)
      visible.value = false
    }

    const initData = () => {
      const { properties } = node.value
      const Value =
        typeof properties.Condition?.Value === 'string'
          ? String(properties.Condition?.Value)
          : ''
      formData.value = {
        Name: properties?.Label,
        Sink: properties.Sink,
        Source: properties.Source,
        Label: properties.Condition?.Expression, //标签
        Operator: properties.Condition?.Operator, //比较符号
        Property: properties.Condition?.Property, //属性名
        Value, //常量值
        NOT: String(properties.Condition?.NOT), //求反
        Parameter: properties.Condition?.Parameter, //参数名
      }
    }

    watch(node, (v, oldV) => {
      if (v !== oldV) {
        initData()
      }
    })

    return () => {
      return (
        <BaseDrawer
          onClose={onClose}
          onConfirm={onConfirm}
          title={props.title}
          width="600px"
          v-model={visible.value}
          destroy-on-close
        >
          <DyForm
            formItemProps={formItemProps}
            v-model:formData={formData.value}
          ></DyForm>
        </BaseDrawer>
      )
    }
  },
})
