import { SetupContext, defineComponent, nextTick, onMounted, ref, shallowRef } from 'vue'

import sdk from 'sdk'
import isEmpty from 'lodash/isEmpty'
const { packs } = sdk
const { echarts } = packs
export default defineComponent({
  name: '图表',
  props: {
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { attrs, expose }: SetupContext) {
    const chartDomRef = ref()

    const myCharts = shallowRef()
    onMounted(async () => {
      await nextTick()
      if (isEmpty(props.chartOptions)) return
      myCharts.value = (await echarts).init(chartDomRef.value)
      myCharts.value.setOption(props.chartOptions)
    })


    const getChartInstance = () => {
      return myCharts.value
    }

    const setChartOptions = (options: any) => {
      if (myCharts.value) {
        myCharts.value.setOption(options)
      }
    }

    expose({
      getChartInstance,
      setChartOptions,
    })
    

    return () => <div style="height:100%;width:100%" ref={chartDomRef}></div>
  },
})
