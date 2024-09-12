<template>
  <div class="dialog-container">
    <Dialog v-model="dialogVisible" :title="title" width="689px">
      <div class="dialog-content">
        <HeadTitle :title="'基础信息'" />
        <div class="form">
          <CustomFormItem
            v-for="item in form"
            :key="item.prop"
            v-model="item.value"
            :label="item.label"
            :component-name="item.componentName"
            label-width="64px"
            v-bind="{ ...item.attrProps }"
            disabled
          >
            <template v-if="item.componentName === 'el-select'">
              <el-option
                v-for="o in item.nodeOptions"
                :key="o.id"
                :label="o.model"
                :value="o.id"
              />
            </template>
          </CustomFormItem>
        </div>

        <HeadTitle :title="'批次物料清单'" style="margin-top: 24px" />
        <div class="head">
          <div class="barcode">
            <span>条码信息: </span>
            <el-input
              v-model="barCode"
              :ref="inputRef"
              @keyup.enter.native="onEnter"
              style="width: 240px"
            />
          </div>
          <div>上料进度：{{ schedule }}</div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          height="100%"
          border
          :header-cell-style="{ background: '#DBDFE7', color: '#35363B' }"
        >
          <el-table-column fixed type="index" width="55" label="序号" />
          <template v-for="item in tableHead" :key="item.prop">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              show-overflow-tooltip
            >
              <template v-slot="{ row }">
                <span>{{
                  item.formatter
                    ? item.formatter(row[item.prop])
                    : row[item.prop]
                }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="dialogVisible = false"
            class="baseCss"
            style="background: #efeded"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="onConfirm"
            class="baseCss"
            style="background: #5a84ff"
          >
            确定
          </el-button>
        </span>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import {
  PropType,
  defineComponent,
  computed,
  ref,
  onMounted,
  reactive,
} from 'vue'
import { useVModel } from '@vueuse/core'
import api from '../api/product-setting'
import type { IProductParamsRequest } from '../api/product'
import get from 'lodash/get'
import set from 'lodash/set'
import { ElMessage } from 'element-plus'
import { DIALOG_STATUS, DIALOG_STATUS_OPTIONS } from '../enum'
import CustomFormItem from '../components/customFormItem/index.vue'
import HeadTitle from '../components/head-title/index.vue'
import Dialog from '../../../components/Dialog/index.vue'

export default defineComponent({
  name: 'PrepareFormDialog',
  components: { Dialog, CustomFormItem, HeadTitle },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: DIALOG_STATUS.ADD,
    },
    dialogConfig: {
      type: Object as PropType<IProductParamsRequest>,
    },
  },

  setup(props, ctx) {
    const dialogVisible = useVModel(props)
    const dialogTableVisible = ref(false)
    const title = computed(() => '工单备料')
    const schedule = computed(() => {
      console.log(tableData.value, 'tableData.value >>>')

      const notActiveLen = tableData.value.filter(
        (item) => item.feedingStatus === 1
      ).length
      return `${notActiveLen} / ${tableData.value.length}`
    })

    const inputRef = ref()
    const barCode = ref('')

    const form = reactive([
      {
        label: '工单号:',
        prop: 'code',
        value: '',
        attrProps: { placeholder: '请输入' },
        componentName: 'el-input',
      },
      {
        label: '产品型号:',
        prop: 'productName',
        value: '',
        attrProps: { placeholder: '请输入' },
        nodeOptions: [] as { id: string; model: string }[],
        componentName: 'el-select',
      },
      {
        label: '工艺配方:',
        prop: 'formulaName',
        value: '',
        attrProps: { placeholder: '请输入', disabled: true },
        componentName: 'el-input',
      },
      {
        label: '计划数量:',
        prop: 'planQty',
        value: '',
        attrProps: { placeholder: '请输入' },
        componentName: 'el-input',
        formatter: (value: string) => {
          return Number(value)
        },
      },
      {
        label: '计划开始:',
        prop: 'planStartTime',
        value: '',
        attrProps: {
          placeholder: '请输入',
          type: 'datetime',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
        componentName: 'el-date-picker',
      },
      {
        label: '计划结束:',
        prop: 'planFinishTime',
        value: '',
        attrProps: {
          placeholder: '请输入',
          type: 'datetime',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
        },
        componentName: 'el-date-picker',
      },
    ])

    const tableData = ref([])
    const tableHead = ref([
      { prop: 'materialCode', label: '物料编号' },
      { prop: 'materialName', label: '物料名称' },
      { prop: 'workSectionName', label: '用料工序' },
      { prop: 'usedQty', label: '用量' },
      {
        prop: 'feedingStatus',
        label: '上料状态',
        formatter: (value: number) => {
          return value === 0 ? '未上料' : '已上料'
        },
      },
    ])

    function init() {
      getProductOptions()
      form.forEach((item) => {
        if (item.prop == 'productId') {
          // @ts-ignore
          item.value = props.dialogConfig.product.id
        } else if (item.prop == 'formulaId') {
          // @ts-ignore
          item.value = props.dialogConfig.formula.id
        } else {
          // @ts-ignore
          item.value = props.dialogConfig[item.prop]
        }
      })

      tableData.value = get(props.dialogConfig, 'tableData', [])
    }

    async function getProductOptions() {
      const result = await api.getModelOptions()

      const key = 'productId'
      const index = form.findIndex((item) => item.prop === key)
      set(form[index], 'nodeOptions', result)
      console.log(result, 'result')
    }

    init()

    const onEnter = async () => {
      await api.putMaterial(barCode.value)

      tableData.value.forEach((item, index) => {
        const targetCode = get(item, 'materialCode')
        if (targetCode === barCode.value) {
          set(tableData.value, `${index}.feedingStatus`, '1')
        }
      })

      barCode.value = ''
      inputRef.value.focus()
    }

    const onConfirm = async () => {
      const id = get(props, 'dialogConfig.id', '')
      await api.putPrepareActive(id)

      ElMessage.success('激活成功')
      ctx.emit('callback')
    }

    onMounted(() => {
      if (inputRef.value) {
        // @ts-ignore
        inputRef.value.focus()
      }
    })

    return {
      dialogVisible,
      dialogTableVisible,
      title,
      form,
      inputRef,
      barCode,
      schedule,
      tableData,
      tableHead,

      onEnter,
      onConfirm,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../styles/input.scss';

.dialog-content {
  overflow-y: scroll;
  overflow-x: hidden;
}

.form {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row-gap: 10px;
  margin-top: 20px;

  :deep(.content) {
    width: 70%;
  }
}

.baseCss {
  width: 98px;
  height: 26px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .barcode {
    display: flex;
    align-items: center;
    margin: 12px 0;

    span {
      flex-shrink: 0;
      margin-right: 8px;
    }

    :deep(.cs-input) {
      width: 240px;
    }
  }
}
</style>
<style lang="scss">
@import url('../styles/common.scss');
</style>
