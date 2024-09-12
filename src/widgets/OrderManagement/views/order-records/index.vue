<template>
  <div class="container">
    <div class="head">
      <div class="head-left">
        <el-date-picker
          v-model="timeValue"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[
            new Date(2000, 1, 1, 0, 0, 0),
            new Date(2000, 2, 1, 23, 59, 59),
          ]"
          @change="initTableData"
          class="fix-input-style fix-datetime-picker"
          popper-class="light-datetime-picker"
          :style="{ marginRight: '5px' }"
        />
        <IconButton icon="export" :onClick="onExport"> 导出 </IconButton>
      </div>
      <div class="head-right">
        <Search
          v-model="searchValue"
          @Confirm="initTableData"
          :style="{ marginLeft: '5px' }"
        />
      </div>
    </div>
    <!-- -->
    <!-- url="/api/v1/ordermanagement/order"
    :params="{
      Filter: '',
      StartTime: head(backtrackingCondition.timeValue),
      FinishTime: last(backtrackingCondition.timeValue),
      Status: FIXED_STATUS, // 固定传5 为工单记录->4
      Sorting: '',
    }" -->
    <BaseTable
      v-model:dataSource="tableData"
      v-model:total="paginationConfig.total"
      @page="onPage"
      :pageSize="paginationConfig.pageSize"
      id="id_key"
      :isSeq="true"
      :columns="tableHead"
    >
      <template #formulaName="{ row }">
        {{ row.formula.name }}
      </template>

      <template #productModel="{ row }">
        {{ row.product.model }}
      </template>

      <template #statusDescription="{ row }">
        {{ row.status.description }}
      </template>
    </BaseTable>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onActivated,
  onMounted,
  watch,
} from 'vue'
import { head, last, get, cloneDeep } from 'lodash'
import dayjs from 'dayjs'
import sdk from 'sdk'
const { models } = sdk
const { Language } = models
const { _t } = Language
import api from '../../api/product-setting'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { IProductTableItem } from '../../api/product'
import Pagination from '../../components/pagination/index.vue'
import IconButton from '@/components/IconButton/IconButton'
import Search from '@/components/Search/Search'
import { createInjector } from '../../hooks/use-permission'

const FIXED_STATUS = '4'
import BaseTable from '@/components/Table/Table'

export default defineComponent({
  name: 'OrderRecords',
  components: {
    Pagination,
    BaseTable,
    IconButton,
    Search,
  },
  setup(props) {
    const { curTab } = createInjector()
    watch(curTab, (val: any) => {
      if (val == 'OrderRecords') {
        init()
      }
    })

    const searchValue = ref('')
    const timeValue = ref([
      dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD 00:00:00'),
      dayjs().startOf('day').format('YYYY-MM-DD 23:59:59'),
    ])
    const MaxResultCount = 20
    // 保留initTableData 请求时的参数
    const backtrackingCondition = ref({
      timeValue: [],
      SkipCount: '',
      MaxResultCount,
    })
    const tableData = ref<IProductTableItem[]>([])
    const tableSelectList = ref<IProductTableItem[]>([])
    const tableHead = ref([
      {
        field: 'seq',
        title: '序号',
        type: 'seq',
      },
      {
        field: 'code',
        title: '工单号',
      },
      {
        field: 'source',
        title: '工单来源',
      },
      {
        field: 'planStartTime',
        title: '计划开始时间',
      },
      {
        field: 'planFinishTime',
        title: '计划结束时间',
      },
      {
        field: 'productModel',
        title: '产品型号',
      },
      {
        field: 'formulaName',
        title: '工艺配方',
      },
      {
        field: 'planQty',
        title: '计划数量',
      },
      {
        field: 'produceQty',
        title: '投产数量',
      },
      {
        field: 'qualifiedQty',
        title: '合格数',
      },
      {
        field: 'shift',
        title: '班次',
      },
      {
        field: 'startTime',
        title: '实际开始时间',
      },
      {
        field: 'finishTime',
        title: '实际结束时间',
      },
      {
        field: 'statusDescription',
        title: '工单状态',
      },
      {
        field: 'finishReason',
        title: '订单结束原因',
      },
    ])
    // 分页配置
    const paginationConfig = reactive<{
      pageSize: number
      currentPage: number
      total: number
    }>({
      pageSize: MaxResultCount, // X条/页
      currentPage: 1, // 当前第X页
      total: 0, // 总共X页
    })

    const handleSelectionChange = (val: IProductTableItem[]) => {
      tableSelectList.value = val
    }

    const onExport = async () => {
      // if (!isHasPermission('OrderRecords-actions-export')) {
      //   return
      // }

      const StartTime =
        head(backtrackingCondition.value.timeValue) || timeValue.value[0]
      const FinishTime =
        last(backtrackingCondition.value.timeValue) || timeValue.value[1]
      const params = {
        Filter: '',
        StartTime,
        FinishTime,
        Status: FIXED_STATUS, // 固定传5 为工单记录->4
        Sorting: '',
        SkipCount: backtrackingCondition.value.SkipCount,
        MaxResultCount: backtrackingCondition.value.MaxResultCount,
      }

      const result = await api.exportOrder(params)
      console.log(result, 'result >>>')

      downloadFile(
        result,
        `工单记录${
          '' +
          new Date().getFullYear() +
          Number(new Date().getMonth() + 1) +
          new Date().getDate() +
          new Date().getTime()
        }.xlsx`
      )
    }

    const onPage = async (current: number) => {
      paginationConfig.currentPage = current

      const StartTime = head(backtrackingCondition.value.timeValue)
      const FinishTime = last(backtrackingCondition.value.timeValue)
      const params = {
        Filter: '',
        StartTime,
        FinishTime,
        Status: FIXED_STATUS, // 固定传5 为工单记录->4
        Sorting: '',
        SkipCount: (current - 1) * paginationConfig.pageSize,
        MaxResultCount: backtrackingCondition.value.MaxResultCount,
      }

      const result = await api.getTable(params)
      tableData.value = get(result, 'items', [])

      paginationConfig.total = get(result, 'totalCount', 0)
    }
    async function initTableData() {
      const StartTime = head(timeValue.value)
      const FinishTime = last(timeValue.value)

      const params = {
        Filter: searchValue.value,
        StartTime,
        FinishTime,
        Status: FIXED_STATUS, // 固定传5 为工单记录->4
        Sorting: '',
        SkipCount:
          (paginationConfig.currentPage - 1) * paginationConfig.pageSize,
        MaxResultCount: paginationConfig.pageSize + '',
      }
      // console.log(params, paginationConfig.currentPage, current, 'params')

      const result = await api.getTable(params)
      tableData.value = get(result, 'items', [])
      paginationConfig.total = get(result, 'totalCount', 0)

      backtrackingCondition.value = {
        // @ts-ignore
        timeValue: cloneDeep(timeValue.value),
        SkipCount:
          (paginationConfig.currentPage - 1) * paginationConfig.pageSize + '',
        MaxResultCount: paginationConfig.pageSize + '',
      }
    }
    function init() {
      initTableData()
    }

    // @ts-ignore
    function downloadFile(file, fileName) {
      const blob = new Blob([file])
      // 兼容不同浏览器的URL对象
      // const url:any = window.URL || window.webkitURL || window.moxURL
      const url = window.URL || window.webkitURL
      // 创建下载链接
      const downloadHref = url.createObjectURL(blob)
      // 创建a标签并为其添加属性
      let downloadLink = document.createElement('a')
      downloadLink.href = downloadHref
      downloadLink.download = fileName
      // 触发点击事件执行下载
      downloadLink.click()
      // @ts-ignore
      window.URL.revokeObjectURL(url)
    }

    init()
    return {
      timeValue,
      tableHead,
      tableData,
      paginationConfig,
      searchValue,
      FIXED_STATUS,
      backtrackingCondition,
      initTableData,
      onExport,
      handleSelectionChange,
      onPage,
      head,
      last,
    }
  },
})
</script>

<style lang="scss" scoped>
@import url('../../styles/common.scss');
@import '../../styles/datePicker.scss';

.container {
  height: calc(100% - 80px);
}

.head {
  background-color: #f3f3f3;
  padding: 8px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-left {
    display: flex;
    align-items: center;
  }

  &-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  :deep(.cs-input__wrapper) {
    height: 32px;
  }
}

.mt-12 {
  margin-top: 12px;
}
</style>

<style lang="scss" scoped>
@import url('../../styles/common.scss');
</style>
