import { BillofMaterial } from '../Models/BillofMaterial'
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { injectModel } from '@/libs/Provider/Provider'
import { ElMessage } from 'element-plus'
import { useGlobalState } from '@/libs/Store/Store'

import { createInjector } from '../store/BillofStore'
import { omit } from 'lodash'
export const BOMFormDialog = (props: any, ctx?: any) => {
  const { curRowData } = createInjector()
  const billofMaterial = injectModel<BillofMaterial>('billofMaterial')
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const formData = ref<any>({})
  // validate, resetForm
  const formRef = ref()
  const materialCodeList = ref<any[]>([])
  const validatorInteger = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('用量不允许为空！'))
      return
    }
    const num = value / 1


    if (isNaN(num) || typeof num !== 'number' || num < 0) {
      callback(new Error('正数，可整型、浮点型'))
    } else {
      callback()
    }
  }
  const formItems = ref<FormItemPropType[]>([
    {
      label: '工序',
      prop: 'processId',
      el: 'select',
      options: [],
      rules: [{ required: true, message: '工序不允许为空！', trigger: 'blur' }],
      placeholder: '请输入选择工序',
    },
    {
      label: '物料编号',
      prop: 'materialDetailId',
      el: 'select',
      options: [],
      rules: [
        { required: true, message: '物料编号不允许为空！', trigger: 'blur' },
      ],
      placeholder: '请输入物料编号',
    },
    {
      label: '物料名称',
      prop: 'materialName',
      el: 'input',
      disabled: true,
    },
    {
      label: '物料类型',
      prop: 'materialType',
      el: 'input',
      disabled: true,
    },
    {
      label: '单位',
      prop: 'materialUnit',
      el: 'input',
      disabled: true,
    },
    {
      label: '用量',
      prop: 'dosage',
      el: 'input',
      rules: [
        { required: true, message: '用量不允许为空！', trigger: 'blur' },
        { validator: validatorInteger, trigger: 'blur' },
      ],
      placeholder: '请输入用量',
    },
  ])
  const onClose = () => {
    visible.value = false
  }

  const onOpen = () => {
    getProcessList()
    console.log(props.rowData)
    formRef.value.resetForm()

    if (props.rowData) {
      formData.value = { ...props.rowData }
    }
  }

  const getMaterialList = async () => {
    const res = await billofMaterial.getMaterialList({
      MaxResultCount:999,
      SkipCount:0,
      IncludeDetails: true
    })
    console.log(res, '=billofMaterial')
    if (!res.items.length) return
    materialCodeList.value = []
    res.items.forEach((item: any)=> {
      if (!item.materialDetails?.length)return

      item.materialDetails.forEach((it: any) => {
        materialCodeList.value.push({
          ...it,
          materialData: omit(item, 'materialDetails'),
          label: it.code,
          value: it.id
        })
      })
    })
    formItems.value[1].options = materialCodeList.value
  }

  const getProcessList = async() => {
    const res = await billofMaterial.queryProcessroutes(curRowData.value.productId)
    formItems.value[0].options = res?.map((item: any) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  }

  watch(
    () => formData.value.materialDetailId,
    (val) => {
      const material = materialCodeList.value.find((item) => item.id === val)
      if (material) {
        formData.value.materialId = material.materialData.id
        formData.value.materialName = material.materialData.name
        formData.value.materialType = material.materialData.materialTypeDisplay
        formData.value.materialUnit = material.materialData.unit
      }
    }
  )

  onMounted(() => {
    getMaterialList()
  })

  const onConfirm = async () => {
    formRef.value
      .validate()
      .then(async () => {
        console.log(11)
        if (!props.rowData) {
          await billofMaterial.createBillofMaterial(
            curRowData.value.productId,
            formData.value
          )
          ElMessage.success('创建成功')
        } else {
          await billofMaterial.updateBillofMaterial(
            curRowData.value.productId,
            props.rowData.id,
            formData.value
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

  return {
    onOpen,
    formRef,
    formItems,
    formData,
    visible,
    onClose,
    onConfirm,
    curRowData,
  }
}
