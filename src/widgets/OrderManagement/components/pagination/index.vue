<template>
  <div class="pagination-content">
    <span class="info">
      共{{ total }}条记录 当前第{{ pageNum }}页 共{{ totalNum }}页 每页{{
        pageSize
      }}条记录
    </span>
    <div class="pagination">
      <div class="without-pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          size="small"
          :page-size="pageSize"
          v-model:current-page="pageNum"
          @current-change="onCurrentChange"
        />
      </div>
      <div class="numb">
        第
        <el-input-number
          @change="onChange"
          :min="1"
          :controls="false"
          :max="max"
          v-model="pageNum"
          controls-position="right"
          style="width: 58px; height: 30px"
        />
        页
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps<{
  pageSize: number
  total: number
}>()
const pageNum = ref(1)
const totalNum = computed(() =>
  props.total ? Math.ceil(props.total / props.pageSize) : 1
)
const emit = defineEmits(['check', 'sort', 'page'])

const onChange = () => {
  onCurrentChange(Number(pageNum.value))
}

const max = computed(() => {
  if (props.total && props.pageSize) {
    return Math.ceil(props.total / props.pageSize)
  }
  return 1
})

const onCurrentChange = (current: number) => {
  pageNum.value = current
  emit('page', current)
}
</script>
<style scoped lang="scss">
.pagination-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 21px;
  height: 50px;
  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    :deep(.cs-pager) {
      .number {
        width: 28px !important;
        height: 30px;
        background: #ffffff;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
        border: 1px solid #dde0e4;
        color: #333;
      }
      .is-active {
        width: 28px !important;
        height: 30px;
        background: #262626;
        border-radius: 2px 2px 2px 2px;
        opacity: 1;
        border: 1px solid #dde0e4;
        font-size: 14px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }

  .info {
    width: 300px;
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
  .numb {
    margin-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100px;
    font-size: 14px;
    font-weight: bold;
    color: #333333;
    :deep(.cs-input__inner) {
      background-color: #fff !important;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
  }
}
</style>
