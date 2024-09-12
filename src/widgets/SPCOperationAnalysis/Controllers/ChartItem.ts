import {
  ref,
  SetupContext,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  markRaw,
} from 'vue'
import sdk from 'sdk'
const { packs } = sdk
const { echarts } = packs
import { getLang } from '@/libs/Language/Language'
import { _t } from '../app'
import { Language } from '@/libs/Language/Language'
export const useChartItem = (props: any, ctx: SetupContext) => {
  const { local } = Language.useElementPlusI18n()
  const lang = window.app.current.project.current.language.lang
  const chartRef = ref()
  const tableRef = ref()
  const tableKey = ref(0)
  const myChart = ref<any>(null)
  const echartLang = ref<{
    key: string
    lang: any
  }>(getLang(lang))

  Language.useChange(async (lang: typeof Language) => {
    const langType = lang.lang
    echartLang.value = getLang(langType)
  })

  const drawLine = async () => {
    myChart.value?.dispose()
    myChart.value = null
    if (props.chartType == 'chart') {
      let chartDom: any = chartRef.value
      chartDom.removeAttribute('_echarts_instance_')
      const charts = await echarts
      charts.registerLocale(echartLang.value.key, echartLang.value.lang)
      myChart.value = markRaw(
        charts.init(chartDom, null, {
          locale: echartLang.value.key,
        })
      )
      myChart.value.setOption(props.options, true)
      myChart.value.resize()
      myChart.value.on('click', function (params: any) {
        if (props.item && props.item.belong == 'line') {
          ctx.emit('callback', params.name, params.dataIndex)
        }
      })
    }
    if (props.chartType == 'table') {
      tableKey.value = tableKey.value + 1
    }
  }

  watch(
    () => [props.options, props.title, props.isWorkStation],
    () => {
      nextTick(() => {
        drawLine()
      })
    },
    { deep: true }
  )

  onMounted(() => {
    drawLine()
  })
  onUnmounted(() => {
    myChart.value?.dispose()
  })
  return {
    chartRef,
    tableRef,
    tableKey,
    myChart,
    drawLine,
  }
}
