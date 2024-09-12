import { ref, onMounted, reactive, computed, watch } from 'vue'
import { getWorkSectionApi } from '@/api/common-enum'

export const useProcessRouteDialog = (props: any, ctx: any) => {
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const dataSource = ref<any>([]) // 源数据
  const leftSource = ref<any>([]) // 左边的数据
  const rightSource = ref<any>([]) // 右边已选数据
  const leftChecked = ref<any>([]) // 左边已选数据
  const rightChecked = ref<any>([]) // 右边已选数据
  const leftRef = ref()
  const rightRef = ref()
  const getWorkSectionList = async () => {
    const res = await getWorkSectionApi({
      MaxResultCount: 999,
      includeDetails: true,
    })
    dataSource.value = res.items
    rightSource.value = []
    leftSource.value = []
    dataSource.value.forEach((item1: any) => {
      const data = props.data.find((item2: any) => {
        const id = item2.workSectionId || item2.id
        return id === item1.id
      })

      if (data) {
        rightSource.value.push({
          ...item1,
          sort: data.sort,
        })
      } else {
        leftSource.value.push(item1)
      }
    })
    // 还原排序
    rightSource.value.sort((a: any, b: any) => {
      return a.sort - b.sort
    })
    // // 筛选已选的数据
    // rightSource.value = dataSource.value.filter(
    //   (item1: any) =>
    //     props.data?.some((item2: any) => item2.workSectionId === item1.id)
    // )

    // // 筛选未选的数据
    // leftSource.value = dataSource.value.filter(
    //   (item1: any) =>
    //     !rightSource.value.some((item2: any) => item2.id === item1.id)
    // )
  }

  const leftOnCheck = (list: any) => {
    console.log(list)
    leftChecked.value = list
  }

  const rightOnCheck = (list: any) => {
    console.log(list)
    rightChecked.value = list
  }

  const onMoveRight = () => {
    if (!leftChecked.value.length) return
    leftSource.value = leftSource.value.filter((item1: any) => {
      return !leftChecked.value.some((item2: any) => item2.id === item1.id)
    })

    rightSource.value.push(...leftChecked.value)
    leftChecked.value = []
    console.log(leftRef.value, 'left')

    leftRef.value?.clearSelectEvent()
  }

  const onMoveLeft = () => {
    if (!rightChecked.value.length) return
    rightSource.value = rightSource.value.filter((item1: any) => {
      return !rightChecked.value.some((item2: any) => item2.id === item1.id)
    })
    leftSource.value.push(...rightChecked.value)
    rightChecked.value = []

    rightRef.value?.clearSelectEvent()
  }

  const onOpen = () => {
    console.log('onOpen')
    getWorkSectionList()
  }

  const onClose = () => {
    visible.value = false
  }

  const onConfirm = async () => {
    console.log(rightSource.value)
    ctx.emit('confirm', rightSource.value)
    visible.value = false
  }

  return {
    onOpen,
    onMoveRight,
    onMoveLeft,
    rightOnCheck,
    leftOnCheck,
    leftSource,
    rightSource,
    visible,
    onClose,
    onConfirm,
    leftRef,
    rightRef,
  }
}
