import { Product } from '../Models/Product'
import { ref, onMounted, reactive, computed } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { ProductFormType } from '../type/Product'

import { ElMessage } from 'element-plus'
import { injectModel } from '@/libs/Provider/Provider'
import { _t } from '../app'
import { getScopeT, Language } from '@/libs/Language/Language'

export const useProductFormDialog = (props: any, ctx?: any) => {
  const product = injectModel<Product>('product')
  // const _t = getScopeT(props.LanguageScopeKey)
  const currentLabelWidth = computed(() => {
    return window.app?.current?.project?.current?.language?.followLang !==
      'en-US'
      ? '150px'
      : '200px'
  })
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const formData = ref<ProductFormType>({
    name: '',
    model: '',
    identificationCode: '',
    shortNumber: '',
    remark: '',
  })
  // validate, resetForm
  const formRef = ref()

  const formItems = ref<FormItemPropType[]>([])
  const resetFormItems = () => {
    formItems.value = [
      {
        label: _t('产品名称'),
        prop: 'name',
        el: 'input',
        rules: [
          {
            required: true,
            message: _t('产品名称不允许为空！'),
            trigger: 'blur',
          },
        ],
        placeholder: _t('请输入产品名称'),
      },
      {
        label: _t('产品识别码'),
        prop: 'identificationCode',
        el: 'input',
        placeholder: _t('请输入产品识别码'),
      },
      {
        label: _t('产品型号'),
        prop: 'model',
        el: 'input',
        rules: [
          {
            required: true,
            message: _t('产品型号不允许为空！'),
            trigger: 'blur',
          },
        ],
        placeholder: _t('请输入产品型号'),
      },
      {
        label: _t('产品简号'),
        prop: 'shortNumber',
        el: 'input',
        placeholder: _t('请输入产品简号'),
      },
      {
        label: _t('备注'),
        prop: 'remark',
        type: 'textarea',
        rows: 3,
        el: 'input',
        placeholder: '',
      },
    ]
  }

  const onClose = () => {
    visible.value = false
  }

  const onOpen = () => {
    resetFormItems()
    formRef.value.resetForm()

    if (props.rowData) {
      formData.value = { ...props.rowData }
    }
  }

  const onConfirm = async () => {
    formRef.value.validate().then(async () => {
      if (!props.rowData) {
        await product.createProduct(formData.value)
        ElMessage.success(_t('创建成功'))
      } else {
        await product.updateProduct(props.rowData.id, formData.value)
        ElMessage.success(_t('修改成功'))
      }
      ctx.emit('confirm')
      visible.value = false
    })
  }

  return {
    onOpen,
    formRef,
    formItems,
    formData,
    visible,
    currentLabelWidth,
    onClose,
    onConfirm,
  }
}
