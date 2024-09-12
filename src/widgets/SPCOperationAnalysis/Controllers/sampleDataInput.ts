import { ref, onMounted, reactive, computed, h } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getSampleDataEntry,
  saveSampleDataEntry,
} from '../Models/Service/Service'
export const useSampleDataInput = (props: any, ctx?: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })
  const tableRef = ref<any>(null)
  const sampleNum = ref<number>(0)
  const inputVal = ref<string>('')
  const dataSource = ref<any>([])
  const column = ref<any>([])
  const onClose = () => {
    // 关闭弹窗方式不同会使得onClose会调用一次或者两次，这里走一次就行，visible变了就不走第二次了
    if (visible.value) {
      visible.value = false
      ctx.emit('close')
    }
  }

  const onOpen = () => {
    getSampleDataEntry({
      checkItemConfigId: props.checkItemConfigId,
    }).then((res: any) => {
      column.value = res.columnNames.map((item: any) => {
        return { title: item, field: item, value: item, minWidth: 200 } //value用不上纯记录
      })

      dataSource.value = res.sampleDatas || []
      inputVal.value = res.sampleRemark
      sampleNum.value = res.count
    })
  }

  const onConfirm = async () => {
    let b = ''
    dataSource.value.forEach((item: any) => {
      let arr = Object.keys(item)
      arr.forEach((key: any) => {
        if (key != 'id' && (isNaN(item[key]) || item[key] === '')) {
          console.log(item[key])
          b = b + key + ';'
        }
      })
    })
    if (b) {
      ElMessage.warning(`样本：${b}数据不符合要求，请检查！`)
      return
    }
    saveSampleDataEntry({
      checkItemConfigId: props.checkItemConfigId,
      sampleRemark: inputVal.value,
      sampleDatas: dataSource.value.map((item: any) => {
        let _item = { ...item }
        delete _item['id']
        return _item
      }),
    }).then((res: any) => {
      ElMessage.success('保存成功')
    })
  }
  const onClear = () => {
    // onOpen()
    dataSource.value.map((item: any) => {
      let keys = Object.keys(item)
      keys.forEach((key: any) => {
        if (key != 'id' && key != '子组') {
          item[key] = ''
        }
      })
    })
  }

  return {
    tableRef,
    dataSource,
    column,
    visible,
    sampleNum,
    inputVal,
    onOpen,
    onClose,
    onConfirm,
    onClear,
  }
}
