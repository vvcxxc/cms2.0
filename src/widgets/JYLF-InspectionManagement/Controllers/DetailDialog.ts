import { ref, reactive, computed, h, SetupContext } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'
import { Create } from '@/libs/Create/Create'
import ChooseWorkStationDialog from '../Views/Components/ChooseWorkStationDialog'
import TestMethod from '../Views/Components/TestMethod'
import {
  getProductList,
  addSpotcheck,
  editSpotcheck,
} from '../Models/Service/Service'

export const useDetailDialog = (props: any, ctx?: any) => {
  /**
   * 表单
   */
  const formData = reactive<Create<{}>>(new Create({}))
  const formRef = ref<any>()

  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const onClose = async (done: () => void) => {
    visible.value = false
    ctx.emit('close')
  }

  const onConfirm = async () => {
    const valid: boolean = await formRef.value?.validate()
    if (valid || !formRef.value) {
      // 保存数据
      if (props.title == '新增任务') {
        addSpotcheck({
          name: formData.name,
          productModel: formData.productModel,
          workStationIds: formData.workSection.map(
            (item: any) => item.workStationId
          ),
          checkModes: formData.checkModes.map((item: any) => item.judge || 0), //1 ok 2 ng
          remark: formData.remark,
        }).then((res: any) => {
          ElMessage.success('新增成功')
          visible.value = false
          ctx.emit('confirm')
        })
      } else {
        editSpotcheck({
          id: props.row.id,
          name: formData.name,
          productModel: formData.productModel,
          workStationIds: formData.workSection.map(
            (item: any) => item.workStationId
          ),
          checkModes: formData.checkModes.map((item: any) => item.judge || 0), //1 ok 2 ng
          remark: formData.remark,
          concurrencyStamp: props.row.concurrencyStamp,
        }).then((res: any) => {
          ElMessage.success('编辑成功')
          visible.value = false
          ctx.emit('confirm')
        })
      }
    }
  }

  /**
   * 打开工位并获取详情
   * @returns
   */
  const onOpen = async () => {
    if (props.title == '新增任务') {
      formData.name = ''
      formData.productModel = ''
      formData.workSection = []
      formData.count = null
      formData.checkModes = []
      formData.remark = ''
    } else if (props.row) {
      formData.name = props.row.name
      formData.productModel = props.row.productModel
      formData.workSection = props.row.workStationIds.map(
        (item: any, idx: number) => {
          return {
            workStationName: props.row.workStationsDesc.split('、')[idx],
            workStationId: item,
          }
        }
      )
      formData.count = props.row.checkModes.length
      formData.checkModes = props.row.checkModes.map((item: any) => {
        return {
          id: uuidv4(),
          judge: item,
        }
      })
      formData.remark = props.row.remark
    }
    setFormItems()
  }

  const validateJudge = (rule: any, value: any, callback: any) => {
    if (value.some((item: any) => !item.judge)) {
      callback(new Error('结果要求不允许为空！'))
    } else {
      callback()
    }
  }

  const formItems = ref<FormItemPropType[]>()
  const productList = ref<any[]>([])
  const productId = computed(() => {
    return (
      productList.value.find(
        (item: any) => item.value === formData.productModel
      )?.id ?? ''
    )
  })
  const setFormItems = () => {
    getProductList({
      SkipCount: 0,
      MaxResultCount: 999,
    }).then((res: any) => {
      productList.value =
        res.items.map((item: any) => {
          return { label: item.model, value: item.model, id: item.id }
        }) || []
      formItems.value = [
        {
          label: '任务名称',
          prop: 'name',
          el: 'input',
          clearable: true,
          placeholder: '请输入任务名称',
          rules: [
            {
              required: true,
              message: '任务名称不允许为空！',
              trigger: 'blur',
            },
          ],
        },
        {
          label: '点检型号',
          prop: 'productModel',
          el: 'select',
          options: productList.value,
          placeholder: '请选择点检型号',
          rules: [
            {
              required: true,
              message: '点检型号不允许为空！',
              trigger: 'blur',
            },
          ],
        },
        {
          label: '点检工位',
          prop: 'workSection',
          clearable: true,
          el: (props: any, { attrs }: SetupContext) => {
            return h(ChooseWorkStationDialog, {
              ...props,
              productId: productId.value,
              ...attrs,
            })
          },
          placeholder: '请选择点检工位',
          rules: [
            { required: true, message: '请选择点检工位', trigger: 'blur' },
          ],
          width: '100%',
        },
        {
          label: '点检次数',
          prop: 'count',
          el: 'input',
          type: 'number',
          clearable: false,
          placeholder: '请输入点检次数',
          rules: [
            {
              required: true,
              message: '点检次数不允许为空！',
              trigger: 'blur',
            },
          ],
        },
        {
          label: '测试方式',
          prop: 'checkModes',
          el: (props: any, { attrs }: SetupContext) => {
            return h(TestMethod, {
              ...props,
              count: formData.count,
              ...attrs,
            })
          },
          placeholder: '请选择测试方式',
          width: '100%',
          height: '250px',
          rules: [
            {
              required: true,
              validator: validateJudge,
              trigger: 'blur',
            },
          ],
        },
        {
          label: '备注',
          prop: 'remark',
          el: 'input',
          placeholder: '请输入备注',
          type: 'textarea',
          resize: 'none',
        },
      ]
    })
  }

  return {
    formItems,
    formRef,
    formData,
    visible,

    onClose,
    onConfirm,
    onOpen,
  }
}
