import { ref, SetupContext, reactive, watch, onMounted, onUnmounted } from 'vue'
import {
  GroupingOfProcessingResultsOption,
  DistributionAndMagnitudeOfChangesInWorkstationOutputOption,
  ProductionPerUnitTimeOption,
  ComparisonOfWorkstationProcessingCapabilitiesOption,
  AnalysisOfWorkstationDetails,
  FrequencyDistributionHistogram,
  movingRangeChartOption,
} from '../enum'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'
import {
  getSettings,
  getProductlineDetail,
  getProduct,
  getWorksectionBySegment,
  getWorkStationDetail,
} from '../Models/Service/Service'
import { _t } from '../app'
import { Language } from '@/libs/Language/Language'

export const useStationBeatAnalysis = (props: any, ctx: SetupContext) => {
  Language.useChange((lang: typeof Language) => {
    dataObj.isWorkStation = false
    getData()
  })

  const segmentList = ref<any[]>([])
  const workSectionList = ref<any[]>([])
  const prodList = ref<any[]>([])

  const dataObj: any = reactive({
    date: dayjs().format('YYYY-MM-DD'),
    subDate: dayjs().format('YYYY-MM-DD'),
    subProdModel: '',
    subWorkSectionId: '',
    average: 0,
    cl: 0,
    lcl: 0,
    max: 0,
    min: 0,
    range: 0,
    sampleSize: 0,
    ucl: 0,

    segmentType: '1',
    segmentId: '00000000-0000-0000-0000-000000000000',
    realTime: false,
    realTimeTimer: 0,
    isWorkStation: false,
    // isWorkStation: true,

    averageProductionRhythm: 0,
    dailyCompletionRate: 0,
    dailyProduction: 0,
    dayOnDay: 0,
    weekOverWeek: 0,
    productionPerUnitTime: 0,
    queryDate: '',

    chart1Option: cloneDeep(GroupingOfProcessingResultsOption),
    chart2Option: cloneDeep(
      DistributionAndMagnitudeOfChangesInWorkstationOutputOption
    ),
    chart3Option: cloneDeep(ProductionPerUnitTimeOption),
    chart4Option: cloneDeep(
      ComparisonOfWorkstationProcessingCapabilitiesOption
    ),
    chart5Option: cloneDeep(ProductionPerUnitTimeOption),
    chart6Option: cloneDeep(ProductionPerUnitTimeOption),
    //工位
    chart7Option: cloneDeep(AnalysisOfWorkstationDetails),
    //工位中间
    chart8Option: cloneDeep(movingRangeChartOption),
    chart9Option: cloneDeep(FrequencyDistributionHistogram),
    tablleData10: [],
    tablleData11: [],
  })
  const getData = () => {
    if (dataObj.isWorkStation) {
      return
    }
    getProductlineDetail({
      segmentId: dataObj.segmentId,
      realTime: dataObj.realTime,
      dateTime: dayjs(dataObj.date).format('YYYY-MM-DD'),
    }).then((res: any) => {
      dataObj.averageProductionRhythm = res.averageProductionRhythm
      dataObj.dailyCompletionRate = parseInt(
        String(res.dailyCompletionRate * 100)
      )
      dataObj.dailyProduction = res.dailyProduction
      dataObj.dayOnDay = res.dayOnDay
      dataObj.weekOverWeek = res.weekOverWeek
      dataObj.productionPerUnitTime = res.productionPerUnitTime
      dataObj.queryDate = res.queryDate
      //加工结果分组   processingResultGroupChart
      console.log(
        'GroupingOfProcessingResultsOption',
        JSON.stringify(GroupingOfProcessingResultsOption)
      )
      let _chart1Option = cloneDeep(GroupingOfProcessingResultsOption)
      _chart1Option.title.text = _t('工位产量分布及变化幅度')
      _chart1Option.legend.data = [
        _t('同比升降幅'),
        _t('环比升降幅'),
        _t('合格数量'),
        _t('不良数量'),
      ]
      _chart1Option.yAxis[0].name = _t('产量：pcs')
      _chart1Option.yAxis[1].name = _t('幅度：')
      _chart1Option.series[0].name = _t('同比升降幅')
      _chart1Option.series[1].name = _t('环比升降幅')
      _chart1Option.series[2].name = _t('合格数量')
      _chart1Option.series[3].name = _t('不良数量')
      _chart1Option.xAxis[0].data = res.processingResultGroupChart.xList || []
      _chart1Option.series[0].data =
        res.processingResultGroupChart.dataList
          .find((item: any) => item.name == '同比升降幅')
          ?.data.map((item: any) => (item * 100).toFixed(1)) || []
      _chart1Option.series[1].data =
        res.processingResultGroupChart.dataList
          .find((item: any) => item.name == '环比升降幅')
          ?.data.map((item: any) => (item * 100).toFixed(1)) || []
      _chart1Option.series[2].data =
        res.processingResultGroupChart.dataList.find(
          (item: any) => item.name == '合格数量'
        )?.data || []
      _chart1Option.series[3].data =
        res.processingResultGroupChart.dataList.find(
          (item: any) => item.name == '不良数量'
        )?.data || []
      console.log('_chart1Option', _chart1Option)
      dataObj.chart1Option = _chart1Option
      //班次分组   shiftGroupChart
      let _chart2Option = cloneDeep(
        DistributionAndMagnitudeOfChangesInWorkstationOutputOption
      )

      _chart2Option.title.text = _t('工位产量分布及变化幅度')
      _chart2Option.yAxis[0].name = _t('产量：pcs')
      _chart2Option.xAxis[0].data = res.shiftGroupChart.xList || []
      _chart2Option.legend.data = res.shiftGroupChart.dataList.map(
        (item: any) => item.name
      )
      const colorList = [
        '#F3983D',
        '#DD6596',
        '#3CC7BA',
        '#51ADFD',
        '#FDA9A5',
        '#F8D869',
        '#CC8F70',
        '#12B98F',
        '#1A92D6',
      ]
      _chart2Option.series = res.shiftGroupChart.dataList.map(
        (item: any, index: number) => ({
          name: item.name,
          type: 'bar',
          barMaxWidth: 30,
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
            position: 'insideTop',
            color: '#fff',
          },
          tooltip: {
            valueFormatter: function (value: string | number) {
              return value + ' pcs'
            },
          },
          itemStyle: {
            color: colorList[index % 9],
          },
          data: item.data,
        })
      )
      dataObj.chart2Option = _chart2Option
      //单位时间产量  productionPerUnitTimeChart
      let _chart3Option = cloneDeep(ProductionPerUnitTimeOption)
      _chart3Option.title.text = _t('工位加工能力对比')
      _chart3Option.legend.data = [_t('单位时间产量')]
      _chart3Option.yAxis[0].name = _t('单位时间产量：pcs/h')
      _chart3Option.series[0].markLine.data[0].name = _t('工位平均值')
      _chart3Option.xAxis[0].data = res.productionPerUnitTimeChart.xList || []
      _chart3Option.series[0].data =
        res.productionPerUnitTimeChart.dataList[0].data || []
      _chart3Option.series[0].name = _t('单位时间产量')
      _chart3Option.series[0].tooltip.valueFormatter = function (
        value: string | number
      ) {
        return value + ' pcs/h'
      }
      dataObj.chart3Option = _chart3Option
      //单位产品加工周期   productionProcessingCycleChart
      let _chart4Option = cloneDeep(
        ComparisonOfWorkstationProcessingCapabilitiesOption
      )

      _chart4Option.title.text = _t('工位加工能力对比')
      _chart4Option.legend.data = [_t('理论加工周期'), _t('实际加工周期')]
      _chart4Option.yAxis[0].name = _t('单位产品加工周期：s')
      _chart4Option.series[0].name = _t('理论加工周期')
      _chart4Option.series[1].name = _t('实际加工周期')

      _chart4Option.xAxis[0].data =
        res.productionProcessingCycleChart.xList || []

      _chart4Option.series[0].data =
        res.productionProcessingCycleChart.dataList.find(
          (item: any) => item.name == '理论加工周期'
        )?.data || []
      _chart4Option.series[1].data =
        res.productionProcessingCycleChart.dataList.find(
          (item: any) => item.name == '实际加工周期'
        )?.data || []

      dataObj.chart4Option = _chart4Option
      //单位产品等待时长  productionWaitingTimeChart
      let _chart5Option = cloneDeep(ProductionPerUnitTimeOption)
      _chart5Option.title.text = _t('工位在制品等待情况对比')
      _chart5Option.legend.data = [_t('单位产品等待时长')]
      _chart5Option.yAxis[0].name = _t('单位产品等待时长：s')
      _chart5Option.yAxis[0].axisLabel.formatter = '{value} s'

      _chart5Option.xAxis[0].data = res.productionWaitingTimeChart.xList || []
      _chart5Option.series[0].itemStyle = {
        color: '#3CC7BA',
      }
      _chart5Option.series[0].name = _t('单位产品等待时长')
      _chart5Option.series[0].tooltip.valueFormatter = function (
        value: string | number
      ) {
        return value + ' s'
      }

      _chart5Option.series[0].data =
        res.productionWaitingTimeChart.dataList[0].data || []
      dataObj.chart5Option = _chart5Option
      //待加工数量   processingQuantity
      let _chart6Option = cloneDeep(ProductionPerUnitTimeOption)
      _chart6Option.title.text = _t('工位在制品等待情况对比')
      _chart6Option.legend.data = [_t('待加工数量')]
      _chart6Option.yAxis[0].name = _t('待加工数量：pcs')
      _chart6Option.yAxis[0].axisLabel.formatter = '{value} pcs'
      _chart6Option.xAxis[0].data = res.processingQuantity.xList || []
      _chart6Option.series[0].data =
        res.processingQuantity.dataList[0].data || []
      _chart6Option.series[0].name = _t('待加工数量')

      _chart6Option.series[0].tooltip.valueFormatter = function (
        value: string | number
      ) {
        return value + ' pcs'
      }
      console.log('_chart6Option', _chart6Option)
      dataObj.chart6Option = _chart6Option
    })
  }
  const getSubData = (first?: boolean) => {
    console.log(first)
    if (first) {
      if (dataObj.date) {
        dataObj.subDate = dataObj.date
      } else {
        dataObj.subDate = dayjs().format('YYYY-MM-DD')
      }
    }

    getWorkStationDetail({
      dateTime: dayjs(dataObj.subDate).format('YYYY-MM-DD'),
      workSectionId: dataObj.subWorkSectionId,
      productModel: dataObj.subProdModel,
    }).then((res: any) => {
      //主图 productionQuantityChart
      dataObj.chart7Option.legend.data = [res.workSectionName]
      dataObj.chart7Option.series[0].name = res.workSectionName

      dataObj.chart7Option.xAxis[0].data =
        res.productionQuantityChart.xList || []
      dataObj.chart7Option.series[0].data =
        res.productionQuantityChart.dataList[0].data || []
      //产品加工周期分析 processCycleChart

      dataObj.average = res.processCycleChart.average
      dataObj.cl = res.processCycleChart.cl
      dataObj.lcl = res.processCycleChart.lcl
      dataObj.max = res.processCycleChart.max
      dataObj.min = res.processCycleChart.min
      dataObj.range = res.processCycleChart.range
      dataObj.sampleSize = res.processCycleChart.sampleSize
      dataObj.ucl = res.processCycleChart.ucl

      let _chart8Option: any = cloneDeep(movingRangeChartOption)

      _chart8Option.title.text = _t('移动极差控制图')
      _chart8Option.series[0].name = _t('移动极差MR')

      _chart8Option.xAxis[0].data = res.processCycleChart.xList || []
      _chart8Option.series[0].data =
        res.processCycleChart.dataList[0].data || []

      _chart8Option.series[0].markLine.data = [
        {
          yAxis: res.processCycleChart.ucl,
          name: 'UCL',
          lineStyle: {
            color: '#F59A23',
          },
        },
        {
          yAxis: res.processCycleChart.cl,
          name: 'CL',
          lineStyle: {
            color: '#FC4D4D',
          },
          label: {
            color: '#FC4D4D',
          },
        },
        {
          yAxis: res.processCycleChart.lcl,
          name: 'LCL',
          lineStyle: {
            color: '#3CC7BA',
          },
          label: {
            color: '#3CC7BA',
          },
        },
      ]

      let numList = [
        ...res.processCycleChart.dataList[0].data,
        res.processCycleChart.ucl,
        res.processCycleChart.cl,
        res.processCycleChart.lcl,
      ]

      _chart8Option.yAxis.max = Math.ceil(Math.max(...numList) + 1)
      _chart8Option.yAxis.min = Math.floor(Math.min(...numList) - 1)
      dataObj.chart8Option = _chart8Option

      //产品加工详情   processDetails
      dataObj.tablleData10 = res.processDetails || []
      //工位运行日志  runningLogs
      dataObj.tablleData11 = res.runningLogs || []
      //频数分布直方图  processCycleHistogram
      //显示用
      let _chart9Option = cloneDeep(FrequencyDistributionHistogram)
      _chart9Option.title.text = _t('频数分布直方图')
      _chart9Option.yAxis[0].name = _t('频数')
      _chart9Option.xAxis[1].data = res.processCycleHistogram.xList || []
      //真正的x轴
      _chart9Option.xAxis[0].data =
        res.processCycleHistogram.dataList[0].data || []

      _chart9Option.series[0].data =
        res.processCycleHistogram.dataList[0].data || []
      dataObj.chart9Option = _chart9Option
      //进入子级

      dataObj.isWorkStation = true
    })
  }
  const clickChart = (name: string, lindex: number) => {
    getWorksectionBySegment(
      dataObj.segmentId == '00000000-0000-0000-0000-000000000000'
        ? ''
        : dataObj.segmentId
    ).then((workSecRes: any) => {
      workSectionList.value = workSecRes.items || []
      if (workSectionList.value.length) {
        let _o = workSectionList.value.find((item: any) => item.name == name)
        if (_o && name) {
          dataObj.subWorkSectionId = _o.id
        } else {
          dataObj.subWorkSectionId = workSectionList.value[0].id
        }
      } else {
        dataObj.subWorkSectionId = '00000000-0000-0000-0000-000000000000'
      }
      getProduct().then((prodRes: any) => {
        prodList.value = prodRes.items || []
        // if (prodList.value.length) {
        //   dataObj.subProdModel = prodList.value[0].model
        // } else {
        dataObj.subProdModel = ''
        // }

        getSubData(true)
      })
    })
  }
  const back = () => {
    dataObj.isWorkStation = false
  }
  const getSettingFn = (fromMount?: boolean) => {
    if (dataObj.isWorkStation) {
      return
    }
    dataObj.date = dayjs().format('YYYY-MM-DD') //勾选实时模式重置当天
    getSettings('SCMS.AppSettings.ProductionLineStructure').then((res: any) => {
      let _type: string = (res.settings.length && res.settings[0]?.value) || ''
      dataObj.segmentType = _type
      if (_type == '1') {
        getSettings('SCMS.AppSettings.ProductionLineSegment').then(
          (res: any) => {
            let str = (res.settings.length && res.settings[0]?.value) || ''
            segmentList.value = str
              ? JSON.parse(str)
              : [{ id: '00000000-0000-0000-0000-000000000000', name: '-' }] //真走这就有问题了
            dataObj.segmentId = segmentList.value[0].id
            if (fromMount) {
              let _realTime = JSON.parse(
                sessionStorage.getItem('stationBeatAnalysisRealTime') || 'false'
              )
              if (_realTime) {
                setTimeout(() => {
                  dataObj.realTime = _realTime
                })
              } else {
                getData()
              }
            } else {
              getData()
            }
          }
        )
      } else {
        dataObj.segmentId = '00000000-0000-0000-0000-000000000000'
        segmentList.value = [
          { id: '00000000-0000-0000-0000-000000000000', name: '-' },
        ]
        getData()
      }
    })
  }
  watch(
    () => dataObj.realTime,
    (m) => {
      sessionStorage.setItem('stationBeatAnalysisRealTime', JSON.stringify(m))
      if (m) {
        dataObj.date = dayjs().format('YYYY-MM-DD')
        getData()
        dataObj.realTimeTimer = setInterval(() => {
          getData()
        }, 60000)
      } else {
        clearInterval(dataObj.realTimeTimer)
      }
    }
    // { immediate: true }//立即执行。不要加这个，否则刚加载就会变使缓存false
  )

  onMounted(() => {
    getSettingFn(true)
  })
  onUnmounted(() => {
    clearInterval(dataObj.realTimeTimer)
  })

  return {
    segmentList,
    workSectionList,
    prodList,
    dataObj,
    getData,
    clickChart,
    back,
    getSettingFn,
    getSubData,
  }
}
