import { ref, Ref, onMounted, reactive, computed, inject, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { SpecialProcess } from '../Models/SpecialProcess'
import { SpecialStation } from '../Models/SpecialStation'
import { injectModel } from '@/libs/Provider/Provider'

import _get from 'lodash/get'
import _set from 'lodash/set'

export const useProcessSettingDialog = (props: any, ctx?: any) => {
  const specialProcess = injectModel<SpecialProcess>('specialProcess')

  const tableRef = ref()
  const dataList = ref<any[]>([])
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const columns = [
    {
      title: '参数名',
      field: 'name',
      required: true,
      el: 'input',
    },
    {
      title: '参数描述',
      field: 'description',
      required: false,
      el: 'input',
    },
  ]

  const contextMenu = [
    {
      label: '向上插入一行',
      fn: (c: any, pageNum: number) => {
        dataList.value.splice(c.index, 0, {
          id: `row_${new Date().getTime()}`,
          name: '',

          description: '',
          filePath: '',
        })
      },
      divided: true,
      icon: 'up',
    },
    {
      label: '向下插入一行',
      fn: (c: any, pageNum: number) => {
        dataList.value.splice(c.index + 1, 0, {
          id: `row_${new Date().getTime()}`,
          name: '',

          description: '',
        })
      },
      divided: true,
      icon: 'down',
    },
    {
      label: '删除',
      fn: async (c: any) => {
        ConfirmBox(`是否删除${c.row.name || '选中行'}`).then(async () => {
          dataList.value.splice(c.index, 1)
        })
      },
      icon: 'close',
    },
  ]

  const onClose = () => {
    visible.value = false
  }
  const onConfirm = async () => {
    if (dataList.value.some((item: any) => !item.name)) {
      ElMessage.warning('参数名不能为空')
      return
    }
    await specialProcess.updateWorkSectionSpecial(props.row.id, {
      id: props.row.id,
      workSectionId: props.row.workSectionId,
      workSection2DetailParameters: dataList.value.map(
        (item: any, idx: number) => ({
          ...item,
          sort: idx,
          id: String(item.id).indexOf('row_') >= 0 ? 0 : item.id,
          workSectionId: props.row.workSectionId,
          workSectionName: props.row.workSectionName,
          workSectionCode: props.row.workSectionCode,
        })
      ),
    })
    ElMessage.success('保存成功')
    ctx.emit('confirm')
    onClose()
  }
  const delSetting = async () => {
    ConfirmBox(
      `是否确认删除${props.row?.workSectionName}工序的试漏仪参数配置？`
    ).then(async () => {
      await specialProcess.deleteSectionSpecial(props.row.workSectionId)
      ElMessage.success('删除成功')
      ctx.emit('confirm')
      onClose()
    })
  }

  const onOpen = async () => {
    console.log(props.row)
    specialProcess
      .getWorkSectionSpecial(props.row.workSectionId)
      .then((res: any) => {
        dataList.value = res.workSection2DetailParameters?.length
          ? res.workSection2DetailParameters
          : [
              {
                id: `row_${new Date().getTime()}`,
                name: '',
                description: '',
              },
            ]
      })
  }
  return {
    visible,
    dataList,
    tableRef,
    columns,
    contextMenu,

    onOpen,
    onClose,
    onConfirm,
    delSetting,
  }
}
