import { computed, defineComponent, ref } from 'vue'
import styles from './IssueDialog.module.scss'
import BaseDialog from '@/components/BaseDialog/index.vue'
import DyForm from '@/components/DyForm/DyForm'

export default defineComponent({
  name: '下发操作',
  props: ['title', 'modelValue', 'type'],
  emits: ['update:modelValue', 'confirm'],
  setup(props, { slots, emit }) {
    const formData = ref({})
    const formRef = ref()
    const visible = computed({
      get() {
        return props.modelValue
      },
      set(v) {
        emit('update:modelValue', v)
      },
    })
    const remark = ref('')
    const onClose = () => {
      visible.value = false
    }
    const onConfirm = () => {
      try {
        formRef.value?.validate()
        emit('confirm', { ...formData.value })
        formData.value = {}
      } catch (error) {
        // console.log(error)
      }
    }
    const onOpen = () => {
      formData.value = {
        ...formData.value,
        VariableValue: '',
        Remark: '',
      }
    }
    const onConfirmStop = (event: any) => {
      event?.preventDefault()
      event?.stopPropagation()
      return false
    }
    return () => (
      <div class={styles.control}>
        <BaseDialog
          title={`${props.title}功能字段操作`}
          v-model={visible.value}
          width="500px"
          onClose={onClose}
          onConfirm={onConfirm}
          onOpen={onOpen}
        >
          <DyForm
            ref={formRef}
            v-model:formData={formData.value}
            onSubmit={onConfirmStop}
            formItemProps={[
              {
                label: '变量值',
                prop: 'VariableValue',
                el: 'input',
                placeholder: '请输入变量值',
                rules: [
                  {
                    required: true,
                    message: '请输入变量值',
                    trigger: 'blur',
                  },
                ],
              },
              {
                label: '备注',
                prop: 'Remark',
                el: 'input',
                type: 'textarea',
                placeholder: '请输入备注',
                row: 3,
              },
            ]}
          />
        </BaseDialog>
      </div>
    )
  },
})
