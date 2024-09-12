import {
  ref,
  SetupContext,
  reactive,
  watch,
  onMounted,
  markRaw,
  computed,
  nextTick,
  onUnmounted,
} from 'vue'
import html2canvas from 'html2canvas'
import dayjs from 'dayjs'
import {
  getCheckitemconfigAll,
  getProductModels,
  getSPCRunAnalysis,
  getAnomalyRuleSelectConfig,
  getAbilityAnalyzeConfig,
  getAbilityAnalyzeResult,
  getControlChartAnalysisResult,
  saveSPCRunAnalysis,
  saveAnomalyRuleSelectConfig,
  saveAbilityAnalyzeConfig,
  getRange,
} from '../Models/Service/Service'
import { _t } from '../app'
import sdk from 'sdk'
const { packs } = sdk
const { echarts } = packs
import { getLang } from '@/libs/Language/Language'
import { ElMessage } from 'element-plus'

export const useSPCOperationAnalysis = (props: any, ctx: SetupContext) => {
  const lang = window.app.current.project.current.language.lang
  const dataObj: any = reactive({
    loading: false,
    timeRange: 1,
    //搜索选项
    runModes: 1,
    queryStartTime: dayjs().format('YYYY-MM-DD 00:00:00'),
    queryEndTime: dayjs().format('YYYY-MM-DD 23:59:59'),
    checkItemConfigId: '',
    checkItemConfigName: '',
    controlchartType: 0,
    id: '',
    productModelName: '',
    samplingMethod: 1,
    sampleRemark: '',
    subGroupCapacity: 0,
    subGroupCount: 0,
    updateTime: '',
    updaterId: '',
    //过程能力
    lslValue: 0,
    targetValue: 0,
    uslValue: 0,
    //tab栏
    chartTab: 1, //为0时截图用
    //弹窗
    processDapabilityDescriptionShow: false,
    explanationOfDiscriminatoryRulesShow: false,
    sampleDataDetailsShow: false,
    sampleDataInputShow: false,
    //图表
    distributionPlotData: null,
    constDto: null,
    statisticalValue: null,
    calculatedValue: null,
    withinGroupProcessCapability: null,
    overallProcessCapabilityDto: null,
    otherProcessCapability: null,
    performance: null,
    differenceValueAnalysisResult: null,
    meanValueAnalysisResult: null,
  })
  const chartRef1 = ref()
  const tableRef1 = ref<any>()
  const chartRef2 = ref()
  const tableRef2 = ref<any>()
  const myChart1 = ref<any>()
  const myChart2 = ref<any>()
  const chartRef3 = ref()
  const myChart3 = ref<any>()
  const dataSource1 = computed(
    () => dataObj.meanValueAnalysisResult?.anomalyPointDetailDtos || []
  )
  const dataSource2 = computed(
    () => dataObj.differenceValueAnalysisResult?.anomalyPointDetailDtos || []
  )
  const echartLang = ref<{
    key: string
    lang: any
  }>(getLang(lang))
  const columns = ref<any>([
    {
      title: '异常类型',
      field: 'ruleCode',
    },
    {
      title: '起始点',
      field: 'startPointIndex',
    },
    {
      title: '点个数',
      field: 'pointCount',
    },
  ])

  const drawLine = async () => {
    myChart1.value?.dispose()
    myChart1.value = null
    myChart2.value?.dispose()
    myChart2.value = null
    const charts = await echarts
    let langParams = {}
    if (echartLang.value.key) {
      charts.registerLocale(echartLang.value.key, echartLang.value.lang)
      langParams = {
        locale: echartLang.value.key,
      }
    }
    // 均值控制图
    if (dataObj.meanValueAnalysisResult) {
      let numList = [
        ...dataObj.meanValueAnalysisResult.yAxis,
        dataObj.meanValueAnalysisResult.ucl,
        dataObj.meanValueAnalysisResult.cl,
        dataObj.meanValueAnalysisResult.lcl,
      ]
      let _Option: any = {
        title: { show: false },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [
          {
            type: 'category',
            data: dataObj.meanValueAnalysisResult.xAxis || [],
            axisLabel: {
              margin: 15,
            },
          },
        ],
        yAxis: {
          type: 'value',
          max: Math.ceil(Math.max(...numList) + 1),
          min: Math.floor(Math.min(...numList) - 1),
        },
        series: [
          {
            name: dataObj.meanValueAnalysisResult.controlChartTitle,
            type: 'line',
            connectNulls: true,
            data: dataObj.meanValueAnalysisResult.yAxis || [],
            markLine: {
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '{b}: {c}',
                textStyle: {
                  color: '#F59A23',
                },
              },
              lineStyle: {
                type: 'solid',
                width: 2,
                color: '#F59A23',
              },
              data: [
                {
                  yAxis: dataObj.meanValueAnalysisResult.ucl,
                  name: 'UCL',
                  lineStyle: {
                    color: '#F59A23',
                  },
                },
                {
                  yAxis: dataObj.meanValueAnalysisResult.cl,
                  name: 'CL',
                  lineStyle: {
                    color: '#FC4D4D',
                  },
                  label: {
                    color: '#FC4D4D',
                  },
                },
                {
                  yAxis: dataObj.meanValueAnalysisResult.lcl,
                  name: 'LCL',
                  lineStyle: {
                    color: '#F59A23',
                  },
                  label: {
                    color: '#F59A23',
                  },
                },
              ],
            },
          },
        ],
      }
      let chartDom: any = chartRef1.value
      chartDom?.removeAttribute('_echarts_instance_')
      myChart1.value = markRaw(charts.init(chartDom, null, langParams))
      myChart1.value?.setOption(_Option, true)
      myChart1.value?.resize()
    }
    // 极差控制图
    if (dataObj.differenceValueAnalysisResult) {
      let numList = [
        ...dataObj.differenceValueAnalysisResult.yAxis,
        dataObj.differenceValueAnalysisResult.ucl,
        dataObj.differenceValueAnalysisResult.cl,
        dataObj.differenceValueAnalysisResult.lcl,
      ]

      let _Option: any = {
        title: { show: false },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [
          {
            type: 'category',
            data: dataObj.differenceValueAnalysisResult.xAxis || [],
            axisLabel: {
              margin: 15,
            },
          },
        ],
        yAxis: {
          type: 'value',
          max: Math.ceil(Math.max(...numList) + 1),
          min: Math.floor(Math.min(...numList) - 1),
        },
        series: [
          {
            name: dataObj.differenceValueAnalysisResult.controlChartTitle,
            type: 'line',
            connectNulls: true,
            data: dataObj.differenceValueAnalysisResult.yAxis || [],
            markLine: {
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '{b}: {c}',
                textStyle: {
                  color: '#F59A23',
                },
              },
              lineStyle: {
                type: 'solid',
                width: 2,
                color: '#F59A23',
              },
              data: [
                {
                  yAxis: dataObj.differenceValueAnalysisResult.ucl,
                  name: 'UCL',
                  lineStyle: {
                    color: '#F59A23',
                  },
                },
                {
                  yAxis: dataObj.differenceValueAnalysisResult.cl,
                  name: 'CL',
                  lineStyle: {
                    color: '#FC4D4D',
                  },
                  label: {
                    color: '#FC4D4D',
                  },
                },
                {
                  yAxis: dataObj.differenceValueAnalysisResult.lcl,
                  name: 'LCL',
                  lineStyle: {
                    color: '#F59A23',
                  },
                  label: {
                    color: '#F59A23',
                  },
                },
              ],
            },
          },
        ],
      }
      let chartDom2: any = chartRef2.value
      chartDom2?.removeAttribute('_echarts_instance_')
      myChart2.value = markRaw(charts.init(chartDom2, null, langParams))
      myChart2.value?.setOption(_Option, true)
      myChart2.value?.resize()
    }
  }

  const openSampleDataDetails = () => {
    if (!dataObj.checkItemConfigId) {
      ElMessage.error('请先配置检测项目')
      return
    }
    dataObj.sampleDataDetailsShow = true
  }
  const openSampleDataInput = () => {
    if (!dataObj.checkItemConfigId) {
      ElMessage.error('请先配置检测项目')
      return
    }
    dataObj.sampleDataInputShow = true
  }
  /**控制图多选组数据*/
  const anomalyRuleSelectConfigList = ref<any[]>([])
  const getAnomalyRuleSelectConfigFn = () => {
    return getAnomalyRuleSelectConfig({
      checkItemConfigId: dataObj.checkItemConfigId,
    }).then((res: any) => {
      anomalyRuleSelectConfigList.value = res || []
    })
  }
  /**控制图多选组数据 */
  const getAbilityAnalyzeConfigFn = () => {
    return getAbilityAnalyzeConfig({
      checkItemConfigId: dataObj.checkItemConfigId,
    }).then((res: any) => {
      dataObj.lslValue = res.lslValue
      dataObj.targetValue = res.targetValue
      dataObj.uslValue = res.uslValue
    })
  }

  /** 筛选配置初始值*/
  const checkitemconfigList = ref<any[]>([])
  const getSPCRunAnalysisFn = () => {
    return getSPCRunAnalysis({
      checkItemConfigId: dataObj.checkItemConfigId,
    }).then((res: any) => {
      dataObj.id = res.id

      dataObj.queryStartTime =
        res.queryStartTime ||
        dayjs()
          .subtract(dataObj.timeRange, 'hour')
          .format('YYYY-MM-DD HH:mm:ss')
      dataObj.queryEndTime =
        res.queryEndTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
      dataObj.productModelName = res.productModelName
      dataObj.runModes = res.runModes
      dataObj.samplingMethod = res.samplingMethod
      dataObj.sampleRemark = res.sampleRemark
      dataObj.subGroupCapacity = res.subGroupCapacity
      dataObj.subGroupCount = res.subGroupCount
      dataObj.updateTime = res.updateTime
      dataObj.updaterId = res.updaterId
      timerRunMode()
    })
  }
  const timerRunMode = () => {
    clearInterval(realTimerTimer.value)
    if (dataObj.runModes == 3) {
      //实时监控
      dataObj.queryStartTime = dayjs()
        .subtract(dataObj.timeRange, 'hour')
        .format('YYYY-MM-DD HH:mm:ss')
      dataObj.queryEndTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      dataObj.samplingMethod = 1
      realTimerTimer.value = setInterval(() => {
        dataObj.queryStartTime = dayjs()
          .subtract(dataObj.timeRange, 'hour')
          .format('YYYY-MM-DD HH:mm:ss')
        dataObj.queryEndTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
        getChartData()
      }, 60000)
    }
  }
  const realTimerTimer = ref<any>(null)
  const saveRunModes = async () => {
    //历史模式同步一下后端的查询时间
    //切换模式时后端检测到RunMode变了的话，不会用上面传的时间等入参，需要重新获取
    saveSPCRunAnalysisFn(true)
    timerRunMode()
  }
  /**SPC分析配置保存 */
  const saveSPCRunAnalysisFn = (getConfig?: boolean) => {
    if (
      dayjs(dataObj.queryEndTime).format('YYYY-MM-DD HH:mm:ss') <
      dayjs(dataObj.queryStartTime).format('YYYY-MM-DD HH:mm:ss')
    ) {
      ElMessage.warning('开始时间不能大于结束时间')
      return
    }
    saveSPCRunAnalysis({
      id: dataObj.id,
      checkItemConfigId: dataObj.checkItemConfigId,
      productModelName: dataObj.productModelName,
      subGroupCapacity: dataObj.subGroupCapacity,
      subGroupCount: dataObj.subGroupCount,
      runModes: dataObj.runModes,
      queryStartTime: dayjs(dataObj.queryStartTime).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      queryEndTime: dayjs(dataObj.queryEndTime).format('YYYY-MM-DD HH:mm:ss'),
      samplingMethod: dataObj.samplingMethod,
      sampleRemark: dataObj.sampleRemark,
    }).then(async (res: any) => {
      // ElMessage.success('保存成功')
      if (getConfig) {
        //改了检测项目，需要重置其他筛选条件
        getData()
      } else {
        getChartData()
      }
    })
  }
  /**保存控制图多选组数据*/
  const saveAnomalyRuleSelectConfigFn = () => {
    saveAnomalyRuleSelectConfig({
      checkItemConfigId: dataObj.checkItemConfigId,
      anomalyRuleSelectConfigs: anomalyRuleSelectConfigList.value,
    }).then((res: any) => {
      ElMessage.success('保存成功')
      // 获取控制图部分数据
      getControlChartAnalysisResultFn()
    })
  }
  const saveAbilityAnalyzeConfigFn = () => {
    saveAbilityAnalyzeConfig({
      checkItemConfigId: dataObj.checkItemConfigId,
      abilityAnalyzeConfig: {
        lslValue: dataObj.lslValue,
        targetValue: dataObj.targetValue,
        uslValue: dataObj.uslValue,
      },
    }).then((res: any) => {
      // 获取控制图部分数据
      getAbilityAnalyzeResultFn()
    })
  }
  const productModelList = ref<any[]>([])
  /**产品型号 */
  const getProductModelListFn = () => {
    return getProductModels({ id: dataObj.checkItemConfigId }).then(
      (res: any) => {
        productModelList.value = res
        dataObj.productModelName = res[0] //res至少必有个'所有'
      }
    )
  }
  const getChartData = async () => {
    await getAnomalyRuleSelectConfigFn() //控制图多选组数据
    await getAbilityAnalyzeConfigFn() //控制图多选组数据
    await getControlChartAnalysisResultFn()
    await getAbilityAnalyzeResultFn()
  }

  /**获取所有数据,只有checkItemConfigId变化时需要引起这个变化 */
  const getData = async () => {
    await getProductModelListFn() //产品型号
    await getSPCRunAnalysisFn() //SPC分析配置
    await getChartData() //下方两个tab数据
  }
  /**检测项目切换 */
  const onChangeCheckitemconfig = (init?: boolean) => {
    let _o =
      checkitemconfigList.value.find(
        (item) => item.id === dataObj.checkItemConfigId
      ) || {}
    dataObj.checkItemConfigName = _o.name || '-'
    dataObj.controlchartType = _o.controlchartType || 0
    if (init) {
      //首次进页面直接查数据
      getData()
    } else {
      //改了检测项目引起的需要先保存下页面配置
      // saveSPCRunAnalysisFn(true)
      //后端说不保存
      getData()
    }
  }
  /**控制图分析结果获取 */
  const getControlChartAnalysisResultFn = () => {
    return getControlChartAnalysisResult({
      checkItemConfigId: dataObj.checkItemConfigId,
    }).then((res: any) => {
      dataObj.differenceValueAnalysisResult = res.differenceValueAnalysisResult
      dataObj.meanValueAnalysisResult = res.meanValueAnalysisResult
      drawLine()
    })
  }
  /**过程能力分析结果获取 */

  const getAbilityAnalyzeResultFn = () => {
    return getAbilityAnalyzeResult({
      checkItemConfigId: dataObj.checkItemConfigId,
    }).then(async (res: any) => {
      dataObj.distributionPlotData = res.distributionPlotData
      dataObj.constDto = res.constDto
      dataObj.statisticalValue = res.statisticalValue
      dataObj.calculatedValue = res.calculatedValue
      dataObj.withinGroupProcessCapability = res.withinGroupProcessCapability
      dataObj.overallProcessCapabilityDto = res.overallProcessCapabilityDto
      dataObj.otherProcessCapability = res.otherProcessCapability
      dataObj.performance = res.performance

      if (dataObj.distributionPlotData) {
        myChart3.value?.dispose()
        myChart3.value = null
        const xAxis = res.distributionPlotData?.xAxis || []
        const yAxis = res.distributionPlotData?.yAxis || []
        const solidLineYAxis = res.distributionPlotData?.solidLineYAxis || []
        const dottedLineXAxis = res.distributionPlotData?.dottedLineYAxis || []
        const xInterval = (res.distributionPlotData?.xInterval || 1) / 2
        let numList = [
          ...xAxis,
          res.distributionPlotData?.usl,
          res.distributionPlotData?.lsl,
        ]

        let _Option: any = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
            formatter: function (params: any) {
              return `${params[0].axisValue}<br/>${params[0].marker}${params[0].seriesName}:${params[0].value[1]}<br/>${params[1].marker}${params[1].seriesName}:${params[1].value[1]}<br/>${params[2].marker}
                ${params[2].seriesName}:${params[2].value[1]}`
            },
          },
          legend: {
            data: ['频数', '整体概率密度', '组内概率密度'],
            x: 'right',
            y: 'top',
          },
          xAxis: [
            {
              type: 'value',
              axisLine: {
                onZero: false,
              },
              max: Math.ceil(Math.max(...numList) + xInterval),
              min: Math.floor(Math.min(...numList) - xInterval),
            },
          ],
          yAxis: [
            {
              name: '频数',
              type: 'value',
              axisLabel: {
                formatter: '{value}',
              },
            },
            {
              name: '概率密度',
              type: 'value',
              axisLabel: {
                formatter: '{value}',
              },
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '频数',
              data: xAxis.map((item: number, idx: number) => [
                item,
                yAxis[idx],
              ]),
              label: {
                show: true,
                position: 'insideTop',
                color: '#fff',
              },
              type: 'bar',
              barWidth: '100%',
              barCategoryGap: 0,
              markLine: {
                symbol: 'none',
                label: {
                  show: true,
                  position: 'end',
                  formatter: '{b}: {c}',
                },
                data: [
                  {
                    xAxis: res.distributionPlotData?.usl,
                    name: '规格上限',
                    lineStyle: {
                      type: 'solid',
                      color: '#F59A23',
                      width: 2,
                    },
                    label: {
                      color: '#A1A1A1',
                    },
                  },
                  {
                    xAxis: res.distributionPlotData?.lsl,
                    name: '规格下限',
                    lineStyle: {
                      type: 'solid',
                      color: '#F59A23',
                      width: 2,
                    },
                    label: {
                      color: '#A1A1A1',
                    },
                  },
                ],
              },
            },
            {
              name: '整体概率密度',
              data: xAxis.map((item: number, idx: number) => [
                item,
                solidLineYAxis[idx],
              ]),
              label: {
                show: true,
                position: 'top',
                color: '#FF5353',
              },
              yAxisIndex: 1,
              type: 'line',
              smooth: true,
              connectNulls: true,
              itemStyle: {
                normal: {
                  color: '#FF5353',
                  lineStyle: {
                    color: '#FF5353',
                    type: 'solid',
                  },
                },
              },
            },
            {
              name: '组内概率密度',
              data: xAxis.map((item: number, idx: number) => [
                item,
                dottedLineXAxis[idx],
              ]),
              label: {
                show: true,
                position: 'top',
                color: '#A1A1A1',
              },
              yAxisIndex: 1,
              type: 'line',
              smooth: true,
              connectNulls: true,
              itemStyle: {
                normal: {
                  color: '#A1A1A1',
                  lineStyle: {
                    color: '#A1A1A1',
                    type: 'dotted',
                  },
                },
              },
            },
          ],
        }
        // let _Option: any = {
        //   tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //       type: 'cross',
        //       crossStyle: {
        //         color: '#999',
        //       },
        //     },
        //   },
        //   legend: {
        //     data: ['频数', '整体概率密度', '组内概率密度'],
        //     x: 'right',
        //     y: 'top',
        //   },
        //   xAxis: [
        //     {
        //       type: 'category',
        //       data: res.distributionPlotData?.xAxis || [],
        //       axisPointer: {
        //         type: 'shadow',
        //       },
        //     },
        //   ],
        //   yAxis: [
        //     {
        //       name: '频数',
        //       type: 'value',
        //       axisLabel: {
        //         formatter: '{value}',
        //       },
        //     },
        //     {
        //       name: '概率密度',
        //       type: 'value',
        //       axisLabel: {
        //         formatter: '{value}',
        //       },
        //       splitLine: {
        //         show: false,
        //       },
        //     },
        //   ],
        //   series: [
        //     {
        //       name: '频数',
        //       type: 'bar',
        //       data: res.distributionPlotData?.yAxis || [],
        //       label: {
        //         show: true,
        //         position: 'insideTop',
        //         color: '#fff',
        //       },
        //       barWidth: '100%',
        //       markLine: {
        //         symbol: 'none',
        //         label: {
        //           show: true,
        //           position: 'end',
        //            name: '规格下限',
        //         },
        //         data: [
        //           {
        //             xAxis: String(res.distributionPlotData?.usl),
        //             name: '规格上限',
        //             lineStyle: {
        //               type: 'solid',
        //               color: '#F59A23',
        //             },
        //             label: {
        //               color: '#A1A1A1',
        //             },
        //           },
        //           {
        //             xAxis: String(res.distributionPlotData?.lsl),
        //             name: '规格下限',
        //             lineStyle: {
        //               type: 'solid',
        //               color: '#F59A23',
        //             },
        //             label: {
        //               color: '#A1A1A1',
        //             },
        //           },
        //         ],
        //       },
        //     },
        //     {
        //       name: '整体概率密度',
        //       type: 'line',
        //       connectNulls: true,
        //       yAxisIndex: 1,
        //       data: res.distributionPlotData?.solidLineYAxis || [],
        //       smooth: true,
        //       itemStyle: {
        //         normal: {
        //           color: '#FF5353',
        //           lineStyle: {
        //             color: '#FF5353',
        //             type: 'solid',
        //           },
        //         },
        //       },
        //     },
        //     {
        //       name: '组内概率密度',
        //       type: 'line',
        //       connectNulls: true,
        //       yAxisIndex: 1,
        //       data: res.distributionPlotData?.dottedLineYAxis || [],
        //       smooth: true, //存疑虚线能不能用
        //       itemStyle: {
        //         normal: {
        //           color: '#A1A1A1',
        //           lineStyle: {
        //             color: '#A1A1A1',
        //             type: 'dotted',
        //           },
        //         },
        //       },
        //       tooltip: {
        //         valueFormatter: function (value: string | number) {
        //           return value + ' %'
        //         },
        //       },
        //     },
        //   ],
        // }
        let chartDom: any = chartRef3.value
        chartDom?.removeAttribute('_echarts_instance_')
        const charts = await echarts
        let langParams = {}
        if (echartLang.value.key) {
          charts.registerLocale(echartLang.value.key, echartLang.value.lang)
          langParams = {
            locale: echartLang.value.key,
          }
        }
        myChart3.value = markRaw(charts.init(chartDom, null, langParams))
        myChart3.value?.setOption(_Option, true)
        myChart3.value?.resize()
      }
    })
  }

  onMounted(() => {
    getRange().then((res: any) => {
      dataObj.timeRange = res
      getCheckitemconfigAll({ filter: '' }).then(async (res: any) => {
        checkitemconfigList.value = res
        if (checkitemconfigList.value.length) {
          dataObj.checkItemConfigId = checkitemconfigList.value[0].id
          await getSPCRunAnalysisFn()
          await onChangeCheckitemconfig(true) //检测项目切换拿中文
        } else {
          ElMessage.warning('请先配置检测项目')
        }
      })
    })
  })
  onUnmounted(() => {
    clearInterval(realTimerTimer.value)
  })
  watch(
    () => dataObj.chartTab,
    (val) => {
      nextTick(() => {
        myChart1.value?.resize()
        myChart2.value?.resize()
        myChart3.value?.resize()
        dataSource1.value?.length &&
          tableRef1.value?.setCurrentRow(dataSource1.value[0])
        dataSource2.value?.length &&
          tableRef2.value?.setCurrentRow(dataSource2.value[0])
      })
    }
  )

  const strategy: any = {
    1: [1, 1],
    2: [2, 9],
    3: [10, 25],
  }
  const strategyArray = (arr: number[]) => {
    const start = arr[0]
    const end = arr[1]
    const result = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    return result
  }
  const dataURLToBlob = (dataurl: any) => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  const html2canvasFn = () => {
    ElMessage('生成中')
    dataObj.loading = true
    let _type = dataObj.chartTab
    dataObj.chartTab = 0
    nextTick(() => {
      //在watch那边resize

      setTimeout(() => {
        let dom: any = document.getElementById('operationAnalysis')

        html2canvas(dom, {
          allowTaint: true,
        })
          .then((canvas: any) => {
            let a = document.createElement('a')
            let dom = document.body.appendChild(canvas)
            dom.style.display = 'none'
            a.style.display = 'none'
            document.body.removeChild(dom)
            let blob: any = dataURLToBlob(dom.toDataURL('image/png'))
            a.setAttribute('href', URL.createObjectURL(blob))
            a.setAttribute(
              'download',
              `SPC运行分析${dayjs().format('YYYYMMDDHHmmss')}.png`
            )
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(blob)
            document.body.removeChild(a)
            nextTick(() => {
              dataObj.chartTab = _type
              nextTick(() => {
                myChart1.value?.resize()
                myChart2.value?.resize()
                myChart3.value?.resize()
                dataObj.loading = false
              })
            })
          })
          .catch(() => {
            dataObj.chartTab = _type
            nextTick(() => {
              myChart1.value?.resize()
              myChart2.value?.resize()
              myChart3.value?.resize()
              dataObj.loading = false
            })
          })
      }, 100) //不加的话html2canvas会阻塞进程，导致loading无法在我们希望的时机出现和消失。
    })
  }
  return {
    dataObj,
    chartRef1,
    tableRef1,
    dataSource1,
    chartRef2,
    tableRef2,
    chartRef3,
    myChart3,
    dataSource2,
    columns,
    checkitemconfigList,
    anomalyRuleSelectConfigList,
    productModelList,
    realTimerTimer,
    getData,
    saveSPCRunAnalysisFn,
    saveRunModes,
    openSampleDataInput,
    openSampleDataDetails,
    onChangeCheckitemconfig,
    saveAnomalyRuleSelectConfigFn,
    saveAbilityAnalyzeConfigFn,
    getControlChartAnalysisResultFn,
    getAbilityAnalyzeResultFn,
    strategy,
    strategyArray,
    html2canvasFn,
  }
}
