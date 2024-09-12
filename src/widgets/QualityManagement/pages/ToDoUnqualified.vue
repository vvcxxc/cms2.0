<template>
  <div class="InspectionRecords">
    <div class="InspectionRecords-search">
      <div class="InspectionRecords-search-content">
        <div class="search-content-left">
          <TableFilter
            text="添加"
            :tableRef="undefined"
            @data="changeData"
            :columns="columnsFilter"
          >
            <IconButton icon="f">产品型号</IconButton>
          </TableFilter>
          <div class="export-btn" @click="openProductJudgmentPop">
            {{ _t('判定') }}
          </div>
          <div
            class="export-btn"
            @click="
              () => {
                if (!isHasPermission('ToDoUnqualified-configuration')) return
                dataObj.reasonConfigurationPopShow = true
              }
            "
          >
            {{ _t('配置') }}
          </div>
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
        @rowClick="rowClickFn"
        :dataSource="dataList"
        :isHidePagination="false"
        v-model:total="dataObj.total"
        @page="getJudgmentListFn"
        :pageSize="50"
        :columns="[
          {
            field: 'seq',
            title: '序号',
            type: 'seq',
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
            field: 'workSectionName',
            title: '不良工序',
          },
          {
            field: 'unqualifiedReason',
            title: '不良原因',
          },
          {
            field: 'finishTime',
            title: '最后记录时间',
          },
        ]"
      >
        <template #workSectionName="{ row }">
          <div class="process-item">
            {{ row.workSectionName }}
          </div>
        </template>
        <template #finishTime="{ row }">
          {{ dayjs(row.finishTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </BaseTable>
    </div>
    <ProductJudgmentPop
      :visible="dataObj.productJudgmentPopShow"
      @callback="productJudgmentPopCallback"
      :selectItem="dataObj.productJudgmentPopItem"
    />
    <ReasonConfigurationPop
      :visible="dataObj.reasonConfigurationPopShow"
      @callback="reasonConfigurationPopCallback"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent, reactive, computed, watch } from 'vue'
import sdk from 'sdk'
const { models, userInfo } = sdk
const { Language } = models
const { _t } = Language
import MyPages from '@/components/MyPages/index.vue'
import ProductJudgmentPop from '../dialogs/ProductJudgmentPop.vue'
import ReasonConfigurationPop from '../dialogs/ReasonConfigurationPop.vue'
import {
  getModelOptionsNew,
  getUnqualifiedlist,
  getproductList,
} from '../api/index'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
import TableFilter from '@/components/TableFilter/TableFilter'
import { createInjector } from '../hooks/use-permission'

export default defineComponent({
  name: 'InspectionRecords',
  components: {
    MyPages,
    ProductJudgmentPop,
    ReasonConfigurationPop,
    Search,
    BaseTable,
    IconButton,
    TableFilter,
  },
  setup() {
    const { isHasPermission, curTab } = createInjector()
    watch(curTab, async (val: any) => {
      if (val == 'ToDoUnqualified') {
        dataObj.From = dayjs().add(-6, 'day').format('YYYY-MM-DD 00:00:00')
        dataObj.To = dayjs().add(0, 'day').format('YYYY-MM-DD 23:59:59')
        dataObj.judgmentPersonnel = (userInfo.user as any)?.name || ''

        await getproductListFn()
        await getJudgmentListFn(1)
      }
    })
    const { local } = Language.useElementPlusI18n()
    const dataObj = reactive({
      productJudgmentPopShow: false,
      reasonConfigurationPopShow: false,
      total: 0,
      ProductModel: '',
      codeType: _t('产品码'),
      OrderNumber: '',
      From: dayjs().add(-6, 'day').format('YYYY-MM-DD 00:00:00'),
      To: dayjs().add(0, 'day').format('YYYY-MM-DD 23:59:59'),
      curIdx: NaN,
      productJudgmentPopItem: {} as any,
      judgmentPersonnel: '',
    })

    const openProductJudgmentPop = () => {
      if (!isHasPermission('ToDoUnqualified-judgment')) return
      dataObj.productJudgmentPopItem = dataList.value[dataObj.curIdx] || {}
      const productModel = dataObj.productJudgmentPopItem.productModel
      dataObj.productJudgmentPopItem.productId = productList.value.find(
        (e: any) => e.model === productModel
      )?.id
      dataObj.productJudgmentPopItem.judgmentPersonnel =
        dataObj.judgmentPersonnel
      dataObj.productJudgmentPopShow = true
    }

    const productJudgmentPopCallback = (state: string, str?: string) => {
      dataObj.productJudgmentPopShow = false

      if (state == 'confirm') {
        getJudgmentListFn(1)
      }
    }

    const reasonConfigurationPopCallback = (state: string, str?: string) => {
      dataObj.reasonConfigurationPopShow = false
    }
    const changeData = (data: any) => {
      dataObj.ProductModel = data.ProductModel || ''
      getJudgmentListFn(1)
    }
    const dataList = ref<any[]>([])
    const getJudgmentListFn = (pageindex: number | string) => {
      return getUnqualifiedlist({
        SerialNumber:
          dataObj.codeType == _t('产品码') ? dataObj.OrderNumber : '' || '',
        BeginDate: getDate(dataObj.From),
        EndDate: getDate(dataObj.To),
        OrderCode: dataObj.codeType == _t('工单号') ? dataObj.OrderNumber : '',
        ProductModel:
          dataObj.ProductModel === '全部' ? '' : dataObj.ProductModel || '',
        SkipCount: 50 * (Number(pageindex) - 1),
        MaxResultCount: 50,
      }).then((res: any) => {
        dataList.value = res.items
        dataObj.curIdx = NaN
        dataObj.total = res.totalCount
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

      if (dayjs(dataObj.To).diff(dataObj.From, 'day') > 90) {
        ElMessage.warning('时间范围最大跨度为90天')
        return
      }
      getJudgmentListFn(1)
    }

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
        console.log('res333', res)
        productList.value = [
          {
            model: '全部',
            name: '全部',
            value: '全部',
            description: '全部',
          },
          ...res.items,
        ]
        if (productList.value.length) {
          dataObj.ProductModel = productList.value[0].model
        } else {
          dataObj.ProductModel = ''
        }
      })
    }
    const columnsFilter = ref<any[]>([
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
    const getDate = (val: string | number) => {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }

    const tableRowClassName = ({ row, rowIndex }: any) => {
      row.index = rowIndex
    }
    const rowClickFn = (row: any) => {
      dataObj.curIdx = row.rowIndex
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
      dataObj.From = dayjs().add(-6, 'day').format('YYYY-MM-DD 00:00:00')
      dataObj.To = dayjs().add(0, 'day').format('YYYY-MM-DD 23:59:59')
      dataObj.judgmentPersonnel = (userInfo.user as any)?.name || ''

      await getproductListFn()
      await getJudgmentListFn(1)
    })
    return {
      local,
      dayjs,
      _t,
      getDate,
      changeData,
      checkDate,
      getJudgmentListFn,
      dataList,
      dataObj,
      productJudgmentPopCallback,
      reasonConfigurationPopCallback,
      productList,
      columnsFilter,
      getproductListFn,
      tableRowClassName,
      rowClickFn,
      openProductJudgmentPop,
      isHasPermission,
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
  --el-color-primary: #5a84ff;

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

    .process-item {
      width: fit-content;
      height: 30px;
      border-radius: 15px;
      padding: 0 12px 0 27px;
      display: flex;
      align-items: center;
      background: #f1f0f7;
      border-radius: 29px;
      color: #907fec;
      position: relative;
    }

    .process-item::before {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background: #907fec;
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translate(0, -50%);
    }
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
