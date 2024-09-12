import { ref, reactive, computed, watch } from 'vue'
import { Product } from '../Models/Product'
import { ElMessage } from 'element-plus'
import { _t } from '../app'
import { injectModel } from '@/libs/Provider/Provider'

export const useHeaderFieldSettings = (props: any, ctx: any) => {
  const product = injectModel<Product>('product')

  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const tableRef = ref()
  const dataSource = ref<any[]>([])
  const columns = [
    {
      field: 'productModel',
      title: '产品型号',
      width: 100,
      fixed: 'left',
    },
    {
      field: 'aqhYlUpper',
      title: '安全环压力上限（N）',
      width: 200,
    },
    {
      field: 'aqhYlLower',
      title: '安全环压力下限（N）',
      width: 200,
    },
    {
      field: 'aqhYrxcUpper',
      title: '安全环压入行程上限（mm）',
      width: 200,
    },
    {
      field: 'aqhYrxcLower',
      title: '安全环压入行程下限（mm）',
      width: 200,
    },
    {
      field: 'mfqWzUpper',
      title: '密封圈位置上限（mm）',
      width: 200,
    },
    {
      field: 'mfqWzLower',
      title: '密封圈位置下限（mm）',
      width: 200,
    },
    {
      field: 'mfCheckYl',
      title: '密封检测压力（Kp）',
      width: 200,
    },
    {
      field: 'mfCheckMaxXll',
      title: '密封检测最大泄露量 （cc/min）',
      width: 250,
    },
    {
      field: 'shdlCheckUpper',
      title: '锁簧断裂检测上限（mm）',
      width: 200,
    },
  ]
  const onClose = () => {
    visible.value = false
  }

  watch(
    () => visible.value,
    (val) => {
      if (val) {
        product.getProductex().then((res) => {
          dataSource.value = res
        })
      }
    }
  )

  const onConfirm = async () => {
    if (dataSource.value.some((e) => e.aqhYlUpper === '')) {
      ElMessage.warning(_t('安全环压力上限不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.aqhYlLower === '')) {
      ElMessage.warning(_t('安全环压力下限不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.aqhYrxcUpper === '')) {
      ElMessage.warning(_t('安全环压入行程上限不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.aqhYrxcLower === '')) {
      ElMessage.warning(_t('安全环压入行程下限不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.mfqWzUpper === '')) {
      ElMessage.warning(_t('密封圈位置上限不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.mfqWzLower === '')) {
      ElMessage.warning(_t('密封圈位置下限不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.mfCheckYl === '')) {
      ElMessage.warning(_t('密封检测压力不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.mfCheckMaxXll === '')) {
      ElMessage.warning(_t('密封检测最大泄露量不能为空'))
      return
    }

    if (dataSource.value.some((e) => e.shdlCheckUpper === '')) {
      ElMessage.warning(_t('锁簧断裂检测上限不能为空'))
      return
    }

    product
      .saveProductex(
        dataSource.value.map((item: any) => ({
          ...item,
          aqhYlUpper: Number(item.aqhYlUpper),
          aqhYlLower: Number(item.aqhYlLower),
          aqhYrxcUpper: Number(item.aqhYrxcUpper),
          aqhYrxcLower: Number(item.aqhYrxcLower),
          mfqWzUpper: Number(item.mfqWzUpper),
          mfqWzLower: Number(item.mfqWzLower),
          mfCheckYl: Number(item.mfCheckYl),
          mfCheckMaxXll: Number(item.mfCheckMaxXll),
          shdlCheckUpper: Number(item.shdlCheckUpper),
        }))
      )
      .then((res: any) => {
        ElMessage.success(_t('操作成功'))
        visible.value = false
        ctx.emit('confirm')
      })
  }

  return {
    visible,
    tableRef,
    dataSource,
    columns,
    onClose,
    onConfirm,
  }
}
