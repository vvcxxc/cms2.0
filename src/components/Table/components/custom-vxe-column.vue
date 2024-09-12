<template>
  <vxe-column
    width="60"
    v-if="currentSeq.seq || showDarg || isDrag || isChecked"
  >
    <template #header>
      <el-checkbox
        v-if="isChecked"
        class="th-td-checkbox"
        v-model="checkedAll.checked"
        :indeterminate="checkedAll.isIndeterminate"
        @change="selectChangeAllEvent"
      ></el-checkbox>
      <span v-else-if="currentSeq.seq">{{ _gt(currentSeq.column.title) }}</span>
    </template>
    <template #default="{ row, rowIndex }">
      <div class="custom-td-action">
        <div
          v-show="showDarg || isDrag"
          :class="{
            'drag-move': true,
            'information-row-td': true,
            'td-hover': true,
            disabled: disabledDrag,
          }"
        >
          <img src="@/assets/images/icon_move.png" class="btn-move" />
        </div>
        <span
          v-if="currentSeq.seq"
          :style="currentCheckedStyle(row, true)"
          class="information-row-sort td-sort-hover"
          >{{ rowIndex + 1 }}</span
        >
        <el-checkbox
          :key="row[props.id || 'id']"
          v-if="
            isFunction(isChecked) ? isChecked({ row, rowIndex }) : isChecked
          "
          v-model="selectionMap[row[props.id || 'id']]"
          :style="currentCheckedStyle(row)"
          class="information-row-td td-hover checkout-style"
          @change="(checked: boolean) => currentCheckedEvent(checked, row)"
        ></el-checkbox>
      </div>
    </template>
  </vxe-column>

  <template
    v-for="(column, index) in columns"
    :field="column.field"
    :key="column.field"
  >
    <!-- header -->
    <vxe-column
      v-bind="column"
      :sortable="column.sortable"
      v-if="slots[column?.field] || slots[`${column?.field}.header`]"
      :title="_t(column.title)"
    >
      <template #header="{ row }: any" v-if="slots[`${column?.field}.header`]">
        <slot
          :name="`${column?.field}.header`"
          :row="row"
          :index="index"
          :column="column"
        ></slot>
      </template>
      <!-- column.required == true -->
      <template #header v-if="column?.required">
        <span style="color: #ff2929">*</span>
        {{ _t(column.title) }}
      </template>
      <!-- tipConfig header -->
      <template #header v-if="column?.tipConfig?.tip">
        <div class="header-tip-config-row">
          <span v-if="column?.required" style="color: #ff2929">*</span>
          <span :style="column?.tipConfig?.style">
            {{ _t(column.title) }}
          </span>
          <!-- <el-tooltip
            effect="dark"
            :content="column?.tipConfig?.tip + ''"
            placement="top"
            :persistent="false"
          > -->
          <Icon
            v-if="column?.tipConfig?.icon"
            :width="16"
            :height="16"
            :icon="column?.tipConfig?.icon"
            :title="column?.tipConfig?.tip"
          ></Icon>
          <!-- </el-tooltip> -->
        </div>
      </template>
      <!-- tip -->
      <template #default="{ row, rowIndex }">
        <div
          class="table-context-menu-content"
          slot-type="native"
          @click="(event: Event) => onRowClick(row, event)"
        >
          <div
            @contextmenu="(event) => onClickShowMenu(event, row, rowIndex)"
            slot-type="native"
            class="table-context-menu"
          >
            <slot
              :name="column.field"
              :row="row"
              :index="rowIndex"
              :column="column"
            ></slot>
          </div>
        </div>
      </template>
    </vxe-column>
    <vxe-column v-bind="column" :title="_t(column.title)" v-else>
      <template #default="{ row, rowIndex }">
        <div
          class="table-context-menu-content"
          slot-type="native"
          @click="(event: Event) => onRowClick(row, event)"
        >
          <template v-if="row[column.field]">
            <div
              @contextmenu="(event) => onClickShowMenu(event, row, rowIndex)"
              class="table-context-menu"
              slot-type="native"
            >
              <!-- <el-tooltip
                effect="dark"
                :content="row[column.field] + ''"
                placement="top"
                :persistent="false"
              > -->
              <span
                slot-type="native"
                :title="row[column.field]"
                class="over-ellipsis"
                >{{ row[column.field] }}</span
              >
              <!-- </el-tooltip> -->
            </div>
          </template>
          <template v-else>
            <div
              @contextmenu="(event) => onClickShowMenu(event, row, rowIndex)"
              slot-type="native"
              class="table-context-menu"
            >
              <span slot-type="native" class="over-ellipsis">{{
                row[column.field] || '-'
              }}</span>
            </div>
          </template>
        </div>
      </template>
    </vxe-column>
  </template>
</template>
<script setup lang="ts">
import { computed, ref, useSlots, useAttrs, Ref, watch, inject } from 'vue'
import Icon from '../../Icon/Icon'
import type { TablePropsItemType, contextMenuItemType } from '../index.d'
import { useVModel } from '@vueuse/core'
import { getScopeT } from '@/libs/Language/Language'
import { isFunction } from 'lodash'

interface vxePropsType extends TablePropsItemType {
  id: string
  contextMenuConfig: contextMenuItemType
  headBorder: boolean
  rowStyle: any
}
const props = defineProps<vxePropsType>()
const emit = defineEmits([
  'drag',
  'check',
  'sort',
  'page',
  'rowClick',
  'update:dataSource',
  'clickFooter',
  'update',
  'load',
  'beforeLoad',
])
const _t = getScopeT(props.LanguageScopeKey)
const _gt = getScopeT()
const slots = useSlots()
const tableRef = inject<any>('tableRef')

/**
 * 重新定义列
 */
const columns = computed(() => {
  return props.columns.filter((column) => {
    return column.type !== 'seq' && !column.hide
  })
})
/**
 * 是否含有序号
 */
const currentSeq = computed(() => {
  return {
    seq: props.columns.some((column) => column.type === 'seq'),
    column: props.columns.find((column) => column.type === 'seq') || {
      title: '序号',
      field: 'seq',
      type: 'seq',
    },
  }
})

const contextMenuConfig = useVModel(props, 'contextMenuConfig', emit)

const checkedAll = ref({
  isIndeterminate: false,
  checked: false,
})
const selectionMap = ref<Record<string, boolean>>({})

const currentCheckedStyle = computed(() => {
  return (row: Record<string, any>, isSort?: boolean) => {
    const checkedStyle = {
      display: 'inline',
      marginLeft: '14px',
      marginTop: '-1px',
    }
    if (!currentSeq.value.seq) {
      return checkedStyle
    }
    if (selectionMap.value[row[props.id || 'id']]) {
      if (isSort) {
        if (props.isChecked) {
          return { display: 'none' }
        }
        return {
          display: 'inline',
        }
      } else {
        return checkedStyle
      }
    } else {
      if (isSort && !props.isChecked) {
        return {
          display: 'inline',
          marginLeft: '24px',
        }
      }
      return ''
    }
  }
})

const dataSource = computed({
  get() {
    return props.dataSource
  },
  set(v) {
    if (v) {
      emit('update:dataSource', v)
    }
  },
})

/**
 * 右键菜单
 * @param event
 * @param index
 */
const onClickShowMenu = (event: MouseEvent, row: any, index: number) => {
  if (event) {
    event?.preventDefault()
    contextMenuConfig.value.show = true
    contextMenuConfig.value.options.x = event.x
    contextMenuConfig.value.options.y = event.y
    contextMenuConfig.value.current = {
      row,
      index,
    }
  }
}
/**
 * 清除选中效果
 */
const clearSelection = () => {
  const $table = tableRef.value
  $table?.setAllCheckboxRow(false)

  dataSource.value.forEach((row: Record<string, any>) => {
    selectionMap.value[row[props.id || 'id']] = false
  })
  $table?.clearCheckboxRow()
  checkedAll.value.isIndeterminate = false
  checkedAll.value.checked = false
  emitCheckboxChange()
}

/**
 * 全选
 */
const selectChangeAllEvent = (checked: boolean) => {
  const $table = tableRef.value
  let keyLength = 0

  Object.entries(selectionMap.value).map(([key, value]: any) => {
    if (selectionMap.value.hasOwnProperty(key) && value) {
      keyLength++
    }
  })
  const checkedAllFn = (checked: boolean) => {
    $table?.setAllCheckboxRow(checked)
    const records = $table.getCheckboxRecords()
    records.forEach((row: Record<string, any>) => {
      selectionMap.value[row[props.id || 'id']] = true
    })
  }
  if (!checked && checkedAll.value.isIndeterminate) {
    checkedAll.value.checked = true
  }
  if (keyLength && keyLength !== dataSource.value.length) {
    checkedAllFn(true)
    return selectChangeEvent()
  }
  if (checked) {
    checkedAllFn(checked)
  } else {
    clearSelection()
  }
  checkedAll.value.isIndeterminate = false

  selectChangeEvent()
}
/**
 *
 * @param rows
 */
const selectionHandle = (
  rows: Record<string, any>[],
  checked: boolean = true
) => {
  rows.forEach((row: Record<string, any>) => {
    selectionMap.value[row[props.id || 'id']] = checked
  })
}

/**
 * 单选
 */
const currentCheckedEvent = (checked: boolean, row: Record<string, any>) => {
  const $table = tableRef.value
  $table?.setCheckboxRow([row], checked)

  const records = $table.getCheckboxRecords()
  selectionHandle([row], checked)
  if (records.length > 0) {
    checkedAll.value.isIndeterminate = true
    if (records.length === dataSource.value.length) {
      checkedAll.value.isIndeterminate = false
      checkedAll.value.checked = true
    }
  } else {
    checkedAll.value.isIndeterminate = false
    checkedAll.value.checked = false
  }
  selectChangeEvent()
}

/**
 * 多选
 */
const setCheckboxRow = (rows: Record<string, any>[], checked: boolean) => {
  const $table = tableRef.value
  $table?.setCheckboxRow(rows, checked)
  const records = $table.getCheckboxRecords()
  selectionHandle(rows, checked)
  if (records.length > 0) {
    checkedAll.value.isIndeterminate = true
    if (records.length === dataSource.value.length) {
      checkedAll.value.isIndeterminate = false
      checkedAll.value.checked = true
    }
  } else {
    checkedAll.value.isIndeterminate = false
    checkedAll.value.checked = false
  }
  selectChangeEvent()
}

const selectChangeEvent = () => {
  const $table = tableRef.value
  if ($table) {
    const records = $table.getCheckboxRecords()
    emit('check', records)
  }
}

const onRowClick = (row: Record<string, any>, event: Event) => {
  if (props.isStop) {
    event?.stopPropagation()
  }
  if (props.isChecked) {
    const dom = event.target as HTMLInputElement
    if (dom.getAttribute('slot-type') === 'native') {
      const $table = tableRef.value
      const checked = $table.isCheckedByCheckboxRow(row)
      selectionMap.value[row[props.id || 'id']] = !checked
      currentCheckedEvent(!checked, row)
    }
  }
}

const selectionLength = computed(() => {
  let l = 0
  Object.entries(selectionMap.value).forEach(([key, value]: any[]) => {
    if (value) {
      l++
    }
  })
  return l
})
/**
 * 触发复选框
 */
const emitCheckboxChange = () => {
  const records = tableRef.value?.getCheckboxRecords()
  emit('check', records)
}

const handleDataSelection = () => {
  if (!dataSource.value.length) {
    checkedAll.value.isIndeterminate = false
    checkedAll.value.checked = false
    selectionMap.value = {}
  } else {
    const data: any = {}
    if (!selectionLength.value) {
      data.isIndeterminate = false
      data.checked = false
    } else {
      data.isIndeterminate = true
      data.checked = selectionLength.value === dataSource.value.length
    }
    checkedAll.value = data
  }
  emitCheckboxChange()
}

watch(dataSource, (v: any[], oldV: any[]) => {
  if (v !== oldV) {
    const currentSelectedKeys: Record<string, boolean> = {}
    dataSource.value.forEach((item: Record<string, any>) => {
      const key = item[props.id || 'id']

      if (selectionMap.value.hasOwnProperty(key)) {
        currentSelectedKeys[key] = selectionMap.value[key]
      }
    })
    Object.entries(selectionMap.value).forEach(([key, value]: any[]) => {
      if (!currentSelectedKeys.hasOwnProperty(key)) {
        currentSelectedKeys[key] = false
      }
    })
    selectionMap.value = currentSelectedKeys
    handleDataSelection()
  }
})

defineExpose({ clearSelection, setCheckboxRow, selectChangeAllEvent })
</script>
<style lang="scss">
@import url('../index.scss');
</style>
<style lang="scss" scoped>
@import url('../index.module.scss');
</style>
