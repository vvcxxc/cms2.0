import { Material } from '../Models/Material'
import { ref, onMounted, reactive, computed, h } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { injectModel } from '@/libs/Provider/Provider'
import { ElMessage } from 'element-plus'
import SelectInput from '@/components/SelectInput/SelectInput'
import { createInjector } from '../store/MaterialStore'

export const useMaterialCodeFormDialog = (props: any, ctx?: any) => {
  const material = injectModel<Material>('material')
  const { curRowData } = createInjector()
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const formData = ref<any>({})

  const dialogConfig = reactive({
    ruleVisible: false,
    ruleTitle: '条码规则',
  })
  // validate, resetForm
  const formRef = ref()
  const materialTypeOptions = ref<any[]>([])
  const formItems: FormItemPropType[] = [
    {
      label: '物料名称',
      prop: 'name',
      el: 'input',
      disabled: true,
      rules: [
        { required: true, message: '物料名称不允许为空！', trigger: 'blur' },
      ],
      placeholder: '请输入物料名称',
    },
    {
      label: '物料类型',
      prop: 'materialType',
      el: 'select',
      options: materialTypeOptions.value,
      placeholder: '请输入选择物料类型',
      disabled: true,
      rules: [
        { required: true, message: '物料类型不允许为空！', trigger: 'blur' },
      ],
    },
    {
      label: '物料编号',
      prop: 'code',
      el: 'input',
      rules: [
        { required: true, message: '物料编号不允许为空！', trigger: 'blur' },
      ],
      placeholder: '请输入物料编号',
    },
    {
      label: '条码规则',
      prop: 'verificationBarcodeId',
      el: (props: any, { attrs }: any) => {
        return h(SelectInput, {
          ...attrs,
          ...props,
          onClick: () => {
            dialogConfig.ruleVisible = true
          },
        })
      },
      placeholder: '请选择条码规则',
    },
  ]

  const initMaterialType = async () => {
    const res = await material.getMaterialTypes()
    for (let key in res) {
      materialTypeOptions.value.push({
        label: res[key],
        value: Number(key),
      })
    }
  }

  const onClose = () => {
    visible.value = false
  }

  onMounted(() => {
    initMaterialType()
  })

  const onOpen = () => {
    console.log(props.rowData, curRowData.value)
    formRef.value.resetForm()

    if (props.rowData) {
      formData.value = {
        name: curRowData.value.name,
        materialType: curRowData.value.materialType,
        ...props.rowData,
      }
      formData.value.verificationBarcodeId = []
      if (props.rowData.verificationBarcodeId) {
        formData.value.verificationBarcodeId = [
          {
            name: props.rowData.verificationBarcode,
            value: props.rowData.verificationBarcodeId,
          },
        ]
      }
    } else {
      formData.value = {
        name: curRowData.value.name,
        materialType: curRowData.value.materialType,
      }
    }
  }

  const onConfirm = async () => {

    formRef.value
      .validate()
      .then(async () => {
        const params = { ...formData.value }

        if (
          !params.verificationBarcodeId ||
          !params.verificationBarcodeId.length
        ) {
          delete params.verificationBarcodeId
        } else {
          params.verificationBarcodeId = params.verificationBarcodeId[0].value
        }
        if (!props.rowData) {
          await material.createMaterialDetail(curRowData.value.id, params)
          ElMessage.success('创建成功')
        } else {
          await material.updateMaterialDetail(
            curRowData.value.id,
            props.rowData.id,
            params
          )
          ElMessage.success('修改成功')
        }
        ctx.emit('confirm')
        visible.value = false
      })
      .catch(() => {
        console.log(22)
      })
  }
  const onRuleConfirm = (val: any) => {
    formData.value.verificationBarcodeId = [
      {
        name: val.name,
        value: val.value,
      },
    ]
  }
  return {
    onRuleConfirm,
    dialogConfig,
    onOpen,
    formRef,
    formItems,
    formData,
    visible,
    onClose,
    onConfirm,
  }
}
