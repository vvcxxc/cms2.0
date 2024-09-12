import { defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import { useFormulaFormDialog } from '../../../../Controllers/FormulaFormDialog'
import DyForm from '@/components/DyForm/DyForm'
import ProcessRouteDialog from '../ProcessRouteDialog/ProcessRouteDialog'
import ProductSelectDialog from '../ProductSelectDialog/ProductSelectDialog'
export default defineComponent({
  name: '配方弹窗',
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
      type: Object as any,
      default: null,
    },
    isCopy: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onOpen,
      onClose,
      onConfirm,
      visible,
      formItems,
      formData,
      formRef,
      dialogConfig,
      onProcessConfirm,
      onProductConfirm,
    } = useFormulaFormDialog(props, ctx)
    return () => (
      <BaseDrawer
        // class={styles.drawer}
        append-to-body
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
        <ProcessRouteDialog
          onConfirm={onProcessConfirm}
          v-model={dialogConfig.processRouteVisible}
          data={formData.value.formula2WorkSections}
          title="工艺路线设置"
        />
        <ProductSelectDialog
          onConfirm={onProductConfirm}
          v-model={dialogConfig.productVisible}
          data={formData.value.formula2Products}
          title="选择产品型号"
        />
      </BaseDrawer>
    )
  },
})
