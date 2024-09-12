import { computed, defineComponent, ref, onMounted, watch } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import DyForm from '@/components/DyForm/DyForm'
import { injectStore } from '../../core/store'
import { StoreKey } from '../../type/index.d'

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
    lf: {
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

    const formData = ref({})

    const formItemProps = [
      {
        label: '名称',
        prop: 'Name',
        el: 'input',
        placeholder: '请输入名称',
        rules: [{ required: true, message: '节点名称', trigger: 'blur' }],
      },
      {
        label: '迁出模式',
        prop: 'SplitType',
        el: 'input',
        placeholder: '请输入迁出模式',
        rules: [{ required: true, message: '迁出模式', trigger: 'blur' }],
      },

      {
        label: '迁入模式',
        prop: 'JoinType',
        el: 'input',
        placeholder: '请输入迁入模式',
        rules: [{ required: true, message: '迁入模式', trigger: 'blur' }],
      },
      {
        label: '退出模式',
        prop: 'ExitMode',
        el: 'input',
        placeholder: '请输入退出模式',
        rules: [{ required: true, message: '退出模式', trigger: 'blur' }],
      },
      {
        label: '进入模式',
        prop: 'EnterMode',
        el: 'input',
        placeholder: '请输入进入模式',
        rules: [{ required: true, message: '进入模式', trigger: 'blur' }],
      },
    ]
    const onClose = () => {
      visible.value = false
    }

    const onConfirm = () => {
      lf.value.getNodeModelById(node.value.id).setProperties({
        ...formData.value,
      })
      visible.value = false
    }

    const initData = () => {
      const { properties } = node.value
      formData.value = {
        Name: properties.Name,
        SplitType: properties.SplitType,
        JoinType: properties.JoinType,
        ExitMode: properties.ExitMode,
        EnterMode: properties.EnterMode,
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
