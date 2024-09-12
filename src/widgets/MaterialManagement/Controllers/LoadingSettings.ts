import { ref, reactive, computed, nextTick } from 'vue'
import sdk from 'sdk'
const { openVariableDialog } = sdk.utils
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { Material } from '../Models/Material'
import { injectModel } from '@/libs/Provider/Provider'

export const useLoadingSettings = (props: any, ctx: any) => {
  const material = injectModel<Material>('material')

  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const dataObj = reactive({
    chooseMaterialVisible: false,
    warehouseSignal: '',
  })
  const checkedList = ref<any[]>([])

  const onCheck = (records: any) => {
    console.log('onCheck', records)
    checkedList.value = records
  }

  const onDelete = async () => {
    if (!checkedList.value.length) {
      ElMessage.warning('请选择物料进行删除!')
      return
    }
    ConfirmBox('是否确认删除选中物料？').then(() => {
      dataSource.value = dataSource.value.filter(
        (e) =>
          !checkedList.value.some((item) => item.materialId == e.materialId)
      )
      tableRef.value?.clearSelectEvent()
    })
  }

  const openChooseMaterial = () => {
    dataObj.chooseMaterialVisible = true
  }
  const chooseMaterialCallback = (data: any) => {
    console.log(data)
    const _data: any[] = []
    console.log(dataSource.value, data)
    data.forEach((e: any) => {
      const _obj = dataSource.value.find(
        (item: any) => item.materialId == e.materialId
      )
      if (!_obj) {
        _data.push({
          materialId: e.materialId,
          materialName: e.name,
          materialType: e.materialType,
          signal: '',
        })
      } else {
        _data.push(_obj)
      }
    })
    dataSource.value = []
    nextTick(() => {
      dataSource.value = _data
    })
  }
  const selectVariable = async () => {
    try {
      const varData = await openVariableDialog({
        isMultiple: false,
      })
      dataObj.warehouseSignal = varData.name
    } catch (error) {
      console.log(error)
    }
  }
  const tableRef = ref()
  const dataSource = ref<any[]>([])
  const materialTypeMap: any = {
    0: '批次料',
    1: '唯一料',
  }
  const columns = [
    {
      field: 'materialName',
      title: '物料名称',
    },
    {
      field: 'materialType',
      title: '物料类型',
    },
    {
      field: 'signal',
      title: '信号值',
    },
  ]
  const onClose = () => {
    visible.value = false
  }
  const onOpen = () => {
    material.getFeeding().then((res: any) => {
      dataObj.warehouseSignal = res.warehouseSignal
      dataSource.value = res.details || []
    })
  }

  const onConfirm = async () => {
    material
      .putFeeding({
        warehouseSignal: dataObj.warehouseSignal,
        details: dataSource.value,
      })
      .then((res: any) => {
        ElMessage.success('保存成功')
        visible.value = false
        ctx.emit('confirm')
      })
  }

  return {
    dataObj,
    visible,
    tableRef,
    dataSource,
    materialTypeMap,
    columns,
    onClose,
    onConfirm,
    onOpen,
    onCheck,
    onDelete,
    openChooseMaterial,
    chooseMaterialCallback,
    selectVariable,
  }
}
