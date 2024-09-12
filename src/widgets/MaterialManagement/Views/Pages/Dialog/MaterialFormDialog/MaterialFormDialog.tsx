import { PropType, computed, defineComponent, ref } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
// import styles from './ProcessDialog.module.scss'
import { useMaterialFormDialog } from '../../../../Controllers/MaterialFormDialog'
import DyForm from '@/components/DyForm/DyForm'
import RelationBarcodeGenerateDialog from '@/widgets/ProcessManagement/Views/Pages/Dialog/RelationBarcodeGenerateDialog/RelationBarcodeGenerateDialog'

export default defineComponent({
  name: '物料弹窗',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    rowData: {
      type: Object as PropType<Object | null>,
      default: null,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onOpen,
      onConfirm,
      visible,
      formItems,
      formData,
      formRef,
    } = useMaterialFormDialog(props, ctx)
    return () => (
      <BaseDrawer
        // class={styles.drawer}
        size="800px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        <DyForm
          ref={formRef}
          labelWidth="106px"
          v-model:formData={formData.value}
          formItemProps={formItems}
        ></DyForm>
      </BaseDrawer>
    )
  },
})
