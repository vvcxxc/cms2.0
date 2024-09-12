import { PropType, computed, defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import styles from './BOMFormDialog.module.scss'
import { BOMFormDialog } from '../../../../Controllers/BOMFormDialog'
import DyForm from '@/components/DyForm/DyForm'
import { createInjector } from '@/widgets/BOMManagement/store/BillofStore'

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
      curRowData,
    } = BOMFormDialog(props, ctx)
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
        <div class={styles.header}>
          <div>产品名称：{curRowData.value.productName}</div>
          <div>产品型号：{curRowData.value.productModel}</div>
        </div>
        <DyForm
          ref={formRef}
          labelWidth="106px"
          v-model:formData={formData.value}
          formItemProps={formItems.value}
        ></DyForm>
      </BaseDrawer>
    )
  },
})
