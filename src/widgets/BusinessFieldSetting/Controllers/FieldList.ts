import { SetupContext, ref, watch, onMounted, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { injectModel } from '@/libs/Provider/Provider'
import { FieldList } from '../Models/FieldList'
import { useGlobalState } from '@/libs/Store/Store'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'

export const useField = (props: any, { emit }: SetupContext) => {
  const field = injectModel<FieldList>('fieldList')
  const { getProductList } = useGlobalState()
  const businessFieldMap = ref<Record<string, any>>({})
  /***
   * tableRef
   */
  const tableRef = ref()
  /**
   * 流程名称
   */
  const search = ref('')

  const productLine = ref()

  const productLineList = ref<
    {
      id: string
      value: string
      name: string
      product: string
    }[]
  >([])

  /**
   * 搜索
   * @param val
   */
  const onSearch = (val: string) => {
    tableRef.value?.getList({
      Name: search.value,
    })
  }
  /**
   * 变量变化时
   */
  const onChange = async (v: string) => {
    // await field.updateFields(currentAllDataSource.value)
  }

  const onChangeProductLine = () => {
    // 切换数据
    let segment: any = productLine.value
      ? productLineList.value.find((item) => item.value === productLine.value)
      : null
    if (!businessFieldMap.value[productLine.value]) {
      const dataSource = cloneDeep(businessFieldMap.value['default']).map(
        (item: any) => {
          return {
            ...item,
            segment: segment || null,
            variable: '',
          }
        }
      )
      businessFieldMap.value[productLine.value] = dataSource
    } else {
      businessFieldMap.value[productLine.value] = businessFieldMap.value[
        productLine.value
      ].map((item: any) => {
        if (segment) {
          if (segment.data) {
            segment = {
              ...segment.data,
              value: segment.value,
            }
          }
        }

        return {
          ...item,
          segment,
        }
      })
    }
  }

  const onSave = async () => {
    await field.updateFields(currentAllDataSource.value)
    ElMessage.success('保存成功')
  }

  const initData = async () => {
    const dataSource = await field.getList()

    dataSource.forEach((item: any) => {
      // 此处不能使用id，因为这个segment.id每次都会随机生成，可能会出现重复数据,且匹配不到
      const key = item.segment
        ? item.segment.value || item.segment.id
        : 'default'
      if (!businessFieldMap.value[key]) {
        businessFieldMap.value[key] = []
      }

      if (
        !businessFieldMap.value[key].find((it: any) => {
          return it.fieldCode === item.fieldCode
        })
      ) {
        let segment = null

        if (item.segment) {
          if (item.segment.data) {
            segment = {
              ...item.segment.data,
              value: item.segment.value,
            }
          } else {
            segment = item.segment
          }
        }

        businessFieldMap.value[key].push({
          ...item,
          segment,
        })
      }
    })
    productLineList.value = await getProductList()
  }

  const currentDataSource = computed(() => {
    const key = productLine.value ? productLine.value : 'default'
    return businessFieldMap.value[key] || []
  })

  const currentAllDataSource = computed(() => {
    const arr: any = []
    Object.entries(businessFieldMap.value).forEach(([key, dataSource]) => {
      if (key !== 'undefined') {
        arr.push(...dataSource)
      }
    })
    return arr
  })

  onMounted(initData)

  return {
    dataSource: field.dataSource,
    tableRef,
    search,
    productLine,
    productLineList,
    currentDataSource,
    onChangeProductLine,
    onChange,
    onSearch,
    onSave,
  }
}
