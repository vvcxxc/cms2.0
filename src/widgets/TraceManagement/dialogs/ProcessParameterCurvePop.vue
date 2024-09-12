<!-- 修改色系 -->

<template>
  <BaseDialog
    v-model="$props.visible"
    width="1630px"
    :title="`${_t('过程参数曲线')}`"
    class="ProcessParameterCurveEdit-el-dialog"
    @close="submit('close')"
    @confirm="submit('confirm')"
  >
    <div class="ProcessParameterCurve-content">
      <div class="ProcessParameterCurve-search">
        <div class="form-key">{{ _t('时间范围') }}：</div>
        <div>
          <el-date-picker
            type="datetime"
            style="width: 230px"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="dataObj.From"
            popper-class="light-datetime-picker"
            class="light-datetime-picker"
          >
          </el-date-picker>
        </div>
        <div class="search-key">-</div>
        <div>
          <el-date-picker
            type="datetime"
            style="width: 230px"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="dataObj.To"
            popper-class="light-datetime-picker"
            class="light-datetime-picker"
          ></el-date-picker>
        </div>
        <div class="form-key">{{ _t('产品型号') }}：</div>
        <el-select
          class="--scms-select"
          popper-class="--scms-select_poper"
          style="width: 170px"
          v-model="dataObj.productId"
          @change="getProcessrouteFn"
        >
          <el-option :label="_t('全部')" value=""></el-option>
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.model"
            :value="item.id"
          ></el-option>
        </el-select>
        <div class="form-key">{{ _t('工序') }}：</div>
        <el-select
          class="--scms-select"
          popper-class="--scms-select_poper"
          style="width: 170px"
          v-model="dataObj.curProcessId"
          @change="getParams"
        >
          <el-option
            v-for="item in worksectionList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <div class="form-key">{{ _t('参数') }}：</div>
        <el-select
          class="--scms-select"
          popper-class="--scms-select_poper"
          style="width: 170px"
          v-model="dataObj.parmId"
        >
          <el-option
            v-for="item in tableHeader"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          class="search-btn"
          @click="getCurveFn"
          >{{ _t('查询') }}</el-button
        >
      </div>
      <div class="ProcessParameterCurve-table">
        <div class="ProcessParameterCurve-limit">
          <div>{{ _t('上限值') }}：</div>
          <el-input
            class="limit-input"
            type="number"
            v-model="dataObj.tempupper"
            @blur="checkNum"
          />
          <div>{{ _t('下限值') }}：</div>
          <el-input
            class="limit-input"
            type="number"
            v-model="dataObj.templower"
            @blur="checkNum"
          />
        </div>
        <el-button class="restore" @click="drawLine">{{
          _t('还原')
        }}</el-button>
        <div id="myChart" class="myChart"></div>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import {
  ref,
  onMounted,
  watch,
  nextTick,
  defineComponent,
  reactive,
  computed,
} from 'vue'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
import EditButton from '../components/editButton.vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import { getLang } from '@/libs/Language/Language'

const { packs } = sdk
const { echarts } = packs
// import * as echarts from 'echarts'
import { _t } from '../app'
import { Language } from '@/libs/Language/Language'
import {
  getProcessroutebyproductmodel,
  getproductList,
  getCurve,
} from '@/api/index'

export default defineComponent({
  name: 'EditSummaryTablePop',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: false,
    },
  },
  components: {
    BaseDialog,
    EditButton,
    BaseDrawer,
  },
  setup(props, { emit }) {
    const { local } = Language.useElementPlusI18n()
    const lang = window.app.current.project.current.language.lang

    const echartLang = ref<{
      key: string
      lang: any
    }>(getLang(lang))
    const dataObj = reactive({
      From: '',
      To: '',
      productId: '',
      curProcessId: '',
      parmId: '',
      upper: '',
      lower: '',
      tempupper: '',
      templower: '',
    })

    const productList = ref<any[]>([])
    const getproductListFn = (isfirst?: Boolean) => {
      return getproductList({ filter: '' }).then((res: any) => {
        productList.value = res.items

        dataObj.productId = '' //全部
        !isfirst && getProcessrouteFn()
      })
    }
    const worksectionList = ref<any[]>([])
    const getProcessrouteFn = () => {
      let model = ''
      if (dataObj.productId) {
        model = productList.value.find(
          (item: any) => item.id == dataObj.productId
        ).model
      }
      return getProcessroutebyproductmodel({
        productModel: model,
        includeDetails: true,
      }).then((res: any) => {
        worksectionList.value = res
        if (worksectionList.value.length) {
          dataObj.curProcessId = worksectionList.value[0].id
          if (worksectionList.value[0].processParameters.length) {
            dataObj.parmId = worksectionList.value[0].processParameters[0].key
          } else {
            dataObj.parmId = ''
          }
        } else {
          dataObj.curProcessId = ''
          dataObj.parmId = ''
        }
      })
    }

    const tableHeader = computed(() => {
      if (!worksectionList.value.length) {
        return []
      }
      let _obj = worksectionList.value.find(
        (item: any) => item.id == dataObj.curProcessId
      )
      if (!_obj) {
        return []
      }
      return _obj.processParameters || []
    })
    const tableLimit = computed(() => {
      if (!worksectionList.value.length) {
        return []
      }
      let _obj = worksectionList.value.find(
        (item: any) => item.id == dataObj.curProcessId
      )
      if (!_obj) {
        return []
      }
      return _obj.formula2ProcessParameterModels || []
    })
    const getParams = () => {
      nextTick(() => {
        if (tableHeader.value.length) {
          dataObj.parmId = tableHeader.value[0].key
        } else {
          dataObj.parmId = ''
        }
      })
    }

    const curveList = ref<any[]>([])
    const getCurveFn = () => {
      if (!dataObj.curProcessId) {
        ElMessage.warning(_t('请选择工序！'))
        return
      }
      if (!dataObj.parmId) {
        ElMessage.warning(_t('请选择参数！'))
        return
      }
      let model = ''
      if (props.productId) {
        model = productList.value.find(
          (item: any) => item.id == props.productId
        ).model
      }
      return getCurve({
        ProductModel: model,
        From: getDate(dataObj.From),
        To: getDate(dataObj.To),
        WorkSectionId: dataObj.curProcessId,
        ParamId: dataObj.parmId,
      }).then((res: any) => {
        curveList.value = res || []

        let _obj = tableLimit.value.find(
          (item: any) => item.parameterId == dataObj.parmId
        )
        if (_obj) {
          dataObj.upper = _obj.upper
          dataObj.tempupper = _obj.upper
          dataObj.lower = _obj.lower
          dataObj.templower = _obj.lower
        } else {
          dataObj.upper = ''
          dataObj.tempupper = ''
          dataObj.lower = ''
          dataObj.templower = ''
        }
        drawLine()
      })
    }

    const drawLine = async () => {
      let _name = tableHeader.value.find(
        (item: any) => item.key == dataObj.parmId
      )?.name
      let option = {
        title: {
          text: ' ',
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any) {
            return (
              params[1].axisValue +
              '</br>' +
              params[1].marker +
              params[1].seriesName +
              ':  ' +
              params[1].data
            )
          },
        },
        toolbox: {
          top: '0px',
          right: '90px',
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
          },
        },
        dataZoom: [
          {
            show: false,
            realtime: true,
            bottom: '18',
          },
          {
            type: 'inside',
            realtime: true,
            zoomOnMouseWheel: 'ctrl',
          },
        ],
        color: ['#FFA033', '#46A0FF', '#18D4E2'],
        legend: {
          top: '5px',
          right: '140px',
          data: [_t('上限'), _name, _t('下限')],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: curveList.value.map((item: any) => item.x),
        },
        yAxis: {
          type: 'value',
        },

        series: [
          {
            name: _t('上限'),
            type: 'line',
            symbol: 'none',
            data: curveList.value.map((item: any) => dataObj.upper),
            lineStyle: {
              normal: {
                color: '#FFA033',
                width: 1,
              },
            },
            itemStyle: {
              normal: {
                color: '#FFA033',
              },
            },
          },
          {
            name: tableHeader.value.find(
              (item: any) => item.key == dataObj.parmId
            ).name,
            type: 'line',
            symbol: 'none',
            data: curveList.value.map((item: any) => item.y),
            lineStyle: {
              normal: {
                color: '#46A0FF',
                width: 1,
              },
            },
            itemStyle: {
              normal: {
                color: '#46A0FF',
              },
            },
          },
          {
            name: _t('下限'),
            type: 'line',
            symbol: 'none',
            data: curveList.value.map((item: any) => dataObj.lower),
            lineStyle: {
              normal: {
                color: '#18D4E2',
                width: 1,
              },
            },
            itemStyle: {
              normal: {
                color: '#18D4E2',
              },
            },
          },
        ],
      }
      let chartDom: any = document.getElementById('myChart')
      chartDom.removeAttribute('_echarts_instance_')
      const charts = await echarts
      let langParams = {}
      if (echartLang.value.key) {
        charts.registerLocale(echartLang.value.key, echartLang.value.lang)
        langParams = {
          locale: echartLang.value.key,
        }
      }
      let myChart = charts.init(chartDom, null, langParams)
      myChart.setOption(option, true)
    }

    Language.useChange(async (lang: typeof Language) => {
      const langType = lang.lang
      echartLang.value = getLang(langType)
    })

    const submit = (state: 'close' | 'confirm') => {
      if (state == 'confirm') {
        emit('callback', state)
      } else {
        emit('callback', state)
      }
    }
    const getDate = (val: string | number) => {
      if (val) {
        let date = new Date(val)
        let month: any = date.getMonth() + 1
        month = month < 10 ? `0${month}` : month
        let day: any = date.getDate()
        day = day < 10 ? `0${day}` : day
        let hour: any = date.getHours()
        hour = hour < 10 ? `0${hour}` : hour
        let minute: any = date.getMinutes()
        minute = minute < 10 ? `0${minute}` : minute
        let second: any = date.getSeconds()
        second = second < 10 ? `0${second}` : second
        let str = `${date.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`
        return str
      }
      return ''
    }

    const checkNum = () => {
      if (isNaN(Number(dataObj.upper))) {
        ElMessage.error(_t('上限请输入数字！'))
        dataObj.tempupper = dataObj.upper
        return
      } else {
        dataObj.upper = dataObj.tempupper
      }

      if (isNaN(Number(dataObj.upper))) {
        ElMessage.error(_t('下限请输入数字！'))
        dataObj.templower = dataObj.lower
      } else {
        dataObj.lower = dataObj.templower
      }
      drawLine()
    }
    watch(
      () => props.visible,
      async (val) => {
        if (!val) {
          return
        }
        if (props.from) {
          dataObj.From = props.from
        } else {
          dataObj.From = getDate(
            new Date(new Date().toLocaleDateString()).getTime() -
              24 * 60 * 60 * 1000 * 7
          )
        }

        if (props.to) {
          dataObj.To = props.to
        } else {
          dataObj.To = getDate(
            new Date(new Date().toLocaleDateString()).getTime() +
              24 * 60 * 60 * 1000 -
              1
          )
        }

        await getproductListFn(true)
        await getProcessrouteFn()
        await getCurveFn()
        await drawLine()
      },
      {
        deep: true,
      }
    )

    return {
      local,
      _t,
      productList,
      getproductListFn,
      worksectionList,
      submit,
      drawLine,
      getDate,
      dataObj,
      tableHeader,
      curveList,
      getCurveFn,
      checkNum,
      getProcessrouteFn,
      getParams,
      tableLimit,
    }
  },
})
</script>

<style lang="scss">
@import url(@/assets/styles/common.scss);
</style>

<style lang="scss">
:deep(.cs-input) {
  height: 28px;

  .cs-input__inner {
    border-radius: 2px;
    background-color: #fff !important;
    height: 100%;
    padding: 0 8px;

    &:focus {
      border: 1px solid #409eff;
    }

    &:hover {
      border: 1px solid #409eff;
    }
  }

  .cs-input__inner:not(el-overwrite-ignore *) {
    padding-right: 0 !important;
  }
}

:deep(.light-datetime-picker) {
  .cs-input__inner {
    padding: 0 0 0 30px !important;
  }
}

.ProcessParameterCurveEdit-el-dialog {
  .cs-dialog__header {
    margin-right: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 20px;
    font-size: 15px !important;
    font-weight: 400;
    color: #35363b;

    .cs-dialog__title {
      color: #333333 !important;
    }

    .cs-dialog__headerbtn {
      top: 0;

      .cs-icon {
        width: 36px;
        height: 36px;
        color: #fff;
        margin-top: 6px;

        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .cs-dialog__body {
    background-color: #fff;
    padding: 0;
  }
}
</style>

<style lang="scss" scoped>
@import '../styles/input.scss';

:deep(.--scms-input.cs-input .cs-input__inner) {
  height: 30px;
  line-height: 30px;
  background: transparent;
  color: #787878;
  border-radius: 2px;
  box-shadow: 0px 0px 0px 1px #fff inset;
  border: 1px solid #dde0e4;

  &:focus {
    border: 1px solid #409eff;
  }

  &:hover {
    border: 1px solid #409eff;
  }
}

.ProcessParameterCurveEdit-el-dialog {
  .ProcessParameterCurve-content {
    padding: 0 30px 0;

    .ProcessParameterCurve-search {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;

      .form-key {
        margin: 0 5px;
        word-break: keep-all;
      }

      .search-btn {
        padding: 0 16px;
        height: 26px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-left: 10px;
        word-break: keep-all;
      }
    }

    .ProcessParameterCurve-table {
      width: 100%;
      height: 500px;
      margin-bottom: 16px;
      position: relative;
      background: #fcfcfc;
      border-radius: 5px;
      border: 1px solid #cfcfcf;

      .myChart {
        width: 100%;
        height: 100%;
      }

      .ProcessParameterCurve-limit {
        position: absolute;
        left: 50%;
        top: 5px;
        transform: translate(-50%, 0);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;

        .limit-input {
          width: 100px;
          margin-right: 16px;
          padding: 0;

          :deep(.cs-input__inner) {
            padding-right: 0 !important;
          }
        }

        .save {
          width: 60px;
          height: 26px;
          background: #ffffff;
          border-radius: 5px;
          border: 1px solid #cccccc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }

      .restore {
        position: absolute;
        right: 20px;
        top: 5px;
        width: 60px;
        height: 26px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
      }
    }
  }

  .ProcessParameterCurve-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0 20px 16px;
    box-sizing: border-box;
  }
}
</style>
