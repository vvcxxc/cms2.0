<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="production-tracking">
    <SettingItem title="筛选">
      <div class="row">
        <el-checkbox v-model="isCurrentFilter" label="显示筛选条件" />
      </div>
    </SettingItem>
    <!-- 数据 -->
    <SettingItem title="数据">
      <!-- 产品型号 -->
      <div class="row">
        <span>产品型号</span>
        <ElSelect
          v-model="dataConfig.productId"
          style="width: 200px"
          placeholder="请选择"
          clearable
          filterable
          @change="onProductChange"
        >
          <ElOption
            v-for="product in productList"
            :key="product.id"
            :label="product.model"
            :value="product.id"
          ></ElOption>
        </ElSelect>
      </div>
      <!-- 工序 -->
      <div class="row">
        <span>工序</span>
        <CsTree
          v-model="dataConfig.workSectionId"
          default-expand-all
          placement="bottom-start"
          node-key="headerId"
          value-key="headerId"
          clearable
          filterable
          :data="workSectionTree"
          style="width: 200px"
          @change="onSectionChange"
        />
      </div>
      <!-- 字段 -->
      <div class="data-icon">
        <div class="data-icon-size">字段</div>
        <div class="data-icon-size">宽度</div>
        <Icon
          cursor="pointer"
          @click="onAddOption"
          icon="plus"
          :width="18"
          :height="18"
        ></Icon>
      </div>

      <div class="row">
        <div class="tracking-data">
          <div
            class="row-select"
            v-for="(field, index) in fields"
            :key="field.key || index"
          >
            <Icon class="row-move" icon="icon_move" :width="8" :height="12" />
            <ElSelect
              class="tracking-select"
              v-model="field.key"
              placeholder="请选择"
              clearable
              filterable
              @change="() => onFieldChange(field)"
            >
              <ElOption
                v-for="item in columns"
                :disabled="fieldKeys.includes(item.key)"
                :label="item.name"
                :value="item.key"
              ></ElOption>
            </ElSelect>
            <el-input-number
              style="width: 80px; margin: 0 5px"
              class="cms-el-input-number-x"
              v-model="field.width"
              controls-position="right"
            />
            <Icon
              title="删除"
              cursor="pointer"
              icon="del"
              :width="14"
              :height="14"
              style="margin-left: 8px"
              @click="onDeleteOption(index)"
            />
          </div>
        </div>
      </div>
    </SettingItem>

    <SettingItem title="展示设置">
      <div class="row">
        展示最近<el-input-number
          style="width: 60px; margin: 0 5px"
          :min="1"
          :step="1"
          :max="50"
          :precision="0"
          class="cms-el-input-number-x"
          v-model="num"
          controls-position="right"
        />条
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted, watch, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import SettingItem from '@/components/SettingItem/SettingItem.vue'
import ElSelect from '@/components/ElSelect/ElSelect'
import ElOption from '@/components/ElSelect/ElOption'
import Icon from '@/components/Icon/Icon'
import CsTree from '@/components/CsTree/CsTree'
import { injectModel } from '@/libs/Provider/Provider'
import { Trace } from '../Models/Trace'
import { cloneDeep, get, set } from 'lodash'

const traceModel = injectModel<Trace>('trace')
const emit = defineEmits(['update'])
interface FieldType {
  key?: string
  name?: string
  width?: number
  isBusinessField?: boolean
}
const props = withDefaults(
  defineProps<{
    node?: any
    isFilter?: boolean
    num?: number
    dataConfig?: Record<string, any>
  }>(),
  {
    num: 3,
    isFilter: true,
  }
)
const baseData = [{ width: 200 }, { width: 200 }, { width: 200 }]
const columns = ref<any>([])
const workSectionTree = ref<any[]>([])
const productList = ref<any[]>([])
const fieldKeys = ref<any[]>([])
const dataConfig = ref<Record<string, any>>(props.dataConfig || {})
let dropR: any

const fieldKey = computed(() => {
  const { productId, workSectionId } = dataConfig.value
  return `${productId}#${workSectionId}`
})

const defaultColumns = computed(() => {
  return get(dataConfig.value, 'default', cloneDeep(baseData))
})

const fields = ref<FieldType[]>(
  dataConfig.value[fieldKey.value] || defaultColumns.value
)

/**
 * 是否显示筛选
 */
const isCurrentFilter = computed<boolean>({
  get() {
    return props.isFilter
  },
  set(v) {
    emit('update', { isFilter: v })
  },
})
/**
 * 展示最近几条
 */
const num = computed<number>({
  get() {
    return props.num
  },
  set(v) {
    emit('update', { num: v })
  },
})

const updateDataConfig = () => {
  emit('update', { dataConfig: dataConfig.value })
}

const updateFields = () => {
  getLayoutColumns()
}

/**
 * 删除
 * @param index
 */
const onDeleteOption = (index: number) => {
  // 删除fields中指定的数据
  fields.value.splice(index, 1)
}
/**
 * 添加列
 */
const onAddOption = () => {
  fields.value.push({ width: 200 })
}

/**
 * 工序切换
 */
const onSectionChange = () => {
  getLayoutColumns()
  updateDataConfig()
}

const getProductModel = (id: string) => {
  return productList.value.find((item) => item.id === id)?.model
}
/**
 * 产品型号切换
 * @param id
 */
const onProductChange = (id: string) => {
  dataConfig.value.workSectionId = ''
  if (dataConfig.value.productId) {
    dataConfig.value.productModel = getProductModel(dataConfig.value.productId)
    updateDataConfig()
    updateFields()
    getWorkSectionTree(id)
  }
}
/**
 * 获取工序树
 * @param id
 */
const getWorkSectionTree = async (id: string) => {
  workSectionTree.value = await traceModel.getSectionList(id)
  // const workSectionId = dataConfig.value.workSectionId
  // dataConfig.value.workSectionId =
  //   workSectionId || workSectionTree.value[0]?.children[0]?.headerId
  // updateDataConfig()
}

const onFieldChange = (field: FieldType) => {
  field.name = columns.value.find((item: any) => item.key === field.key)?.name
}

/**
 * 字段配置
 */
const getLayoutColumns = async () => {
  if (!dataConfig.value.workSectionId) return
  const data = {
    productId: dataConfig.value.productId,
    tableId: dataConfig.value.workSectionId,
  }
  const currentFields: FieldType[] =
    dataConfig.value[`${data.productId}#${data.tableId}`]
  const layoutData: [] = await traceModel.getTableLayout(data)
  const baseFieldData = layoutData.filter((column: any, index) => {
    // 需要判断数据字段
    return column.isBusinessField
  })
  if (currentFields) {
    fields.value = currentFields
  } else {
    fields.value = baseFieldData.map((field: FieldType) => {
      return {
        name: field.name,
        key: field.key,
        width: field.width,
        isBusinessField: field.isBusinessField,
      }
    })
  }
  if (!fields.value.length) {
    fields.value = cloneDeep(baseData)
  }
  columns.value = layoutData
}

/**
 * 初始化数据
 */
const initData = async () => {
  sortableInit()
  const productId = dataConfig.value.productId
  const productModel = dataConfig.value.productModel

  productList.value = await traceModel.getProductList()
  if (productId) {
    getWorkSectionTree(productId)
  }
  if (productId && dataConfig.value.workSectionId) {
    getLayoutColumns()
  }
}

const sortableInit = () => {
  const moveDom = document.querySelector(
    `.production-tracking .tracking-data`
  ) as HTMLElement
  if (moveDom && Sortable) {
    dropR = new Sortable(moveDom, {
      handle: '.row-move',
      chosenClass: 'sortable-chosen',
      swapThreshold: 1,
      animation: 150,
      filter: '.disabled',
      onEnd: (sortableEvent: any) => {
        const newIndex = sortableEvent.newIndex as number
        const oldIndex = sortableEvent.oldIndex as number
        const data = [...fields.value]

        const currRow = data.splice(oldIndex, 1)[0]
        data.splice(newIndex, 0, currRow)
        fields.value = []
        nextTick(async () => {
          fields.value = data
        })
      },
    })
  }
}

onMounted(initData)

onUnmounted(() => {
  dropR?.destroy()
})

watch(
  fields,
  () => {
    fieldKeys.value = []
    fields.value.forEach((field) => {
      fieldKeys.value.push(field.key)
    })
    const { productId, workSectionId } = dataConfig.value
    if (productId && workSectionId) {
      set(dataConfig.value, `${productId}#${workSectionId}`, fields.value)
    } else {
      set(dataConfig.value, 'default', fields.value)
    }
    updateDataConfig()
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss" scoped>
.production-tracking {
  .row {
    > span {
      display: flex;
      width: 80px;
      font-size: 12px;
    }
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 5px;
  }
  .row-move {
    cursor: move;
    margin-right: 5px;
  }
  .data-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;
    color: #949494;
    font-size: 12px;
    .data-icon-size {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #949494;
      margin-left: 15px;
      .icon {
        margin-left: 2px;
        font-size: 14px;
      }
    }
  }
  .cs-select-x-box_http {
    box-shadow: none;
    height: 28px;
    line-height: 28px;
    padding: 0 12px 0 8px !important;
    font-size: 12px;
    border-radius: 4px;
    color: var(--cms-text-el-input-color);
    border: 1px solid var(--cms-color-bg-4);
    background-color: var(--cms-color-bg-3);
    background-color: #141414;
    outline: none;
    box-sizing: border-box;
    &:hover {
      border: 1px solid var(--cms-color-bg-4);
      border-bottom: 1px solid var(--cms-color-primary-1);
      box-shadow: none !important;
    }
    .cs-select-x-box_http {
      ::deep(.el-input__inner) {
        padding-right: 24px !important;
      }
    }
  }
}
</style>
<style lang="scss">
.production-tracking {
  .tracking-data {
    width: 100%;
    min-height: 200px;
    padding: 10px;
    background: #191a1a;
    border-radius: 3px;
    max-height: 300px;
    overflow: auto;
    .row-select {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .tracking-select {
      width: 100px;
      margin-right: 10px;
      height: 22px;
      font-size: 12px;
      .cs-select__wrapper {
        width: 100%;
        box-shadow: none;
        padding: 0;
        font-size: 12px;
        outline: none;
        color: #19dc8e;
        background-color: #2b5d53;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid var(--cms-color-bg-4);
        padding-right: 5px;
        min-height: 18px;
        line-height: 18px;

        .cs-select__selected-item {
          color: #19dc8e;
          padding: 0 5px;
          margin-top: -2px;
        }
        .cs-icon {
          margin-top: -2px;
          > svg {
            color: #19dc8e;
          }
        }
      }
    }
  }
}
</style>
