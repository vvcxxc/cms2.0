import { computed, defineComponent, Fragment, ref } from 'vue'
import styles from './Curve.module.scss'

import DialogPreView from '@/components/DialogPreView/DialogPreView'
import Chart from '@/components/DialogPreView/Chart'
export default defineComponent({
  name: '曲线',
  props: {
    traceCurves: {
      type: Array,
      default: () => [],
    },
    picList: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const arr = new Array(10).fill(1).map((item, index) => index % 2 === 0)
    const visible = ref(false)
    const isChart = ref(false)
    const onClick = (chart: boolean) => {
      isChart.value = chart
      visible.value = true
    }
    const picList = ref<string[]>([])
    const chartOptions = ref<any>()

    const chartList = computed(() => {
      return props.traceCurves.map((item: any) => {
        const option = {
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            name: '位移(mm)',
            data: item.xyData.xData,
          },
          grid: {
            left: '20%',
            bottom: 35,
            top: 50,
            right:'30%'
          },
          legend: {
            data:
              item.xyData?.yData?.map((item: any) => {
                return item.type
              }) ?? [],
          },
          yAxis: {
            type: 'value',
            name: '压力(N)',
          },
          series:
            item.xyData?.yData?.map((item: any) => {
              return {
                data: item.yData,
                name: item.type,
                type: 'line',
                connectNulls: true,
              }
            }) ?? [],
        }

        return {
          name: item.name,
          option,
        }
      })
    })

    const onPreview = (chart: boolean, data: any) => {
      isChart.value = chart
      console.log(chartOptions.value, '--dd')

      if (chart) {
        chartOptions.value = {
          ...data,
          grid: null
        }
      } else {
        picList.value = [data]
      }

      visible.value = true
    }
    return () => (
      <Fragment>
        <div class={styles.curveWrap}>
          {chartList.value?.map((item) => {
            return (
              <div class={styles.curveItem}>
                <div
                  style="height: 210px"
                  class={styles.box}
                  onClick={() => onPreview(true, item.option)}
                >
                  <Chart chartOptions={item.option} />
                </div>
                <div class={styles.picName}>{item.name}</div>
              </div>
            )
          })}

          {props.picList?.map((item: any) => {
            return (
              <div class={styles.curveItem}>
                <div
                  style="height: 210px"
                  class={styles.box}
                  onClick={() => onPreview(false, item.value)}
                >
                  <img src={item.value} class={styles.pic} />
                </div>
                <div class={styles.picName}>{item.name}</div>
              </div>
            )
          })}
        </div>
        <DialogPreView
          v-model={visible.value}
          isChart={isChart.value}
          chartOptions={chartOptions.value}
          picList={picList.value}
        />
      </Fragment>
    )
  },
})
