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
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { useVModel, useVModels } from '@vueuse/core'
import { traceprocesssetting } from '../Models/Service/Service'

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

  const onChange = (val: any) => {}

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
  }
}

/**
 * 漏工序配置弹窗
 *  */

export const useMissingProcess = (props: any, ctx: SetupContext) => {
  const dialogHook = useDialog(props, ctx)
  const nowIdx = ref(1)
  const missTableRef = ref()
  const { visible, selections } = dialogHook
  const dataSource = ref<any[]>([])
  const settingType = ref<string>('')
  const dataObj: any = reactive<any>({
    productModel: '',
    workSectionCode: '',
    productionLineSegmentName: '',
    workSectionName: '',
    productId: '',
    workSectionId: '',
  })

  const pageInfo = reactive({
    dialogTitle: '',
    settingTitle: '',
  })
  const changePageInfo = () => {
    if (settingType.value == 'missProcessSettings') {
      pageInfo.dialogTitle = '漏工序检测配置'
      pageInfo.settingTitle = '检测'
    } else if (settingType.value == 'productUpdateSettings') {
      pageInfo.dialogTitle = '产品码更新配置'
      pageInfo.settingTitle = '更新'
    } else if (settingType.value == 'productStatusDetectSettings') {
      pageInfo.dialogTitle = '产品状态检测配置'
      pageInfo.settingTitle = '检测'
    }
    if (props.searchLineType == '1') {
      missingProcessColumns.value = [
        {
          field: 'detectThingDisplayTxt',
          title:
            settingType.value == 'productUpdateSettings'
              ? '匹配部品'
              : '检测部品',
        },
        {
          field: 'productionLineSegmentName',
          title:
            settingType.value == 'productUpdateSettings'
              ? '更新产线段'
              : '检测产线段',
        },
        {
          field: 'workSectionNames',
          title:
            settingType.value == 'productUpdateSettings'
              ? '更新工序名称'
              : '检测工序名称',
        },
      ]
    } else {
      missingProcessColumns.value = [
        {
          field: 'detectThingDisplayTxt',
          title:
            settingType.value == 'productUpdateSettings'
              ? '匹配部品'
              : '检测部品',
        },
        {
          field: 'workSectionNames',
          title:
            settingType.value == 'productUpdateSettings'
              ? '更新工序名称'
              : '检测工序名称',
        },
      ]
    }
  }

  const missingProcessColumns = ref<any[]>([])
  watch(
    () => props.searchLineType,
    (val) => {
      changePageInfo()
    },
    {
      immediate: true,
      deep: true,
    }
  )
  const onOpenSetting = (type: string) => {
    if (!props.curselectionList.length) {
      ElMessage.warning('请选择一个设置！')
      return
    }
    if (props.curselectionList.length > 1) {
      ElMessage.warning('请勿选择多个设置操作！')
      return
    }
    if (
      type == 'missProcessSettings' &&
      props.curselectionList[0].isFirstWorkSection
    ) {
      ElMessage.warning('工艺路线首工序不支持配置！')
      return
    }

    settingType.value = type
    changePageInfo()

    visible.value = true
    const curItem = props.curselectionList[0]
    console.log(curItem, 'curItem')

    if (curItem) {
      dataObj.productModel = curItem.productModel
      dataObj.workSectionCode = curItem.workSectionCode
      dataObj.productionLineSegmentName = curItem.productionLineSegmentName
      dataObj.workSectionName = curItem.workSectionName
      dataObj.productId = curItem.productId
      dataObj.workSectionId = curItem.workSectionId
    }

    //看按钮type
    let temp
    console.log(settingType.value, curItem)
    if (settingType.value == 'missProcessSettings') {
      temp = curItem.missProcessSettings || []
    } else if (settingType.value == 'productUpdateSettings') {
      temp = curItem.productUpdateSettings || []
    } else if (settingType.value == 'productStatusDetectSettings') {
      temp = curItem.productStatusDetectSettings || []
    }
    temp.forEach((item: any) => {
      item.id = nowIdx.value
      nowIdx.value += 1
    })
    dataSource.value = temp
  }

  const updateProcess = (type: string, formData: any) => {
    console.log(type, formData)
    if (type == 'add') {
      dataSource.value.push({
        id: nowIdx.value,
        ...formData,
      })
      // let temp = JSON.parse(JSON.stringify(dataSource.value))
      // dataSource.value = []
      // temp.push({
      //     id: nowIdx.value,
      //     ...formData
      // })

      // nextTick(() => {
      //     dataSource.value = temp;
      // })
      nowIdx.value += 1
    } else {
      let temp = JSON.parse(JSON.stringify(dataSource.value))
      dataSource.value = []
      let _idx = temp.findIndex(
        (item: any) => item.id == selections.value[0].id
      )
      temp[_idx] = {
        ...temp[_idx],
        ...formData,
      }
      nextTick(() => {
        dataSource.value = temp
      })
    }
    console.log(missTableRef.value, 'missTableRef.value')
    missTableRef.value?.clearSelectEvent()
    selections.value = []
  }

  const delDetection = () => {
    ConfirmBox('是否删除选中的配置').then(() => {
      dataSource.value = dataSource.value.filter((item: any) => {
        return !selections.value.some((it) => it.id === item.id)
      })
    })
  }

  // 确认时，更新数据
  const onConfirm = async () => {
    dataSource.value.forEach((item: any) => {
      if (!item.productionLineSegmentId) {
        item.productionLineSegmentId = '00000000-0000-0000-0000-000000000000'
      }
    })
    let _data: any = {
      productId: dataObj.productId,
      workSectionId: dataObj.workSectionId,
    }
    if (settingType.value == 'missProcessSettings') {
      _data.missProcessSettings = dataSource.value
    } else if (settingType.value == 'productUpdateSettings') {
      _data.productUpdateSettings = dataSource.value
    } else if (settingType.value == 'productStatusDetectSettings') {
      _data.productStatusDetectSettings = dataSource.value
    }
    traceprocesssetting(_data).then(() => {
      visible.value = false
      // 更新选中的数据
      ctx.emit('confirm', '保存成功！')
    })
  }
  return {
    ...dialogHook,
    dataSource,
    dataObj,
    missingProcessColumns,
    settingType,
    onConfirm,
    onOpenSetting,
    updateProcess,
    delDetection,
    pageInfo,
    missTableRef,
  }
}
