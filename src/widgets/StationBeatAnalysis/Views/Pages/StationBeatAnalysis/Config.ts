import { useGlobalState } from '@/libs/Store/Store'

import { reactive, onMounted, ref, Ref } from 'vue'

interface StateType<T> {
  state: Ref<T>
}
const productionLineListState: StateType<any[]> = {
  state: ref([]),
}
const ProductModelListState: StateType<any[]> = {
  state: ref([]),
}

onMounted(() => {
  const { productionLineList, ProductModelList } = useGlobalState()
  productionLineListState.state.value = productionLineList.state.value
  ProductModelListState.state.value = ProductModelList.state.value
})

export const columns = reactive([
  {
    type: 'seq',
    width: 60,
    title: '序号',
  },
  {
    field: 'productModel',
    title: '产品型号',
    el: 'select',
    // 搜索时所用的字段
    prop: 'productId',
    options: ProductModelListState.state,
    placeholder: '请选择所属产品型号',
  },
  {
    field: 'productionLineSegmentName',
    title: '产线段',
    el: 'select',
    // 搜索时所用的字段
    prop: 'productionLineId',
    options: productionLineListState.state,
    placeholder: '请选择所属产线段',
  },
  {
    field: 'workSectionCode',
    title: '工序编号',
  },
  {
    field: 'workSectionName',
    title: '工序名称',
  },
  {
    field: 'missingProcessSettingInfo',
    title: '漏工序检测',
  },
  {
    field: 'productUpdateSettingInfo',
    title: '产品码更新',
  },
])
