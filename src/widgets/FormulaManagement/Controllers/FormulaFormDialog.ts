import { ref, onMounted, reactive, computed, h } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'

import { ElMessage } from 'element-plus'
import SelectInput from '@/components/SelectInput/SelectInput'
import { injectModel } from '@/libs/Provider/Provider'
import { Formula } from '../Models/Formula'
export const useFormulaFormDialog = (props: any, ctx?: any) => {
  const formula = injectModel<Formula>('formula')
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const dialogConfig = reactive({
    processRouteVisible: false,
    productVisible: false,
  })

  const formData = ref<any>({
    name: '',
    code: '',
    remark: '',
    formula2WorkSections: [],
    formula2Products: [],
  })
  // validate, resetForm
  const formRef = ref()

  const formItems: FormItemPropType[] = [
    {
      label: '配方名称',
      prop: 'name',
      el: 'input',
      rules: [
        { required: true, message: '配方名称不允许为空！', trigger: 'blur' },
      ],
      placeholder: '请输入配方名称',
    },
    {
      label: '配方编号',
      prop: 'code',
      el: 'input',
      rules: [
        { required: true, message: '配方编号不允许为空！', trigger: 'blur' },
      ],
      placeholder: '请输入配方编号',
    },
    {
      label: '工艺路线',
      prop: 'formula2WorkSections',
      rules: [
        { required: true, message: '工艺路线不允许为空！', trigger: 'blur' },
      ],
      el: (props, { attrs }) => {
        return h(SelectInput, {
          ...attrs,
          ...props,
          onClick: () => {
            dialogConfig.processRouteVisible = true
          },
        })
      },
      placeholder: '请输入工艺路线',
    },
    {
      label: '产品型号',
      prop: 'formula2Products',
      el: (props, { attrs }) => {
        return h(SelectInput, {
          ...attrs,
          ...props,
          onClick: () => {
            dialogConfig.productVisible = true
          },
        })
      },
      placeholder: '请输入产品型号',
    },
    {
      label: '备注',
      prop: 'remark',
      type: 'textarea',
      rows: 3,
      el: 'input',
      placeholder: '备注',
    },
  ]
  const onClose = () => {
    visible.value = false
  }

  const onOpen = async () => {
    console.log(props.rowData)
    formRef.value.resetForm()

    if (props.rowData) {
      formData.value = { ...props.rowData }
      formData.value.formula2WorkSections =
        props.rowData.formula2WorkSections?.map((item: any) => {
          return {
            workSectionId: item.workSectionId,
            sort: item.sort,
            name: item.workSectionName,
          }
        }) ?? []

        formData.value.formula2Products =
        props.rowData.formula2Products?.map((item: any) => {
          return {
            productId: item.productId,
            sort: item.sort,
            name: item.productModel,
          }
        }) ?? []
        

      if (props.isCopy) {
        formData.value.formula2Products = []
        const data = await formula.getCopyInfo(props.rowData.id)
        formData.value.name = data.name
        formData.value.code = data.code
      }
    }
  }

  const onConfirm = async () => {
    formRef.value
      .validate()
      .then(async () => {
        console.log(11)
        if (props.isCopy) {
          const copyData = {
            formulaId: props.rowData.id,
            formulaName: formData.value.name,
            formulaCode: formData.value.code,
            formula2Products: formData.value.formula2Products,
            formula2WorkSections: formData.value.formula2WorkSections,
          }
          await formula.copyFormula(copyData)
          ElMessage.success('创建副本成功')
        } else if (!props.rowData) {
          await formula.createFormula(formData.value)
          ElMessage.success('创建成功')
        } else {
          await formula.updateFormula(props.rowData.id, formData.value)
          ElMessage.success('修改成功')
        }
        ctx.emit('confirm')
        visible.value = false
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  const onProcessConfirm = (list: any[]) => {
    console.log(list)
    formData.value.formula2WorkSections = list.map((item, index) => {
      console.log(index)

      return {
        workSectionId: item.id,
        sort: index,
        name: item.name,
      }
    })

    console.log(formData, '--')
  }

  const onProductConfirm = (list: any[]) => {
    console.log(list)
    formData.value.formula2Products = list.map((item, index) => {
      console.log(index)

      return {
        productId: item.id,
        sort: index,
        name: item.model,
      }
    })

    console.log(formData.value.formula2Products, '-- formData.value.formula2Products');
    
    dialogConfig.productVisible = false
  }

  return {
    onProductConfirm,
    onProcessConfirm,
    onOpen,
    formRef,
    formItems,
    formData,
    visible,
    onClose,
    onConfirm,
    dialogConfig,
  }
}
