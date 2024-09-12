import { reactive } from 'vue'
import { _t } from './app'

export const ChartList = reactive([
  {
    list: {
      加工结果分组: {
        type: 'chart',
        option: 'chart1Option',
        title: '工位产量分布及变化幅度',
        columns: [],
        tableData: '',
      },
      班次分组: {
        type: 'chart',
        option: 'chart2Option',
        title: '工位产量分布及变化幅度',
        columns: [],
        tableData: '',
      },
    },
    current: '加工结果分组',
    belong: 'line',
  },
  {
    list: {
      单位时间产量: {
        type: 'chart',
        option: 'chart3Option',
        title: '工位加工能力对比',
        columns: [],
        tableData: '',
      },
      单位产品加工周期: {
        type: 'chart',
        option: 'chart4Option',
        title: '工位加工能力对比',
        columns: [],
        tableData: '',
      },
    },
    current: '单位时间产量',
    belong: 'line',
  },
  {
    list: {
      单位产品等待时长: {
        type: 'chart',
        option: 'chart5Option',
        title: '工位在制品等待情况对比',
        columns: [],
        tableData: '',
      },
      待加工数量: {
        type: 'chart',
        option: 'chart6Option',
        title: '工位在制品等待情况对比',
        columns: [],
        tableData: '',
      },
    },
    current: '单位产品等待时长',
    belong: 'line',
  },
  {
    list: {
      产品加工周期分析: {
        type: 'chart',
        option: 'chart8Option',
        title: '移动极差控制图',
      },
      产品加工详情: {
        type: 'table',
        option: {},
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 80,
          },
          {
            field: 'productCode',
            title: '产品码',
          },
          {
            field: 'shiftName',
            title: '生产班次',
          },
          {
            field: 'productModel',
            title: '产品型号',
          },
          {
            field: 'inboundTime',
            title: '进站时间',
          },
          {
            field: 'outboundTime',
            title: '出站时间',
          },
          {
            field: 'isQualified',
            title: '加工结果',
          },
          {
            field: 'processCycle',
            title: '工位加工周期（s）',
          },
        ],
        tableData: 'tablleData10',
      },
      工位运行日志: {
        type: 'table',
        option: {},
        columns: [
          {
            field: 'shiftName',
            title: '生产班次',
          },
          {
            field: 'workSectionName',
            title: '发生工位',
          },
          {
            field: 'productModel',
            title: '产品型号',
          },
          {
            field: 'state',
            title: '运行状态',
          },
          {
            field: 'startTime',
            title: '开始时间',
          },
          {
            field: 'endTime',
            title: '结束时间',
          },
          {
            field: 'duration',
            title: '持续时长（s）',
          },
        ],
        tableData: 'tablleData11',
      },
    },
    current: '产品加工周期分析',
    belong: 'station',
  },
])

//加工结果分组
export const GroupingOfProcessingResultsOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  title: {
    show: true,
    text: _t('工位产量分布及变化幅度'),
  },
  legend: {
    data: [_t('同比升降幅'), _t('环比升降幅'), _t('合格数量'), _t('不良数量')],
    x: 'right',
    y: 'top',
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        margin: 15,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: _t('产量：pcs'),
      axisLabel: {
        formatter: '{value} pcs',
      },
    },
    {
      type: 'value',
      name: _t('幅度：'),
      axisLabel: {
        formatter: '{value} %',
      },
      splitLine: {
        show: false, // 不显示背景线
      },
    },
  ],
  series: [
    {
      name: _t('同比升降幅'),
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value: string | number) {
          return value + ' %'
        },
      },
      itemStyle: {
        color: '#F2AF42',
      },
      data: [],
    },
    {
      name: _t('环比升降幅'),
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value: string | number) {
          return value + ' %'
        },
      },
      itemStyle: {
        color: '#DD6596',
      },
      data: [],
    },
    {
      name: _t('合格数量'),
      type: 'bar',
      barMaxWidth: 30,
      yAxisIndex: 0,
      stack: '数量',
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
        color: '#3CC7BA',
      },
      data: [],
    },
    {
      name: _t('不良数量'),
      type: 'bar',
      barMaxWidth: 30,
      yAxisIndex: 0,
      stack: '数量',
      emphasis: {
        focus: 'series',
      },
      label: {
        show: true,
        position: 'top',
        color: '#ec808d',
      },
      tooltip: {
        valueFormatter: function (value: string | number) {
          return value + ' pcs'
        },
      },
      itemStyle: {
        color: '#F2AF42',
      },
      data: [],
    },
  ],
}
//班次分组（模板）
export const DistributionAndMagnitudeOfChangesInWorkstationOutputOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  title: {
    show: true,
    text: _t('工位产量分布及变化幅度'),
  },
  legend: {
    data: [_t('早班产量'), _t('中班产量'), _t('晚班产量')],
    x: 'right',
    y: 'top',
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        margin: 15,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: _t('产量：pcs'),
      axisLabel: {
        formatter: '{value} pcs',
      },
    },
  ],
  series: [
    {
      name: _t('早班产量'),
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
      // itemStyle: {
      //   color: '#5398ee',
      // },
      data: [],
    },
    {
      name: _t('中班产量'),
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
      // itemStyle: {
      //   color: '#5398ee',
      // },
      data: [],
    },
    {
      name: _t('晚班产量'),
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
      // itemStyle: {
      //   color: '#5398ee',
      // },
      data: [],
    },
  ],
}

//单位时间产量、单位产品等待时长、待加工数量（模板）
//后两个表名、y轴名和图例名字要换一下，图是一样的
export const ProductionPerUnitTimeOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  title: {
    show: true,
    text: _t('工位加工能力对比'),
  },
  legend: {
    data: [_t('单位时间产量')],
    x: 'right',
    y: 'top',
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        margin: 15,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: _t('单位时间产量：pcs/h'),
      axisLabel: {
        formatter: '{value} pcs/h',
      },
    },
  ],
  series: [
    {
      name: _t('单位时间产量'),
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
          return value + ' pcs/h'
        },
      },
      itemStyle: {
        color: '#5398ee',
      },
      data: [],
      markLine: {
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
            type: 'average',
            name: _t('工位平均值'),
          },
        ],
      },
    },
  ],
}
//单位产品加工周期（模板）
export const ComparisonOfWorkstationProcessingCapabilitiesOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  title: {
    show: true,
    text: _t('工位加工能力对比'),
  },
  legend: {
    data: [_t('理论加工周期'), _t('实际加工周期')],
    x: 'right',
    y: 'top',
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        margin: 15,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: _t('单位产品加工周期：s'),
      axisLabel: {
        formatter: '{value} s',
      },
    },
  ],
  series: [
    {
      name: _t('理论加工周期'),
      type: 'line',
      tooltip: {
        valueFormatter: function (value: string | number) {
          return value + ' s'
        },
      },
      itemStyle: {
        color: '#F59A23',
      },
      data: [],
    },

    {
      name: _t('实际加工周期'),
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
          return value + ' s'
        },
      },
      itemStyle: {
        color: '#5398ee',
      },
      data: [],
    },
  ],
}

//工位详情分析
export const AnalysisOfWorkstationDetails = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  title: {
    show: false,
    text: '',
  },
  legend: {
    data: [''],
    x: 'right',
    y: 'top',
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisPointer: {
        type: 'shadow',
      },
      axisLabel: {
        margin: 15,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      name: _t('产量：pcs'),
      axisLabel: {
        formatter: '{value} pcs',
      },
    },
  ],
  series: [
    {
      name: '',
      type: 'bar',
      barMaxWidth: 30,
      emphasis: {
        focus: 'series',
      },
      label: {
        show: true,
        position: 'top',
        color: '#000',
      },
      tooltip: {
        valueFormatter: function (value: string | number) {
          return value + ' pcs'
        },
      },
      itemStyle: {
        color: '#3CC7BA',
      },
      data: [],
    },
  ],
}

//频数分布直方图
export const FrequencyDistributionHistogram = {
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    valueFormatter: function (value: string | number) {
      return value + ' pcs'
    },
  },
  title: {
    show: true,
    text: _t('频数分布直方图'),
  },
  xAxis: [
    {
      data: [],
      show: false,
    },
    {
      data: [],
      position: 'bottom',
      boundaryGap: false,
      axisPointer: { show: false },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 15,
        interval: 0,
        color: '#999999',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#F1F1F1',
        },
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: false,
      },
      name: _t('频数'),
      axisLabel: {
        formatter: '{value} pcs',
      },
    },
  ],
  series: [
    {
      name: _t('频数'),
      type: 'bar',
      barCategoryGap: '0%',
      itemStyle: {
        color: '#5398ee',
      },
      // barMaxWidth: 30,

      label: {
        show: true,
        position: 'top',
        color: '#000',
      },

      data: [],
      xAxisIndex: 0,
    },
  ],
}

//移动极差控制图
export const movingRangeChartOption = {
  title: { show: true, text: _t('移动极差控制图') },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisLabel: {
        margin: 15,
      },
    },
  ],
  yAxis: {
    type: 'value',
    max: 100,
    min: 0,
  },
  series: [
    {
      name: '移动极差MR',
      type: 'line',
      data: [],
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
        data: [],
      },
    },
  ],
}
