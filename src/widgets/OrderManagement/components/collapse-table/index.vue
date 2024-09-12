<template>
  <div>
    <Collapse :title="title" :status="status" style="margin-top: 12px">
      <template #header-right>
        <div class="header-right">
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.DOWNLOADTEMPLATE)"
            class="export"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.DOWNLOADTEMPLATE)"
          >
            导出模板
          </div>
          <el-upload
            action="#"
            accept=".xlsx"
            :show-file-list="false"
            :http-request="onImport"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.UPLOAD)"
          >
            <div class="import">导入</div>
          </el-upload>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.DELIVER)"
            class="deliver"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.DELIVER)"
          >
            下发
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.ACTIVATION)"
            class="edit"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.ACTIVATION)"
          >
            激活
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.EDIT)"
            class="delete"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.EDIT)"
          >
            编辑
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.PAUSE)"
            class="pause"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.PAUSE)"
          >
            暂停
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.REVOKE)"
            class="delete"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.REVOKE)"
          >
            撤销
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.COMPLTE)"
            class="deliver"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.COMPLTE)"
          >
            完成
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.FINISHED)"
            class="finished"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.FINISHED)"
          >
            结束
          </div>
          <div
            @click="onAction(ORDER_ACTIONS_STATUS.DELETE)"
            class="delete"
            v-show="buttons.includes(ORDER_ACTIONS_STATUS.DELETE)"
          >
            删除
          </div>
        </div>
      </template>
      <template #content>
        <Table
          ref="tableRef"
          :total="total"
          :pageSize="paginationConfig.pageSize"
          v-model:dataSource="computedData"
          :columns="columns"
          :isSeq="true"
          :isChecked="true"
          maxHeight="330px"
          id="id"
          @page="onPage"
          @check="handleSelectionChange"
        >
          <template
            #[item.field]="{ row }"
            :key="item.field"
            v-for="item in columnsSlots"
          >
            <span v-if="item.field == 'productModel'">{{
              row.product.model || '-'
            }}</span>
            <span v-else>{{
              (item.formatter
                ? item.formatter(row[item.field])
                : row[item.field]) || '-'
            }}</span>
          </template>
          <template #segments="{ row }" v-if="[1, -1].includes(status)">
            <span :title="currentSegment(row)">{{ currentSegment(row) }}</span>
          </template>
          <template #actionSort="{ row, index }" v-if="!hiddenSort">
            <i
              class="iconfont icon-shang2 sortClass"
              :class="{ prohibit: index === 0 }"
              @click="onSort(row, index, 'top')"
            ></i>
            <i
              class="iconfont icon-xia2 sortClass"
              :class="{ prohibit: index === tableData.length - 1 }"
              @click="onSort(row, index, 'down')"
            ></i>
          </template>
        </Table>
      </template>
    </Collapse>
    <div style="width: 100%; height: 12px"></div>
  </div>
</template>

<script lang="ts" setup>
import Collapse from '../collapse/index.vue'
import type { IProductTableItem } from '../../api/product'
import { ref, reactive, computed } from 'vue'
import { ORDER_ACTIONS_STATUS } from '../../enum'
import { useVModel } from '@vueuse/core'
import api from '../../api/product-setting'
import { createInjector } from '../../hooks/use-permission'
import sdk from 'sdk'
import Table from '@/components/Table/Table'
import Text from '@/components/Text/Text'
const { models } = sdk

const $props = defineProps<{
  modelValue: any[]
  tableHead: any[]
  title: string
  status: number
  total: number
  hiddenSort?: boolean
  buttons: string[]
}>()

const tableRef = ref<any>()

const { isHasPermission } = createInjector()

const tableData: any = useVModel($props)
const computedData: any = computed(() => {
  let _list = tableData.value.map((item: any, idx: number) => ({
    ...item,
    seq:
      (paginationConfig.currentPage - 1) * paginationConfig.pageSize + idx + 1,
  }))
  return _list
})

const columns = computed(() => {
  const data = $props.tableHead.map((item: any) => {
    return {
      ...item,
      title: item.label,
      field: item.prop,
    }
  })

  return $props.title == '生产中'
    ? [{ title: '序号', field: 'seq', type: 'seq' }, ...data]
    : [
        { title: '序号', field: 'seq', type: 'seq' },
        {
          title: '排序',
          field: 'actionSort',
        },
        ...data,
      ]
})

/**
 *
 * 过滤actionSort
 **/
const columnsSlots = computed(() => {
  return columns.value.filter((item: any) => {
    return item.field !== 'actionSort'
  })
})
const emit = defineEmits(['onAction', 'page'])

const tableSelectList = ref<IProductTableItem[]>([])

const currentSegment = computed(() => {
  return (row: Record<string, any>) => {
    const text = row?.segments
      ?.map((v: { segmentName: string; segmentId: string }) => {
        return v.segmentName
      })
      .join(',')
    return text
  }
})

const onSort = (
  row: IProductTableItem,
  index: number,
  type: 'top' | 'down'
) => {
  if (!isHasPermission('OrderManagement-actions-sort')) {
    return
  }

  if (type === 'top') {
    if (index === 0) {
      throw new Error('已经是第一位，无法再向上调整排序')
    }

    const temp = tableData.value[index - 1]
    tableData.value[index - 1] = row
    tableData.value[index] = temp
  } else if (type === 'down') {
    if (index === tableData.value.length - 1) {
      throw new Error('已经是最后一位，无法再向下调整排序')
    }

    const temp = tableData.value[index + 1]
    tableData.value[index + 1] = row
    tableData.value[index] = temp

    // 后端sort 从1开始计算；故+1；下移取当前序号数+1，故+2
    index = index + 2
  }

  const { id } = row

  api.sortTable(id, index)
}

const handleSelectionChange = (val: IProductTableItem[]) => {
  console.log(val)
  tableSelectList.value = val
}

// 分页配置
const paginationConfig = reactive<{
  pageSize: number
  currentPage: number
  total: number
}>({
  pageSize: 10, // X条/页
  currentPage: 1, // 当前第X页
  total: 0, // 总共X页
})

const onAction = (type: string) => {
  emit('onAction', {
    type,
    data: {
      tableSelectList: tableSelectList.value,
    },
    status: $props.status,
  })
}
const onImport = (file: any) => {
  console.log(file)
  emit('onAction', {
    type: ORDER_ACTIONS_STATUS.UPLOAD,
    data: file,
    status: $props.status,
  })
}
const onPage = (current: number) => {
  paginationConfig.currentPage = current
  emit('page', {
    currentPage: paginationConfig.currentPage,
    status: $props.status,
  })
}
</script>

<style lang="scss" scoped>
.sortClass {
  border-radius: 50%;
  color: #fff;
  border: 1px solid #c7c9cc;
  background-color: #c7c9cc;
  padding: 3px;
  font-size: 14px;
  cursor: pointer;
  width: 20px;
  display: flex;
  height: 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  &:last-child {
    margin-left: 8px;
  }

  &:hover {
    background: #5a84ff;
    border: 1px solid #5a84ff;
  }
}

.prohibit {
  cursor: no-drop;

  &:hover {
    border: 1px solid #c7c9cc;
    background-color: #c7c9cc;
  }
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.import {
  width: 65px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 6px 6px 6px 6px;
  background-color: #ff9800;
  border-color: #ff9800;
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border-color: #d7d7d7;
    color: #676767;
  }
}

.export {
  width: 80px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 6px 6px 6px 6px;
  background-color: #35a020;
  border-color: #35a020;
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border-color: #d7d7d7;
    color: #676767;
  }
}

.deliver,
.activation {
  width: 65px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 6px 6px 6px 6px;
  background-color: #03b982;
  border-color: #03b982;
  color: #fff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border-color: #d7d7d7;
    color: #676767;
  }
}

.pause {
  width: 65px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 6px 6px 6px;
  margin-left: 10px;
  cursor: pointer;
  background-color: #f3b367;
  border-color: #f3b367;
  color: #fff;

  &:hover {
    background-color: #fff;
    border-color: #e0e1e7;
    color: #333;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border-color: #d7d7d7;
    color: #676767;
  }
}

.delete {
  width: 65px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 6px 6px 6px;
  margin-left: 10px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #c8c8c8;
  color: #35363b;

  &:hover {
    opacity: 0.8;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border: 1px solid #d7d7d7;
    color: #676767;
  }
}

.finished {
  width: 65px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 6px 6px 6px;
  margin-left: 10px;
  cursor: pointer;
  background-color: #e57a74;
  border-color: #e57a74;
  color: #fff;

  &:hover {
    opacity: 0.8;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border-color: #d7d7d7;
    color: #676767;
  }
}

.edit,
.complete,
.revoke {
  width: 65px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 6px 6px 6px;
  margin-left: 10px;
  cursor: pointer;
  background-color: #6384f6;
  border-color: #6384f6;
  color: #fff;

  &:hover {
    opacity: 0.8;
  }

  &.is-disabled {
    background-color: #c2c2c2;
    border-color: #d7d7d7;
    color: #676767;
  }
}

:deep(.el-table .cell) {
  padding-left: 10px;
}
</style>
