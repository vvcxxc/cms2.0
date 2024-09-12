import { Process } from '../Models/Process'
import { ref, onMounted, reactive, computed, Ref, watch, readonly } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { injectModel } from '@/libs/Provider/Provider'
import { ProcessDrawer } from '../Models/ProcessDrawer'
import { ElMessage } from 'element-plus'
import { useGlobalState } from '@/libs/Store/Store'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { isEdition } from '@/libs/Permission/Permission'
import { Material } from '@/widgets/MaterialManagement/Models/Material'
import { _t } from '../app'

export const useProcessDrawer = (props: any, ctx?: any) => {
  const processDrawer = injectModel<ProcessDrawer>('processDrawer')
  const material = injectModel<Material>('material')

  const { productionLineList, systemConfig, getWorkSectionList } =
    useGlobalState()
  /**
   * 用来对比的初始化数据
   */
  const initiateData: Ref<Record<string, any>> = ref({})
  const formData = reactive<Record<string, any>>({})
  const paramsData = ref([])
  const formulaData = ref([])
  const materielData = ref([])
  const materialTypeOptions = ref<
    {
      label: string
      value: number
    }[]
  >([])
  // ref
  const formRef = ref()
  const paramRef = ref()
  const formulaRef = ref()
  const materielRef = ref()

  // computed
  const current = computed(() => {
    return props.row || null
  })
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  /**
   * 产线结构 0 -工序工位 1- 产线的-工序工位
   */
  const productionLineStructure = computed(() => {
    const state: Ref<any> = systemConfig.state
    const structure = state.value.ProductionLineStructure
    return structure == 0
  })

  /**
   * 添加工序的form字段
   */
  const formItems = ref<any[]>()
  const setFormItems = () => {
    formItems.value = [
      {
        label: _t('工序名称'),
        prop: 'name',
        el: 'input',
        placeholder: _t('请输入工序名称'),
        rules: [{ required: true, message: _t('工序名称'), trigger: 'blur' }],
      },
      {
        label: _t('工序编号'),
        prop: 'code',
        el: 'input',
        placeholder: _t('请输入工序编号'),
        rules: [
          {
            required: true,
            message: _t('不能为空或空白字符！'),
            trigger: 'blur',
          },
        ],
      },
      {
        label: _t('所属产线段'),
        prop: 'segment',
        el: 'select',
        placeholder: _t('请选择产线段'),
        options: productionLineList.state,
        valueKey: 'id',
        width: '100%',
        isHide: productionLineStructure,
      },
      {
        label: _t('关联流程'),
        prop: 'flowDefinitions',
        el: 'flow',
        placeholder: _t('请选择关联流程'),
        collapseTags: true,
        maxCollapseTags: 8,
        // labelIcon: 'refresh',
        width: '100%',
      },
      {
        label: _t('备注'),
        prop: 'remark',
        el: 'input',
        placeholder: _t('请输入'),
        type: 'textarea',
        rows: 1,
      },
    ]
  }
  const currentEditionState = computed(() => {
    return isEdition(['D'])
  })

  const currentTab = computed(() => {
    const sum = []
    const base = [
      {
        label: _t('采集参数'),
        name: 'process',
        hidden: false,
        edition: 'G',
        data: paramsData,
        ref: paramRef,
      },
      {
        label: _t('配方参数'),
        name: 'formula',
        hidden: false,
        data: formulaData,
        ref: formulaRef,
        edition: 'H',
      },
    ]
    const materialObj = {
      title: _t('物料名称'),
      field: 'name',
      el: 'relationMateriel',
      required: true,
      props: {
        type: 'input',
        readonly: currentEditionState,
      },
    }
    if (currentEditionState.value) {
      sum.push(...base, {
        label: _t('物料参数'),
        name: 'material',
        hidden: false,
        data: materielData,
        ref: materielRef,
        edition: 'I',
        columns: [
          materialObj,
          {
            title: _t('物料类型'),
            field: 'type.description',
          },
        ],
      })
    } else {
      sum.push(...base, {
        label: _t('物料参数'),
        name: 'material',
        hidden: false,
        data: materielData,
        ref: materielRef,
        edition: 'I',
        columns: [
          materialObj,
          {
            title: _t('物料类型'),
            field: 'type.value',
            el: 'select',
            format: (val: string | number, row: Record<string, any>) => {
              const materialItem = materialTypeOptions.value.find((item) => {
                return item.value === val
              })
              const type = {
                value: val,
                description: materialItem?.label,
                name: row.name,
              }
              row.type = type
            },
            props: {
              optionData: materialTypeOptions,
              disabled: currentEditionState,
            },
          },
        ],
      })
    }
    return sum
  })

  const paramsColumns = [
    {
      title: _t('参数名'),
      field: 'name',
      key: 'name',
      required: true,
      el: 'input',
    },
    {
      title: _t('参数描述'),
      field: 'description',
      key: 'description',
      el: 'input',
    },
  ]

  const initMaterialType = async () => {
    materialTypeOptions.value = await processDrawer.getMaterialTypes()
  }
  /**
   * 校验是否有数据变化
   */
  const checkIsEqualObject = () => {
    const data = {
      paramsData: paramsData.value,
      formulaData: formulaData.value,
      materielData: materielData.value,
      formData,
    }
    const check = isEqual(initiateData.value, data)
    return check
  }

  const onClose = (done: () => void) => {
    if (visible.value) {
      if (checkIsEqualObject()) {
        visible.value = false
        done && done()
      } else {
        ConfirmBox(_t('当前工序数据未保存，是否确认关闭？'), _t('确认')).then(
          () => {
            // onConfirm()
            visible.value = false
            done && done()
          }
        )
        // .catch(() => {
        //   // visible.value = false
        //   // done && done()
        // })
      }
    }
  }
  /**
   * 保存
   */
  const onConfirm = async () => {
    const processParameters = paramRef.value.getData()
    const materielParameters = materielRef.value.getData()
    let formulaParameters = []
    if (isEdition(['H'])) {
      formulaParameters = formulaRef.value?.getData()
    }
    if (processParameters && formulaParameters && materielParameters) {
      await formRef.value?.validate()
      const data = {
        processParameters,
        formulaParameters,
        materielParameters,
        formData,
        sort: props.sort,
      }
      if (!current.value) {
        await processDrawer.addWorkSection(data)
      } else {
        await processDrawer.updateWorkSection(data)
      }
      ElMessage.success(_t('保存成功，注意重启流程服务！'))
      getWorkSectionList()
      ctx.emit('confirm')
    }
  }
  /**
   * 弹窗打开获取详情
   */
  const onOpen = async () => {
    await setFormItems()
    await initMaterialType()

    if (current.value) {
      const res = await processDrawer.getWorkSectionDetail(current.value)
      const { processParameters, formulaParameters, materialDetections } = res
      paramsData.value = processParameters
      formulaData.value = formulaParameters
      materielData.value = materialDetections
      Object.assign(formData, {
        flowDefinitions: res.flowDefinitions,
        code: res.code,
        id: res.id,
        isDisabled: res.isDisabled,
        name: res.name,
        remark: res.remark,
        segment: res?.segment?.id,
        sort: res.sort,
        segmentData: res.segment,
      })
    } else {
      Object.keys(formData).forEach((key) => {
        delete formData[key]
      })
      paramsData.value = []
      formulaData.value = []
      materielData.value = []
    }
    initiateData.value = cloneDeep({
      paramsData: paramsData.value,
      formulaData: formulaData.value,
      materielData: materielData.value,
      formData,
    })
  }

  // watch(() => current.value, onOpen)

  return {
    formItems,
    formData,
    visible,
    tabData: currentTab,
    formRef,
    paramsColumns,
    onOpen,
    onClose,
    onConfirm,
  }
}
