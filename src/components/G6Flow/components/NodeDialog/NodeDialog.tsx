import { computed, defineComponent, ref } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import DyForm from '@/components/DyForm/DyForm'
import { ConditionType } from '../../core/enum'

export default defineComponent({
  props: ['visible', 'options'],
  emits: ['confirm', 'update:visible'],
  setup(props, { emit }) {
    const formData = ref({})
    const formRef = ref()
    const visible = computed({
      get() {
        return props.visible
      },
      set(v) {
        emit('update:visible', v)
      },
    })

    const onConfirm = async () => {
      await formRef.value.validate()
      visible.value = false
      emit('confirm', { ...formData.value })
    }
    return () => {
      return (
        <BaseDialog
          width="400px"
          title="条件类型"
          v-model={visible.value}
          onClose={() => (visible.value = false)}
          onConfirm={onConfirm}
        >
          <DyForm
            ref={formRef}
            isLine={true}
            formItemProps={[
              {
                label: '条件类型',
                prop: ConditionType,
                el: 'select',
                options: props.options || [],
                rules: [
                  {
                    required: true,
                    message: '请选择条件类型',
                    trigger: 'blur',
                  },
                ],
              },
            ]}
            v-model:formData={formData.value}
            labelWidth="80px"
          ></DyForm>
        </BaseDialog>
      )
    }
  },
})
