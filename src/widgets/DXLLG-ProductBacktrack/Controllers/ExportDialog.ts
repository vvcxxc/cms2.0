import { ref, Ref, onMounted, reactive, computed, inject, nextTick } from 'vue'

import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { ProductBacktrack } from '../Models/ProductBacktrack'
import { injectModel } from '@/libs/Provider/Provider'
import dayjs from 'dayjs'

import _get from 'lodash/get'
import _set from 'lodash/set'
import { downloadFile } from '@/utils'

export const useExportPop = (props: any, ctx?: any) => {
  const productBacktrack = injectModel<ProductBacktrack>('ProductBacktrack')
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
      title: '输入条码',
      field: 'name',
      required: true,
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
    const res = await productBacktrack.exportProductTrace(
      dataList.value.map((item: any) => item.name)
    )
    downloadFile(res, `产品码回溯_${dayjs().format('YYYYMMDDHHMMss')}.xlsx`)
    ElMessage.success('导出成功')
    ctx.emit('confirm')
    onClose()
  }
  const importFn = async (file: { file: File }, source: Ref) => {
    try {
      let formData = new FormData()
      formData.append('file', file.file)
      const params = await productBacktrack.importbarcode(formData)

      dataList.value = params.map((value: any, index: number) => ({
        name: value,
      }))

      ElMessage.success('操作成功')
    } catch (e) {
      ElMessage.error('导入失败，请检查文件数据')
    }
  }
  const exportFn = async () => {
    const res = await productBacktrack.exportbarcode(
      dataList.value.map((item: any) => item.name)
    )
    downloadFile(res, `产品码_${dayjs().format('YYYYMMDDHHMMss')}.xlsx`)
  }
  const onOpen = async () => {}
  return {
    visible,
    dataList,
    tableRef,
    columns,
    contextMenu,
    onOpen,
    onClose,
    onConfirm,
    importFn,
    exportFn,
  }
}
