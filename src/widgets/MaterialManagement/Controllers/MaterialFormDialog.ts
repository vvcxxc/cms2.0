import { Material } from '../Models/Material'
import { ref, onMounted, reactive, computed, h } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { injectModel } from '@/libs/Provider/Provider'
import { ElMessage } from 'element-plus'
import SelectInput from '@/components/SelectInput/SelectInput'

export const useMaterialFormDialog = (props: any, ctx?: any) => {
  const material = injectModel<Material>('material')
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
      rules: [
        { required: true, message: '物料类型不允许为空！', trigger: 'blur' },
      ],
    },
    {
      label: '单位',
      prop: 'unit',
      el: 'input',
      placeholder: '请输入单位',
      rules: [{ required: true, message: '单位不允许为空！', trigger: 'blur' }],
    },
    {
      label: '备注说明',
      prop: 'remark',
      type: 'textarea',
      rows: 3,
      el: 'input',
      placeholder: '请输入备注说明',
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

  onMounted(()=> {
    initMaterialType()
  })

  const onOpen = async () => {
    console.log(props.rowData)
    formRef.value.resetForm()


    if (props.rowData) {

      const res = await material.getMaterialById(props.rowData.id)
      formData.value = {
        ...res,
      }
      // formData.value.barcodeId = []
      // if (props.rowData.barcodeId) {
      //   formData.value.barcodeId = [
      //     {
      //       name: props.rowData.barcode,
      //       value: props.rowData.barcodeId,
      //     },
      //   ]
      // }
    }
  }

  const onConfirm = async () => {
    console.log('onConfirm', formRef.value.validate())

    formRef.value
      .validate()
      .then(async () => {
        const params = { ...formData.value }
        console.log(params, '--11')

        // if (!params.barcodeId || !params.barcodeId.length) {
        //   delete params.barcodeId
        // } else {
        //   params.barcodeId = params.barcodeId[0].value
        // }
        if (!props.rowData) {
          await material.createMaterial(params)
          ElMessage.success('创建成功')
        } else {
          await material.updateMaterial(props.rowData.id, params)
          ElMessage.success('修改成功')
        }
        ctx.emit('confirm')
        visible.value = false
      })
      .catch(() => {
        console.log(22)
      })
  }

  return {

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
