import {
  ref,
  SetupContext,
  reactive,
  h,
  watch,
  Ref,
  nextTick,
  computed,
} from 'vue'
import { ElMessage } from 'element-plus'
import { useVModel, useVModels } from '@vueuse/core'
import {
  queryWorkSectionDetail,
  queryProcessroutes,
} from '../Models/Service/Service'

// 弹窗基本数据
export const useDialog = (props: any, ctx: SetupContext) => {
  /**
   * 显示隐藏
   */
  const visible =
    props.visible !== null ? useVModel(props, 'visible', ctx.emit) : ref(false)
  /**
   * 基础数据
   */
  const data = ref([])
  /**
   * 搜索值
   */
  const search = ref('')
  /**
   * 选择的值
   */
  const selections = ref<any[]>([])
  // 传递进来的数据
  const { modelValue } = useVModels(props, ctx.emit)
  /**
   * 关闭
   */
  const onClose = () => {
    visible.value = false // 更新visible的值
    selections.value = []
    ctx.emit('close')
  }
  /**
   * 确认
   */
  const onConfirm = () => {
    visible.value = false // 更新visible的值
    selections.value = []
    ctx.emit('confirm')
  }
  /**
   * 选择
   * @param records
   */
  const onCheck = (records: Array<Record<string, any>>) => {
    selections.value = records
  }

  const onChange = (val: any) => { }
  /**
   * 选择
   */
  const onOpenSetting = () => {
    visible.value = true
  }

  return {
    visible,
    data,
    modelValue,
    selections,
    search,
    onConfirm,
    onClose,
    onCheck,
    onChange,
    onOpenSetting,
  }
}

/**
 * 工序选择弹窗
 *  */

export const useChooseProcess = (props: any, ctx: SetupContext) => {
  const formRef = ref()
  const editProcessType = ref('') //add edit
  const processTableRef = ref()
  const dialogHook = useDialog(props, ctx)
  const { visible, selections } = dialogHook

  const formItems = ref<any[]>([])

  const editType = ref('')
  const selectItem = ref()
  const formData = reactive({
    detectThing: '',
    productionLineSegmentId: '',
  })
  const pageInfo = reactive({
    dialogTitle: '',
    settingTitle: '',
    processTitle: '',
  })
  const changePageInfo = () => {
    let _type = editType.value == 'edit' ? '编辑' : '新增'
    if (props.settingType == 'missProcessSettings') {
      pageInfo.dialogTitle = `${_type}检测配置`
      pageInfo.processTitle = `检测工序`
    } else if (props.settingType == 'productUpdateSettings') {
      pageInfo.dialogTitle = `${_type}更新配置`
      pageInfo.processTitle = `更新工序`
    } else if (props.settingType == 'productStatusDetectSettings') {
      pageInfo.dialogTitle = `${_type}检测配置`
      pageInfo.processTitle = `检测工序`
    }
  }

  const materialArr = ref<any[]>([])
  const lineArr = ref<any[]>([])

  const changeLineType = () => {
    let curProcess = (props.curProcess.length && props.curProcess[0]) || null
    if (!curProcess) {
      return
    }

    queryWorkSectionDetail(curProcess.workSectionId).then((res: any) => {
      let materialList = res.materialDetections.map((item: any) => ({
        label: item.name,
        value: item.key,
      }))

      if (props.searchLineType == '1') {
        materialList.unshift({
          label: res.segment.product,
          value: '',
        })
        let productId = props.curProcess.length
          ? props.curProcess[0].productId
          : ''
        if (!productId) {
          return
        }
        queryProcessroutes(productId).then((lineRes: any) => {
          console.log('lineRes', lineRes)
          let temp: any = []
          lineRes.forEach((item: any) => {
            if (
              item.segment &&
              !temp.some((_: any) => _.value == item.segment.id)
            ) {
              temp.push({
                label: item.segment.name,
                value: item.segment.id,
              })
            }
          })

          lineArr.value = temp
          formItems.value = [
            {
              label: `${props.settingType == 'productUpdateSettings' ? '匹配' : '检测'
                }部品`,
              prop: 'detectThing',
              el: 'select',
              placeholder: '请选择部品',
              options: materialList,
              // rules: [{ required: true, message: '请选择部品', trigger: 'blur' }],//这里有问题,第一项是空字符串
              width: '100%',
            },
            {
              label: `${props.settingType == 'productUpdateSettings' ? '更新' : '检测'
                }产线段`,
              prop: 'productionLineSegmentId',
              el: 'select',
              placeholder: '请选择产线段',
              options: lineArr.value,
              rules: [{ required: true, message: '请选择产线段', trigger: 'blur' }],
              width: '100%',
            },
          ]
          if(lineArr.value.length){
            console.log("lineArr.value",lineArr.value)
            formData.productionLineSegmentId=lineArr.value[0].value
          }
          
        })
      } else {
        materialList.unshift({
          label: '主产品',
          value: '',
        })
        formItems.value = [
          {
            label: '检测部品',
            prop: 'detectThing',
            el: 'select',
            placeholder: '请选择检测部品',
            options: materialList,
            // rules: [{ required: true, message: '请选择部品', trigger: 'blur' }],
            width: '100%',
          },
        ]
        formData.productionLineSegmentId = ''
      }
      materialArr.value = materialList || []
    })
  }

  const openDetection = (type: string) => {
    editType.value = type
    changePageInfo()
    if (type == 'edit') {
      if (!props.curselectionList.length) {
        ElMessage.warning('请选择一个配置！')
        return
      }
      if (props.curselectionList.length > 1) {
        ElMessage.warning('请勿选择多个配置操作！')
        return
      }
      console.log('props.curselectionList[0]', props.curselectionList[0])
      selectItem.value = props.curselectionList[0]
      formData.detectThing = props.curselectionList[0].detectThing
      formData.productionLineSegmentId =
        props.curselectionList[0].productionLineSegmentId
    } else {
      selectItem.value = null
      formData.detectThing = ''
      formData.productionLineSegmentId = ''
    }
    changeLineType()
    visible.value = true
  }

  const selectionsList = computed(() => {
    return selectItem.value?.workSectionIds || []
  })

  watch(
    () => props.searchLineType,
    () => {
      changeLineType()
    },
    {
      immediate: true,
      deep: true,
    }
  )

  watch(
    () => formData.productionLineSegmentId,
    () => {
      processTableRef.value?.getList()
    },
    {
      immediate: true,
      deep: true,
    }
  )

  const onConfirm = async () => {
    const valid = await formRef.value.validate()

    console.log("valid", valid)

    if (valid) {
    
      if (props.searchLineType == '1' && !formData.productionLineSegmentId) {
        ElMessage.warning('请选择产线段！')
        return
      }
      if (!selections.value.length) {
        ElMessage.warning('请选择工序！')
        return
      }


      visible.value = false
      let _obj = {
        productionLineSegmentId: formData.productionLineSegmentId,
        detectThing: formData.detectThing,
        workSectionIds: selections.value.map((item: any) => item.id),
        productionLineSegmentName: lineArr.value.find(
          (item: any) => item.value == formData.productionLineSegmentId
        )?.label,
        detectThingDisplayTxt: materialArr.value.find(
          (item: any) => item.value == formData.detectThing
        )?.label,
        workSectionNames: selections.value
          .map((item: any) => item.name)
          .join(';'),
      }
      ctx.emit('confirm', editType.value, _obj)
    }
  }

  const computedProcessList = ref([])

  return {
    ...dialogHook,
    pageInfo,
    editProcessType,
    processTableRef,
    formRef,
    formItems,
    formData,
    onConfirm,
    openDetection,
    computedProcessList,
    selectionsList,
  }
}
