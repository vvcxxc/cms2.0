import { PropType, computed, defineComponent, ref } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
// import styles from './ProcessDialog.module.scss'
import { useMaterialCodeFormDialog } from '../../../../Controllers/MaterialCodeFormDialog'
import DyForm from '@/components/DyForm/DyForm'
import RelationBarcodeGenerateDialog from '@/widgets/ProcessManagement/Views/Pages/Dialog/RelationBarcodeGenerateDialog/RelationBarcodeGenerateDialog'

export default defineComponent({
  name: '物料编号弹窗',
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
      dialogConfig,
      onRuleConfirm,
    } = useMaterialCodeFormDialog(props, ctx)

    console.log(formData.value, '---')
    const visible1 = ref(true)
    const vvv = ref('')
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
        <RelationBarcodeGenerateDialog
          v-model:visible={dialogConfig.ruleVisible}
          title={dialogConfig.ruleTitle}
          mode="dialog"
          ruleType="barcodeverification"
          onConfirm={onRuleConfirm}
        />
      </BaseDrawer>
    )
  },
})
