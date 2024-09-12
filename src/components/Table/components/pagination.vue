<template>
  <div v-if="!isHidePagination" class="pagination-content">
    <span class="info">
      {{ _t('共') + totalCount + _t('条记录') }}
      {{ _t('当前第') + pageNum + _t('页') }}
      {{
        _t('共') +
        (totalCount ? Math.ceil(totalCount / (pageSize || 1)) : 1) +
        _t('页')
      }}
      {{ _t('每页') + (params.MaxResultCount || pageSize) + _t('条记录') }}
    </span>
    <div class="pagination">
      <div class="information-pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="Number(totalCount)"
          size="small"
          v-model:current-page="pageNum"
          :page-size="params.MaxResultCount || pageSize"
          @current-change="onCurrentChange"
        />
      </div>
      <div class="numb">
        {{ _t('第') }}
        <el-input-number
          @change="onChange"
          :min="1"
          :controls="false"
          :max="max"
          v-model="pageNum"
          controls-position="right"
          style="width: 58px; height: 30px"
        />
        {{ _t('页') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, reactive } from 'vue'
import type { ParamsItem, TablePropsItemType } from '../index.d'
import { useVModel } from '@vueuse/core'
import { _t } from '@/libs/Language/Language'

interface paginationPropsType extends TablePropsItemType {
  tableRef: Record<string, any>
  pageNum: number
  totalCount: number
}

const props = defineProps<paginationPropsType>()

const emit = defineEmits(['currentChange', 'change'])

const params = computed<ParamsItem>(() => {
  return props.params || {}
})

const pageNum = useVModel(props, 'pageNum', emit)
const totalCount = computed(() => {
  return props.totalCount
})

const onChange = () => {
  emit('change', Number(pageNum.value))
}

const max = computed(() => {
  const total = props.url ? totalCount.value : props.total
  const pageSize = props.pageSize || params.value.MaxResultCount
  if (total && pageSize) {
    return Math.ceil(total / pageSize)
  }
  return 1
})

const onCurrentChange = (current: number) => {
  emit('currentChange', current)
}
</script>
<style lang="scss">
@import url('../index.scss');
</style>
<style lang="scss" scoped>
@import url('../index.module.scss');
</style>
