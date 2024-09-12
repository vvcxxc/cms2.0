<template>
  <div
    ref="informationTableRef"
    :i="Language.triggerRenderData.i"
    :class="{
      'information-table': true,
      'information-table-drag': props.showDarg,
      'information-table-border': headBorder,
      [dragClass ? dragClass : '']: dragClass,
    }"
  >
    <div
      :style="{
        height: props.isFooter ? 'calc(100% - 42px)' : '100%',
      }"
    >
      <vxe-table
        v-bind="$attrs"
        show-header-overflow
        show-overflow
        width="100%"
        header-row-class-name="information-table-base-header"
        ref="tableRef"
        min-height="45px"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :empty-text="globalT(emptyText)"
        :size="props.size || 'small'"
        :border="border || true"
        :height="currentHeight"
        :max-height="currentMaxHeight"
        :row-config="{
          isCurrent: true,
          isHover: true,
          keyField: props.id || 'id',
          ...props.rowConfig,
        }"
        :data="dataSource"
        :scroll-y="{ enabled: !!isVScroll }"
        :sort-config="{
          remote: isSort,
        }"
        @checkbox-all="selectChangeEvent"
        @checkbox-change="selectChangeEvent"
        @sort-change="onSortChange"
        @current-change="clickRowChange"
      >
        <!-- 自定义序号，拖拽，选择 -->
        <CustomVxeColumn
          v-bind="props"
          v-model:dataSource="dataSource"
          v-model:contextMenuConfig="contextMenuConfig"
          :id="props.id || 'id'"
          ref="vxeColumnRef"
          @check="onCheck"
          :LanguageScopeKey="props.LanguageScopeKey"
        >
          <template #[name]="data" v-for="name in Object.keys(slots)">
            <slot :name="name" v-bind="data"></slot>
          </template>
        </CustomVxeColumn>
      </vxe-table>
    </div>

    <div @click="onClickFooter" v-if="isFooter" class="information-table-foot">
      <img src="@/assets/images/+.png" style="width: 12px" />
    </div>
    <paginAtion
      v-bind="props"
      :params="params"
      :totalCount="totalCount"
      :pageSize="props.MaxResultCount || props.pageSize || 50"
      @change="onChange"
      @currentChange="onCurrentChange"
      v-model:pageNum="pageNum"
      :tableRef="tableRef"
    />

    <context-menu
      v-if="contextMenu?.length > 0"
      v-model:show="contextMenuConfig.show"
      :options="contextMenuConfig.options"
    >
      <template v-for="(item, index) in contextMenu" :key="index">
        <context-menu-item
          :label="item.label"
          @click="onHandleMenuItem(item)"
          :disabled="!!contextDisabled(item)"
          :style="{
            filter: contextDisabled(item) ? 'opacity(0.4)' : 'none',
          }"
        >
          <div
            :style="{
              cursor: !contextDisabled(item) ? 'pointer' : 'not-allowed',
            }"
            class="table-context-menu-item-c"
          >
            <div style="width: 16px; margin-right: 7px">
              <Icon :height="16" class="icon-box" :icon="item.icon" />
            </div>
            <div class="label-c">{{ item.label }}</div>
          </div>
        </context-menu-item>
      </template>
    </context-menu>
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  nextTick,
  ref,
  useSlots,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  provide,
  defineProps,
  inject,
  useAttrs,
} from 'vue'
import Icon from '../Icon/Icon'
import { ContextMenu, ContextMenuItem } from '@/components/vue3-context-menu'
import Sortable from 'sortablejs'
import isBoolean from 'lodash/isBoolean'
import isNil from 'lodash/isNil'
import { getListData, adjustSort } from './api'
import type {
  ParamsItem,
  TablePropsItemType,
  contextMenuItemType,
} from './index.d'
import CustomVxeColumn from './components/custom-vxe-column.vue'
import paginAtion from './components/pagination.vue'
import { debounce, isFunction } from 'lodash'
import { getScopeT, Language, _t as globalT } from '@/libs/Language/Language'
const props = defineProps<TablePropsItemType>()
const LanguageScopeKey =
  props.LanguageScopeKey || inject('LanguageScopeKey', '')

const _t = LanguageScopeKey ? getScopeT(LanguageScopeKey) : globalT
const attrs = useAttrs()
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
  'reload',
  'update:total',
])

const waitEventFns = ref<any>([])

const baseParams = reactive<any>({
  SkipCount: 0,
  MaxResultCount: props.pageSize || 50,
})

const vxeColumnRef = ref()

const rowClassName = (...arg: any) => {
  const name = 'information-table-base-row'

  const className = props.rowClassName
  if (className) {
    if (isFunction(className)) {
      return `${name} ${className(...arg) || ''}`
    }
    return `${name} ${className || ''}`
  } else {
    return `${name} able`
  }
}

const params = computed<any>(() => {
  const p = props.params || {}

  Object.assign(baseParams, p)

  for (let key in baseParams) {
    if (baseParams[key] === '') {
      delete baseParams[key]
    }
  }
  return baseParams
})

const emptyText = computed(() => {
  return props.emptyText || '暂无数据'
})
const contextMenuConfig = ref<contextMenuItemType>({
  show: false,
  current: null,
  options: {
    zIndex: 2000,
    minWidth: 132,
    x: 0,
    y: 0,
  },
})
const informationTableRef = ref(null)
const pageNum = ref(1)
const tableRef = ref()
const slots = useSlots()
const total = ref(props.total || 0)
let dropR: any = null

provide('tableRef', tableRef)

const totalCount = computed({
  get() {
    if (!isNil(props.total)) {
      return props.total
    } else {
      return total.value
    }
  },
  set(v) {
    if (!isNil(props.total)) {
      emit('update:total', v)
    } else {
      total.value = v
    }
  },
})

const contextDisabled: any = computed(() => {
  return (item: any) => {
    if (item.disabled !== undefined) {
      if (!isNil(item.disabled?.value)) {
        return item.disabled?.value
      } else {
        return item.disabled
      }
    }
    return false
  }
})

const dragClass = computed(() => {
  if (isBoolean(props.showDarg)) return false
  return props.showDarg
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

const currentHeight = computed(() => {
  if (props.height === 'auto') {
    return ''
  }
  return props.maxHeight ? '' : '100%'
})

const currentMaxHeight = computed(() => {
  if (props.height === 'auto') {
    return ''
  }
  if (props.isFooter) {
    if (props.maxHeight) {
      const h = parseInt(props.maxHeight) - 42
      return h > 0 ? h : '100%'
    }
    return '100%'
  } else {
    return props.maxHeight ? props.maxHeight : '100%'
  }
})
/**
 * 菜单
 * @param item
 */
const onHandleMenuItem = (item: any) => {
  item.fn && item.fn(contextMenuConfig.value.current, pageNum.value)
}

/**
 * 点击底部添加
 */
const onClickFooter = () => {
  emit('clickFooter')
}

const onChange = () => {
  onCurrentChange(Number(pageNum.value))
}

const onCheck = (records: Record<string, any>[]) => {
  emit('check', records)
}

const selectChangeEvent = (records: any[]) => {
  // console.log(records, 'records')
}

/**
 * 设置选中
 * @param keys
 * @param checked
 */
const setSelectRow = (keys: any[], checked = true) => {
  const $table = tableRef.value
  if ($table) {
    const fn = () => {
      const rows: any[] = []
      dataSource.value.forEach((item: any) => {
        if (keys.includes(item[props?.id || 'id'])) {
          rows.push(item)
        }
      })
      vxeColumnRef.value.setCheckboxRow(rows, checked)
      emit('check', rows)
    }
    waitEventFns.value.push(fn)
  }
}
/**
 * rows选中
 * @param rows
 * @param checked
 */
const setSelectRowByObj = (rows: any[], checked = true) => {
  const $table = tableRef.value
  if ($table) {
    const fn = () => {
      vxeColumnRef.value.setCheckboxRow(rows, checked)
    }
    waitEventFns.value.push(fn)
  }
}

/**
 * 设置全选选中状态
 * @param checked 选中状态
 */
const setAllCheckboxRow = (checked = false) => {
  const $table = tableRef.value
  if ($table) {
    waitEventFns.value.push(() =>
      vxeColumnRef.value.selectChangeAllEvent(checked)
    )
  }
}

/**
 * 设置单行高亮
 * @param key
 */
const setCurrentRow = (key: string) => {
  const $table = tableRef.value
  if ($table) {
    const fn = () => {
      const row = dataSource.value.find((item: any) => {
        return key === item[props?.id || 'id']
      })
      if (row) {
        tableRef.value.setCurrentRow(row)
      }
    }
    waitEventFns.value.push(fn)
  }
}

/**
 * 清除选中
 */
const clearSelectEvent = () => {
  const $vxeColumnRef = vxeColumnRef.value
  if ($vxeColumnRef) {
    $vxeColumnRef.clearSelection()
  }
}

const onSortChange = (row: any) => {
  const column = props.columns.find((item) => item.field === row.field)
  if (column) {
    if (row.order === 'asc') {
      params.value[column.sortKey] = true
    } else if (row.order === 'desc') {
      params.value[column.sortKey] = false
    } else {
      delete params.value[column.sortKey]
    }
    getTableList()
  }

  emit('sort', row)
}

/**
 * 设置单选
 * @param row
 */
const setRow = (row: any) => {
  const $table = tableRef.value
  if ($table) {
    const fn = () => {
      tableRef.value.setCurrentRow(row)
    }
    waitEventFns.value.push(fn)
  }
}

const clickRowChange = (tableData: Record<string, any>[]) => {
  const $table = tableRef.value
  if ($table) {
    emit('rowClick', tableData)
  }
}

const onCurrentChange = (current: number) => {
  pageNum.value = current

  // @ts-ignore
  params.value.SkipCount = (current - 1) * params.value.MaxResultCount
  if (props.url) {
    getTableList()
  }
  emit('page', current)
}

const sortableInit = () => {
  const moveDom = tableRef.value.$el.querySelector(
    `.body--wrapper>.vxe-table--body tbody`
  ) as HTMLElement
  if (moveDom && Sortable) {
    dropR = new Sortable(moveDom, {
      handle: '.drag-move',
      chosenClass: 'sortable-chosen',
      swapThreshold: 1,
      draggable: '.able',
      animation: 150,
      onEnd: (sortableEvent: any) => {
        const newIndex = sortableEvent.newIndex as number
        const oldIndex = sortableEvent.oldIndex as number
        const data = [...dataSource.value]

        const currRow = data.splice(oldIndex, 1)[0]
        data.splice(newIndex, 0, currRow)
        dataSource.value = []
        nextTick(async () => {
          dataSource.value = data
          if (props.sortUrlTpl) {
            const sortData = {
              id: currRow.id,
              sort:
                newIndex + 1 + (pageNum.value - 1) * baseParams.MaxResultCount,
            }
            await adjustSort(sortData, props.sortUrlTpl)
          }
          emit('drag', newIndex, oldIndex, currRow)
        })
      },
    })
  }
}

const getTableList = () => {
  return new Promise(async (r: any) => {
    const res = await getListData(params.value, props.url || '')
    dataSource.value = []
    nextTick(() => {
      dataSource.value = res?.items || res
      totalCount.value = res?.totalCount || 0
      r()
      emit('reload')
    })
  })
}

const getList = (formData?: Record<string, any>) => {
  return new Promise((resolve) => {
    if (formData) {
      Object.assign(params.value, formData)
    }
    nextTick(async () => {
      await getTableList()
      resolve(dataSource.value)
    })
  })
}

/**
 * 获取列表提交参数
 */
const getParams = () => {
  return params.value
}

/**
 * 获取分页参数
 */
const getPaginationParams = () => {
  return {
    pageNum: pageNum.value,
    pageSize: params.value.MaxResultCount,
    totalCount: totalCount.value,
  }
}
/**
 * 队列处理事件函数
 */
const handleEventFns = () => {
  if (!waitEventFns.value.length || !dataSource.value.length) return
  nextTick(() => {
    let fn: () => void = waitEventFns.value.pop()
    while (fn) {
      fn()
      fn = waitEventFns.value.pop()
    }
  })
}
/**
 * 跳转
 */
const scrollToRowLine = () => {
  const t = setTimeout(() => {
    tableRef.value?.scrollToRow(dataSource.value[dataSource.value.length - 1])
    clearTimeout(t)
  })
}
/**
 * 跳转
 */
const skipRow = (row: any) => {
  const t = setTimeout(() => {
    tableRef.value?.scrollToRow(row)
    tableRef.value.setCurrentRow(row)
    clearTimeout(t)
  })
}

/**
 * 滚动并定位到那一行，如有分页，需要跳转到分页
 */
const scrollToRow = async ({ row, skip }: any) => {
  if (skip) {
    if (totalCount.value > dataSource.value.length) {
      pageNum.value = Math.ceil(totalCount.value / params.value.MaxResultCount)
      params.value.SkipCount = (pageNum.value - 1) * params.value.MaxResultCount
    }
    await getTableList()
    skipRow(dataSource.value[dataSource.value.length - 1])
  } else {
    skipRow(row)
  }
}
Language.useChange((lang: typeof Language) => {
  if (props.url) {
    getList()
  }
})
onUnmounted(() => {
  dropR?.destroy()
})

onMounted(async () => {
  emit('beforeLoad')
  if (props.url) {
    await getTableList()
  }

  if (props.selections?.length && dataSource.value.length) {
    setSelectRow(props.selections)
  }
  sortableInit()
  // 表格数据加载完成的回调
  emit('load')
})

watch(
  () => dataSource.value.map((item) => item[props.id || 'id']),
  (v, oldV) => {
    const oldVArr = oldV.filter((v) => v)
    if (dataSource.value.length !== oldVArr.length) {
      tableRef.value?.loadData(dataSource.value)
    }
    if (props.autoFirstClickRow) {
      if (dataSource.value.length) {
        const row = dataSource.value[0]
        setCurrentRow(row[props?.id || 'id'])
        emit('rowClick', { row })
      }
    }
    nextTick(handleEventFns)
  },
  {
    deep: true,
  }
)

const exposeMap = {
  setCurrentRow,
  setSelectRow,
  setAllCheckboxRow,
  setRow,
  clearSelectEvent,
  getList,
  getParams,
  getPaginationParams,
  setSelectRowByObj,
  scrollToRow,
  scrollToRowLine,
}

defineExpose(exposeMap)

emit('update', exposeMap)
</script>
<style lang="scss">
@import url('./index.scss');
</style>
<style lang="scss" scoped>
@import url('./index.module.scss');
</style>
