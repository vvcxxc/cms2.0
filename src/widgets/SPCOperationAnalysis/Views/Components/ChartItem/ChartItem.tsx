import { defineComponent, SetupContext } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './ChartItem.module.scss'
import { _t, LanguageScopeKey } from '../../../app'
import { useChartItem } from '../../../Controllers/ChartItem'
export default defineComponent({
  name: '图表项',
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
  },
  setup(props, ctx: SetupContext) {
    const { chartRef, tableRef, tableKey } = useChartItem(props, ctx)
    return () => {
      return (
        <div class={styles.chartContent}>
          {props.chartType == 'chart' ? (
            <div class={styles.chart} ref={chartRef}></div>
          ) : (
            <BaseTable
              LanguageScopeKey={LanguageScopeKey}
              key={tableKey.value}
              ref={tableRef}
              dataSource={props.tableData || []}
              columns={props.columns || []}
              isHidePagination={true}
            />
          )}
        </div>
      )
    }
  },
})
