import { computed, defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import styles from './EditDetailDialog.module.scss'
import { useDetailDialog } from '../../Controllers/DetailDialog'
import { TaskDialogColumns } from '../../enum'
import DyForm from '@/components/DyForm/DyForm'

export default defineComponent({
  name: '工位弹窗',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    row: {
      type: Object,
      default: null,
    },
    sort: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'close', 'submit', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      onOpen,
      formData,
      formRef,
      formItems,
      visible,
    } = useDetailDialog(props, ctx)
    return () => {
      return (
        <BaseDrawer
          class={styles.drawer}
          size="600px"
          title={props.title || '新增任务'}
          v-model={visible.value}
          onClose={onClose}
          onOpen={onOpen}
          onConfirm={onConfirm}
          destroy-on-close
          before-close={onClose}
        >
          <DyForm
            formData={formData}
            labelWidth="106px"
            formItemProps={formItems.value}
            ref={formRef}
            onSubmit={() => ctx.emit('submit')}
          ></DyForm>
        </BaseDrawer>
      )
    }
  },
})
