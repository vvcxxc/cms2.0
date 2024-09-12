<template>
  <BaseDialog
    :title="dialogConfig.title"
    v-model="visible"
    width="50%"
    destroy-on-close
    @open="onOpen"
    @close="onClose"
    @confirm="onConfirm"
  >
    <div class="table-body">
      <div class="table-header">
        <el-select
          placeholder="请选择"
          clearable
          style="width: 180px"
          v-if="type === TYPE_MAP.BOM"
          v-model="importSelected"
        >
          <el-option label="重要" value="Y"></el-option>
          <el-option label="非重要" value="N"></el-option>
        </el-select>
        <el-input
          placeholder="搜索"
          clearable
          style="width: 180px; margin: 0 10px"
          v-model="searchValue"
        ></el-input>
        <el-button @click="onSearch" type="info">查询</el-button>
      </div>
      <div class="table-content">
        <Table
          ref="productRef"
          :dataSource="dataSource"
          :columns="dialogConfig.columns"
          :total="dialogConfig.total"
          :pageSize="MaxResultCount"
          @page="onPageChange"
        />
      </div>
    </div>
    <template #custom-btn>
      <el-button class="update" size="small" type="info" @click="onUpdate"
        >更新</el-button
      >
    </template>
  </BaseDialog>
</template>
<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import Table from '@/components/Table/index.vue'
import {
  getBomList,
  getLotList,
  getProcessList,
  updateProcess,
  updateBom,
  updateLot,
} from '../../api/process'
import { TYPE_MAP } from '../../enum'
import { ElMessage } from 'element-plus'

interface ParamsItem {
  Filter?: string
  Sorting?: string
  SkipCount?: string | number
  MaxResultCount?: string | number
  IsDesc?: boolean
  SerialInputFlag?: string
}

const MaxResultCount = 20
const SkipCount = 0
const searchValue = ref('')
const importSelected = ref('')

const params: ParamsItem = reactive({
  MaxResultCount,
  SkipCount,
})

const props = defineProps<{
  modelValue: boolean
  title: string
  columns: any[]
  type: string
  other: string
}>()

const emit = defineEmits(['update:modelValue', 'update:dataSource'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

const dataSource = ref([])

const dialogConfig = computed(() => {
  return {
    title: props.title,
    columns: props.columns,
    total: 0,
  }
})

const getList = async () => {
  dataSource.value = []
  const typeMap = {
    [TYPE_MAP.PROCESS]: getProcessList,
    [TYPE_MAP.LOT]: getLotList,
    [TYPE_MAP.BOM]: getBomList,
  }
  const otherParamsMap = {
    [TYPE_MAP.PROCESS]: {
      OrderNumber: props.other,
    },
    [TYPE_MAP.LOT]: {
      Code: props.other,
    },
    [TYPE_MAP.BOM]: {
      OrderNumber: props.other,
    },
  }
  const otherParams = otherParamsMap[props.type]
  if (searchValue.value) {
    params.Filter = searchValue.value
  } else {
    delete params.Filter
  }
  if (props.type === TYPE_MAP.BOM) {
    params.SerialInputFlag = importSelected.value
  }
  Object.assign(params, otherParams)
  const fn = typeMap[props.type]
  const res = await fn(params)

  dataSource.value = res.items
  dialogConfig.value.total = res.totalCount
}

const onSearch = () => getList()

const onOpen = () => {
  searchValue.value = ''
  getList()
}

const onClose = () => {
  visible.value = false
}

const onConfirm = () => {
  onClose()
}

const onUpdate = async () => {
  const updateFnMap = {
    [TYPE_MAP.PROCESS]: updateProcess,
    [TYPE_MAP.LOT]: updateLot,
    [TYPE_MAP.BOM]: updateBom,
  }
  const fn = updateFnMap[props.type]
  await fn(props.other)
  ElMessage.success('更新成功')
  visible.value = false
}

const onPageChange = (v: number) => {
  params.SkipCount = (v - 1) * MaxResultCount
  getList()
}
</script>

<style lang="scss" scoped>
.table-content {
  width: 100%;
  height: 400px;
}

.table-header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.update {
  width: 96px;
  height: 26px;
}
.table-body {
  width: 100%;
  height: 500px;
}
</style>
