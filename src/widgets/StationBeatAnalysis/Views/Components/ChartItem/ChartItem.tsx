import { defineComponent, SetupContext } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './ChartItem.module.scss'
import { _t, LanguageScopeKey } from '../../../app'
import { useChartItem } from '../../../Controllers/ChartItem'
import Pagination from '../pagination/index.vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: '图表项',
  components: {
    Pagination,
  },
  props: {
    isWorkStation: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: {},
    },
    title: {
      type: String,
      default: '',
    },
    chartType: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: {},
    },
    columns: {
      type: Object,
      default: [],
    },
    tableData: {
      type: Object,
      default: [],
    },
    tableUrl: {
      type: String,
      default: '',
    },
    dateTime: {
      type: String,
      default: '',
    },
    workSectionId: {
      type: String,
      default: '',
    },
    productModel: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx: SetupContext) {
    const { chartRef, tableRef, tableKey, dataSource } = useChartItem(
      props,
      ctx
    )
    return () => {
      return (
        <div class={styles.chartContent}>
          {props.chartType == 'chart' ? (
            <div class={styles.chart} ref={chartRef}></div>
          ) : (
            <div class={styles.table}>
              <BaseTable
                LanguageScopeKey={LanguageScopeKey}
                key={tableKey.value}
                ref={tableRef}
                params={{
                  dateTime: dayjs(props.dateTime).format('YYYY-MM-DD'),
                  workSectionId: props.workSectionId,
                  productModel: props.productModel,
                }}
                columns={props.columns || []}
                url={props.tableUrl}
                v-model:dataSource={dataSource.value}
              />
            </div>
          )}
        </div>
      )
    }
  },
})
