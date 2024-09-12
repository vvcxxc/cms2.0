<template>
  <div class="InspectionRecords">
    <div class="InspectionRecords-search">
      <div class="InspectionRecords-search-content">
        <div class="search-content-left">
          <TableFilter
            :tableRef="undefined"
            :columns="columnsFilter"
            @data="changeData"
          >
            <IconButton icon="f">筛选</IconButton>
          </TableFilter>

          <IconButton icon="export" @click="exportJudgmentFn">{{
            _t('导出')
          }}</IconButton>
        </div>
        <div class="search-content-right">
          <div>{{ _t('时间范围：') }}</div>
          <el-date-picker
            type="datetime"
            style="width: 198px"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="dataObj.From"
            popper-class="light-datetime-picker"
            class="light-datetime-picker"
            @change="checkDate"
            :clearable="false"
          >
          </el-date-picker>
          <div class="search-key">-</div>
          <el-date-picker
            type="datetime"
            style="width: 198px"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="dataObj.To"
            popper-class="light-datetime-picker"
            class="light-datetime-picker"
            @change="checkDate"
            :clearable="false"
          ></el-date-picker>

          <el-select
            class="light-element-ui"
            style="width: 120px"
            v-model="dataObj.codeType"
            :teleported="false"
            @change="getJudgmentListFn(1)"
          >
            <el-option :label="_t('产品码')" :value="_t('产品码')"></el-option>
            <el-option :label="_t('工单号')" :value="_t('工单号')"></el-option>
          </el-select>

          <!-- <el-input style="width: 256px" :placeholder="_t('请输入') + _t(dataObj.codeType)" v-model="dataObj.OrderNumber" />
          <div class="search-btn" @click="getJudgmentListFn(1)">查询</div>
        -->
          <Search
            v-model="dataObj.OrderNumber"
            @Confirm="getJudgmentListFn(1)"
            :placeholder="_t('请输入') + _t(dataObj.codeType)"
            :style="{ marginLeft: '5px' }"
          />
        </div>
      </div>
    </div>
    <div class="page-warp">
      <BaseTable
        v-model:dataSource="dataList"
        v-model:total="paginationConfig.total"
        :isHidePagination="false"
        @page="getJudgmentListFn"
        :pageSize="paginationConfig.pageSize"
        :isSeq="true"
        :columns="tableHead"
      >
        <template #isQualified="{ row }">
          <span v-if="row.judgmentResult == 3">——</span>
          <div style="color: green" v-else-if="row.isQualified">OK</div>
          <div style="color: red" v-else>NG</div>
        </template>
        <template #judgmentSectionsDisplay="{ row }">
          <span v-if="row.judgmentResult != 3">——</span>
          <span v-else>{{ row.judgmentSectionsDisplay }}</span>
        </template>
        <template #judgmentTime="{ row }">
          {{ dayjs(row.judgmentTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, reactive, computed, watch } from 'vue'
import sdk from 'sdk'
const { models } = sdk
const { Language } = models
const { _t } = Language
import MyPages from '@/components/MyPages/index.vue'
import DatePicker from '@/components/DatePicker/index.vue'
import {
  getJudgmentList,
  getproductList,
  getModelOptionsNew,
  getJudgmentresulttype,
  exportJudgment,
} from '../api/index'
import dayjs from 'dayjs'
import { download } from '../hooks/exports'
import { ElMessage } from 'element-plus'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import { createInjector } from '../hooks/use-permission'
import { head, last, get, cloneDeep } from 'lodash'

export default defineComponent({
  name: 'InspectionRecords',
  components: {
    MyPages,
    DatePicker,
    Search,
    BaseTable,
    IconButton,
    TableFilter,
  },
  setup() {
    const { isHasPermission, curTab } = createInjector()
    watch(curTab, async (val: any) => {
      if (val == 'JudgmentRecord') {
        dataObj.From = dayjs().format('YYYY-MM-DD 00:00:00')
        dataObj.To = dayjs().format('YYYY-MM-DD 23:59:59')
        await getproductListFn()
        await getjudgmentresulttypeFn()
        await getJudgmentListFn(1)
      }
    })
    const { local } = Language.useElementPlusI18n()
    const dataObj = reactive({
      ProductModel: '',
      codeType: _t('产品码'),
      OrderNumber: '',
      JudgmentResult: '',
      From: dayjs().add(-6, 'day').format('YYYY-MM-DD 00:00:00'),
      To: dayjs().add(0, 'day').format('YYYY-MM-DD 23:59:59'),
      total: 0,
    })

    const tableHead = ref([
      {
        field: 'seq',
        title: '序号',
      },
      {
        field: 'productModel',
        title: '产品型号',
      },
      {
        field: 'serialNumber',
        title: '产品码',
      },
      {
        field: 'orderCode',
        title: '工单号',
      },
      {
        field: 'judgmentResultDisplay',
        title: '判定结果',
      },
      {
        field: 'isQualified',
        title: '是否合格',
      },
      {
        field: 'unqualifiedReason',
        title: '不良原因',
      },
      {
        field: 'judgmentSectionsDisplay',
        title: '返修工序',
      },
      {
        field: 'judgmentPersonnel',
        title: '判定人员',
      },
      {
        field: 'judgmentTime',
        title: '判定时间',
      },
      {
        field: 'judgmentDetailsDisplay',
        title: '判定详情',
      },
      {
        field: 'remark',
        title: '处理说明',
      },
    ])
    // 分页配置
    const paginationConfig = reactive<{
      pageSize: number
      currentPage: number
      total: number
    }>({
      pageSize: 20, // X条/页
      currentPage: 1, // 当前第X页
      total: 0, // 总共X页
    })

    const JudgmentResult = ref<string>('')
    const ProductModel = ref<string>('')

    const productList = ref<any[]>([])
    const getproductListFn = () => {
      return getproductList({
        filter: '',
        hasFormula: true,
      }).then((res: any) => {
        res.items.forEach((item: any) => {
          item.model = item.model
          item.value = item.model
        })
        productList.value = [
          { description: '全部', name: '全部', value: '' },
          ...res.items,
        ]
        if (productList.value.length) {
          dataObj.ProductModel = productList.value[0].model
        } else {
          dataObj.ProductModel = ''
        }
      })
    }

    const judgmentresulttypeList = ref<any[]>([])
    const judgmentresulttypeMap = computed(() =>
      judgmentresulttypeList.value.reduce((p, c) => {
        p[c.id] = c.name
        return p
      }, {})
    )
    const getjudgmentresulttypeFn = () => {
      return getJudgmentresulttype().then((res: any) => {
        judgmentresulttypeList.value = [
          { description: '全部', label: '全部', value: '' },
          ...res.map((_: any) => ({
            ..._,
            description: _.name,
            label: _.name,
            value: _.id,
          })),
        ]
        if (judgmentresulttypeList.value.length) {
          dataObj.JudgmentResult = judgmentresulttypeList.value[0].id
        } else {
          dataObj.JudgmentResult = ''
        }
      })
    }
    const columnsFilter = ref<any[]>([
      {
        field: 'JudgmentResult',
        title: '判定结果',
        el: 'select',
        // 搜索时所用的字段
        prop: 'JudgmentResult',
        options: judgmentresulttypeList,
        placeholder: '请选择',
      },
      {
        field: 'ProductModel',
        title: '产品型号',
        el: 'select',
        // 搜索时所用的字段
        prop: 'ProductModel',
        options: productList,
        placeholder: '请选择',
      },
    ])
    const changeData = (data: any) => {
      console.log('data', data)
      dataObj.JudgmentResult = data.JudgmentResult || ''
      dataObj.ProductModel = data.ProductModel || ''
      getJudgmentListFn(1)
    }

    const dataList = ref<any[]>([])
    const getJudgmentListFn = (pageindex: number) => {
      return getJudgmentList({
        SerialNumber:
          (dataObj.codeType == _t('产品码') ? dataObj.OrderNumber : '') || '',
        JudgmentResult: dataObj.JudgmentResult || '',
        OrderCode:
          (dataObj.codeType == _t('工单号') ? dataObj.OrderNumber : '') || '',
        ProductModel:
          (dataObj.ProductModel === '全部' ? '' : dataObj.ProductModel) || '',
        BeginDate: getDate(dataObj.From),
        EndDate: getDate(dataObj.To),
        IsQualified: '',
        SkipCount: paginationConfig.pageSize * (Number(pageindex) - 1),
        MaxResultCount: paginationConfig.pageSize,
      }).then((res: any) => {
        paginationConfig.currentPage = pageindex
        dataList.value =
          res.items.map((item: any, seq: number) => ({
            ...item,
            seq: seq + 1,
          })) || []
        paginationConfig.total = res.totalCount
      })
    }
    const checkDate = () => {
      console.log(dayjs(dataObj.To).diff(dataObj.From, 'day'))
      if (
        dayjs(dataObj.To).format('YYYY-MM-DD 00:00:00') <
        dayjs(dataObj.From).format('YYYY-MM-DD 00:00:00')
      ) {
        ElMessage.warning('开始时间不能大于结束时间')
        return
      }

      if (dayjs(dataObj.To).diff(dataObj.From, 'day') > 60) {
        ElMessage.warning('时间范围最大跨度为60天')
        return
      }
      getJudgmentListFn(1)
    }

    const getDate = (val: string | number) => {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }

    const exportJudgmentFn = () => {
      if (!isHasPermission('JudgmentRecord-export')) return
      exportJudgment({
        SerialNumber:
          (dataObj.codeType == _t('产品码') ? dataObj.OrderNumber : '') || '',
        JudgmentResult: dataObj.JudgmentResult || '',
        OrderCode:
          (dataObj.codeType == _t('工单号') ? dataObj.OrderNumber : '') || '',
        ProductModel:
          (dataObj.ProductModel === '全部' ? '' : dataObj.ProductModel) || '',
        IsQualified: '',
        BeginDate: getDate(dataObj.From),
        EndDate: getDate(dataObj.To),
      }).then((res: any) => {
        download(res, '产品判定记录.xlsx')
      })
    }
    watch([() => dataObj.From, () => dataObj.To], () => {
      if (
        dayjs(dataObj.To).format('YYYY-MM-DD 00:00:00') <
        dayjs(dataObj.From).format('YYYY-MM-DD 00:00:00')
      ) {
        ElMessage.warning('开始时间不能大于结束时间')
      }
    })

    onMounted(async () => {
      dataObj.From = dayjs().format('YYYY-MM-DD 00:00:00')
      dataObj.To = dayjs().format('YYYY-MM-DD 23:59:59')
      await getproductListFn()
      await getjudgmentresulttypeFn()
      await getJudgmentListFn(1)
    })
    return {
      local,
      dayjs,
      _t,
      columnsFilter,
      dataObj,
      productList,
      checkDate,
      getDate,
      getJudgmentListFn,
      getproductListFn,
      dataList,
      judgmentresulttypeList,
      judgmentresulttypeMap,
      getjudgmentresulttypeFn,
      exportJudgmentFn,
      JudgmentResult,
      ProductModel,
      changeData,
      paginationConfig,
      head,
      last,
      get,
      cloneDeep,
      tableHead,
    }
  },
})
</script>
<style lang="scss" scoped>
.InspectionRecords {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;

  background: #ffffff;

  .InspectionRecords-search {
    padding: 0 0 6px;

    .InspectionRecords-search-content {
      height: 44px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f3f3f3;
      border-radius: 4px;
      box-sizing: border-box;

      .search-content-right {
        display: flex;
        align-items: center;
        justify-content: space-between;

        :deep(.cs-input__wrapper) {
          height: 32px;
        }

        div {
          margin: 0 5px;
          word-break: keep-all;
        }

        .search-btn {
          width: 60px;
          height: 26px;
          background: #8b9ca4;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin-left: 10px;
          cursor: pointer;
        }
      }

      .search-content-left {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .export-btn {
          color: #2f71ee;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }

  .page-warp {
    width: 100%;
    height: calc(100% - 128px);
  }

  .pages-content {
    width: 100%;
    height: 60px;
    background: #f1f1f1;
  }

  .searh,
  .btns {
    height: 30px;
    display: flex;
    line-height: 30px;
  }

  .searh {
    min-width: 220px;
    width: 20%;
  }

  .btns {
    width: 110px;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;

    .btns_svg_add {
      cursor: pointer;
      width: 21px;
      height: 21px;
      margin-top: 4px;
    }

    i {
      color: #7e7e7f;
      cursor: pointer;
      background-color: var(--module_background);
      font-size: 20px;
    }
  }
}
</style>
