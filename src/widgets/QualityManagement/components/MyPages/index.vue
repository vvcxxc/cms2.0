<template>
  <div class="page-container">
    <div class="left">
      共{{ props.total }}条记录 当前第{{ currentPage }}页 共{{ pages }}页 每页{{
        props.pageSize
      }}条记录
    </div>
    <div class="right">
      <!-- <div class="input">
        <el-input
          class="pages"
          v-model="curPage"
          style="width: 50px; margin-right: 5px"
          @blur="jump('jump')"
        ></el-input>
        /{{ totalPage }}
      </div>
      <div class="btn" @click="jump('prev')" :class="{ nopage: curPage <= 1 }">
        <span class="iconfont icon-zuo11"></span>
      </div>
      <div class="btn" @click="jump('next')" :class="{ nopage: curPage >= totalPage }">
        <span class="iconfont icon-you11"></span>
      </div> -->
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="props.pageSize"
        layout="prev, pager, next, jumper"
        :total="props.total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import sdk from '@/cms/sdk.es.js'
import { computed, ref } from 'vue'
const { models } = sdk
const { Language } = models
const { _t } = Language
const props = defineProps({
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSize: {
    type: Number,
    required: true,
    default: 50,
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
})
const emit = defineEmits(['gotoPage'])
const currentPage = ref<number>(1)
const pages = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  currentPage.value = val
  emit('gotoPage', val)
}
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  padding: 16px;
  box-sizing: border-box;

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .input {
      margin: 0 10px;
      display: inline-block;
      margin-right: 5px;
    }

    .btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ecf0f9;
      border-radius: 4px;
      margin-left: 10px;
      cursor: pointer;

      img {
        width: 6px;
        height: 12px;
      }
    }
  }

  :deep(.btn-next),
  :deep(.btn-prev) {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    border: 1px solid #dde0e4;
  }
  :deep(.cs-pagination.is-background .cs-pager li) {
    width: 30px;
    height: 30px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    border: 1px solid #dde0e4;
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
  }

  :deep(.cs-pagination.is-background .cs-pager li:not(.is-disabled).is-active) {
    background: #262626;
    border: 1px solid #dde0e4;
    color: #fff;
  }
  :deep(.cs-input) {
    width: 58px;
    height: 30px;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    border: 0;
  }
  :deep(.cs-pagination__jump) {
    font-size: 14px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
  }
}

.nopage {
  cursor: not-allowed;
}
</style>
