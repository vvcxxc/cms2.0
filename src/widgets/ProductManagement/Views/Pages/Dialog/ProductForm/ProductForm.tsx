import { PropType, computed, defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import { useProductFormDialog } from '../../../../Controllers/ProductFormDialog'
import DyForm from '@/components/DyForm/DyForm'
import { ProductType } from '@/widgets/ProductManagement/type/Product'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '产品弹窗',
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
      type: Object as PropType<ProductType | null>,
      default: null,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onOpen,
      onClose,
      onConfirm,
      currentLabelWidth,
      visible,
      formItems,
      formData,
      formRef,
    } = useProductFormDialog(props, ctx)
    return () => {
      return (
        <BaseDrawer
          // class={styles.drawer}
          size="800px"
          title={props.title}
          v-model={visible.value}
          onClose={onClose}
          onConfirm={onConfirm}
          onOpen={onOpen}
          LanguageScopeKey={LanguageScopeKey}
        >
          <DyForm
            ref={formRef}
            labelWidth={currentLabelWidth.value}
            v-model:formData={formData.value}
            formItemProps={formItems.value}
            LanguageScopeKey={LanguageScopeKey}
          ></DyForm>
        </BaseDrawer>
      )
    }
  },
})
