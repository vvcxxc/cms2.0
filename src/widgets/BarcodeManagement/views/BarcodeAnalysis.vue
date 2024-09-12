<template>
  <div class="bar-content">
    <div class="bar-header">
      <IconButton
        v-permission="'analysis-management-add'"
        icon="add-p"
        type="primary"
        @click="onAdd"
      >
        新增
      </IconButton>
      <IconButton
        v-permission="'analysis-management-edit'"
        icon="edit"
        @click="onEdit"
      >
        编辑
      </IconButton>
      <IconButton
        v-permission="'analysis-management-delete'"
        icon="delete"
        @click="onDelete"
        >删除</IconButton
      >
      <IconButton
        v-permission="'analysis-management-view'"
        icon="view"
        @click="onView"
        >查看</IconButton
      >
      <Search
        class="search"
        @confirm="onSearch"
        placeholder="请输入解析规则名称"
        v-model="searchInner"
      />
    </div>
    <div class="table-content">
      <BaseTable
        :params="{
          Filter: searchInner,
        }"
        ref="tableRef"
        url="/api/v1/barcodemanagement/barcodeanalysis"
        v-model:dataSource="dataSource"
        :columns="BarcodeAnalysisColumns"
        :isChecked="true"
        :isFooter="false"
        @check="onCheck"
      >
        <template #type="{ row }">
          {{ BarcodeAnalysisType[row.type] }}
        </template>
        <template #barcodeSegmentComposition="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.barcodeAnalysisDetails.map((e: any) => e.name).join('/')"
            placement="top"
          >
            {{ row.barcodeAnalysisDetails.map((e: any) => e.name).join('/') }}
          </el-tooltip>
        </template>
        <template #ruleByType="{ row }">
          {{
            (() => {
              switch (row.type) {
                case 0:
                  return row.symbol
                case 1:
                  return row.startSymbol + row.endSymbol
                case 2:
                  return row.fixedLength
                default:
                  return '-'
              }
            })()
          }}
        </template>
        <template #isUsed="{ row }">
          {{ row.isUsed ? '使用中' : '未使用' }}
        </template>

        <template #lastModificationTime="{ row }">
          {{
            row.lastModificationTime
              ? dayjs(row.lastModificationTime).format('YYYY-MM-DD HH:mm:ss')
              : '-'
          }}
        </template>
      </BaseTable>
    </div>
    <BarcodeAnalysisDialog
      :visible="visible"
      :isView="isView"
      @confirm="onConfirmDialog"
      @close="onCloseDialog"
      :title="currentTitle"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive, computed } from 'vue'
import { deleteBarcodeAnalysis, message } from '../action'
// import Table from '@/components/Table/index.vue'
import BaseTable from '@/components/Table/Table'
import BarcodeAnalysisDialog from '../components/BarcodeAnalysisDialog.vue'
import {
  BarcodeAnalysisColumns,
  BarcodeAnalysisType,
  BarcodeAnalysisRow,
  BarcodeAnalysisCurrent,
} from '../state'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'

import IconButton from '@/components/IconButton/IconButton'
import Search from '@/components/Search/Search'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
import { vPermission } from '@/libs/Permission/Permission'

const tableRef = ref()
const visible = ref(false)

const dataSource = ref<BarcodeAnalysisRow[]>([])

const searchInner = ref('')
const checkedList = ref<BarcodeAnalysisRow[]>([])

const isView = ref(false)

const setCurrent = (row: any) => {
  BarcodeAnalysisCurrent.value = row ? cloneDeep(row) : row
}

const onAdd = () => {
  setCurrent(null)
  isView.value = false
  visible.value = true
}

const onView = (row: any) => {
  if (!checkedList.value.length) {
    ElMessage.warning('请选择一个规则进行查看!')
    return
  }

  if (checkedList.value.length > 1) {
    ElMessage.warning('仅支持编辑单个查看!')
    return
  }
  setCurrent(checkedList.value[0])
  visible.value = true
  isView.value = true
}
const onEdit = (row: any) => {
  if (!checkedList.value.length) {
    ElMessage.warning('请选择一个规则进行编辑!')
    return
  }

  if (checkedList.value.length > 1) {
    ElMessage.warning('仅支持编辑单个规则!')
    return
  }
  setCurrent(checkedList.value[0])
  visible.value = true
  isView.value = false
}
const onDelete = (row: any) => {
  if (!checkedList.value.length) {
    ElMessage.warning('请选择条码进行删除!')
    return
  }
  ConfirmBox('条码删除后不可恢复，是否确认删除？').then(async () => {
    const ids = checkedList.value.map((item) => item.id) ?? []
    await deleteBarcodeAnalysis(ids as string[])
    ElMessage.success('删除成功')
    tableRef.value?.getList()
  })
}

const onCloseDialog = () => {
  visible.value = false
}

const onConfirmDialog = () => {
  tableRef.value?.clearSelectEvent()
  visible.value = false
  tableRef.value?.getList()
}

const currentTitle = computed(() => {
  if (isView.value) return '查看规则'
  if (!isView.value) {
    if (BarcodeAnalysisCurrent.value) return '编辑规则'
  }
  return '新增规则'
})

const onSearch = () => {
  tableRef.value?.getList()
  tableRef.value?.clearSelectEvent()
}

const onCheck = (records: BarcodeAnalysisRow[]) => {
  console.log('onCheck', records)
  checkedList.value = records
}
</script>
<style lang="scss" scoped>
.bar-content {
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  .bar-header {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    .search {
      margin-left: auto;
    }
  }
  .bar-search {
    width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 6px;
    .search-btn {
      color: #fff;
      height: 26px !important;
    }
  }
  .table-content {
    width: 100%;
    height: calc(100% - 25px);
    .without-btn {
      color: #000;
    }
  }
  .add {
    width: 22px;
    height: 22px;
    background-image: url(@/assets/svg/add.svg);
    background-size: 20px 20px;
    background-position: center;
    background-color: #8b9ca4;
    border-radius: 4px;
    margin-right: 2px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.without-picker-popper_content.is-light {
  background-color: var(--el-color-white) !important;
  border: 1px solid var(--el-datepicker-border-color) !important;
  box-shadow: var(--el-box-shadow-light) !important;
  padding: 0 !important;
  max-width: inherit !important;

  .cs-popper__arrow:before {
    background: var(--el-color-white) !important;
  }
}
</style>
