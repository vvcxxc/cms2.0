import { defineComponent } from 'vue'
import styles from './StationBeatAnalysis.module.scss'
import { useStationBeatAnalysis } from '../../../Controllers/StationBeatAnalysis'

import DatePicker from '@/components/DatePicker/index.vue'
import { _t } from '../../../app'
import ChartItem from '../../Components/ChartItem/ChartItem'
import LineSetDialog from '../Dialog/LineSetDialog/LineSetDialog'
import { ChartList } from '../../../enum'
export default defineComponent({
  name: '工位节拍分析',
  setup(props, ctx) {
    const {
      dataObj,
      segmentList,
      workSectionList,
      prodList,
      clickChart,
      back,
      getData,
      getSubData,
    } = useStationBeatAnalysis(props, ctx)
    /**
     * @returns 表格
     */

    return () => {
      return (
        <div class={styles.stationBeatAnalysis}>
          <div class={styles.header2}>
            <div class={styles.headerLeft2}>
              {dataObj.isWorkStation ? _t('工位详情分析') : _t('产线整体概况')}
            </div>
          </div>
          <div class={styles.header}>
            {!dataObj.isWorkStation ? (
              <div class={styles.headerLeft}>
                {_t('产线段')}
                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  clearable={false}
                  onChange={getData}
                  v-model={dataObj.segmentId}
                  disabled={dataObj.segmentType == '0' || dataObj.realTime}
                >
                  {segmentList.value.map((item) => {
                    return (
                      <el-option label={item.name} value={item.id}></el-option>
                    )
                  })}
                </el-select>
                {_t('查询日期')}
                <DatePicker
                  v-model={dataObj.date}
                  type="date"
                  style="width: 180px;margin-left: 5px;margin-right: 20px;"
                  format="YYYY-MM-DD"
                  popper-class="light-datetime-picker"
                  class="light-datetime-picker"
                  onChange={getData}
                  clearable={false}
                  disabled={dataObj.realTime}
                ></DatePicker>
                <el-checkbox v-model={dataObj.realTime}>
                  {_t('实时模式（定时每分钟刷新当日数据）')}
                </el-checkbox>
              </div>
            ) : (
              <div class={styles.headerLeft}>
                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  v-model={dataObj.segmentId}
                  disabled={true}
                >
                  {segmentList.value.map((item) => {
                    return (
                      <el-option label={item.name} value={item.id}></el-option>
                    )
                  })}
                </el-select>

                {_t('查询日期')}
                <DatePicker
                  v-model={dataObj.subDate}
                  type="date"
                  style="width: 185px;margin-left: 5px;margin-right: 15px;"
                  format="YYYY-MM-DD"
                  popper-class="light-datetime-picker"
                  class="light-datetime-picker"
                  onChange={() => getSubData(false)}
                  clearable={false}
                ></DatePicker>
                {_t('分析工位')}
                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  clearable={false}
                  onChange={() => getSubData(false)}
                  v-model={dataObj.subWorkSectionId}
                >
                  {workSectionList.value.map((item) => {
                    return (
                      <el-option label={item.name} value={item.id}></el-option>
                    )
                  })}
                </el-select>
                {_t('产品型号')}
                <el-select
                  style="width: 185px;margin-left: 5px "
                  clearable={false}
                  onChange={() => getSubData(false)}
                  v-model={dataObj.subProdModel}
                >
                  <el-option label="所有" value=""></el-option>
                  {prodList.value.map((item) => {
                    return (
                      <el-option
                        label={item.model}
                        value={item.model}
                      ></el-option>
                    )
                  })}
                </el-select>
              </div>
            )}
            {!dataObj.isWorkStation ? (
              <div>
                <LineSetDialog
                  date={dataObj.date}
                  segmentId={dataObj.segmentId}
                  onClose={getData}
                />
              </div>
            ) : (
              <div class={styles.headerRight} onClick={back}>
                {_t('返回')}
              </div>
            )}
          </div>

          <div class={styles.banner} v-show={!dataObj.isWorkStation}>
            <div class={[styles.bannerItem, styles.dayProdNum]}>
              <div class={styles.tips}>{_t('当日产量（pcs）')}</div>
              <div class={styles.num}>{dataObj.dailyProduction}</div>
              <div class={styles.compareBox}>
                <div class={styles.compare}>
                  <div class={styles.compareText}>
                    {_t('上周同比')} {(dataObj.weekOverWeek * 100).toFixed(1)}%
                  </div>
                  <img
                    v-show={dataObj.weekOverWeek != 0}
                    class={styles.compareIcon}
                    src={
                      new URL(
                        `../../../../../assets/images/${
                          dataObj.weekOverWeek > 0
                            ? 'rise'
                            : dataObj.weekOverWeek < 0
                            ? 'fail'
                            : ''
                        }.png`,
                        import.meta.url
                      ).href
                    }
                  />
                </div>
                <div class={styles.compare}>
                  <div class={styles.compareText}>
                    {_t('昨日环比')} {(dataObj.dayOnDay * 100).toFixed(1)}%
                  </div>
                  <img
                    v-show={dataObj.dayOnDay != 0}
                    class={styles.compareIcon}
                    src={
                      new URL(
                        `../../../../../assets/images/${
                          dataObj.dayOnDay > 0
                            ? 'rise'
                            : dataObj.dayOnDay < 0
                            ? 'fail'
                            : ''
                        }.png`,
                        import.meta.url
                      ).href
                    }
                  />
                </div>
              </div>
            </div>
            <div class={styles.bannerItem2}>
              <div class={styles.label}>{_t('单位时间产量（pcs/h）')}</div>
              <div class={styles.val}>{dataObj.productionPerUnitTime}</div>
            </div>
            <div class={styles.bannerItem2}>
              <div class={styles.label}>{_t('平均生产节拍（s）')}</div>
              <div class={styles.val}>{dataObj.averageProductionRhythm}</div>
            </div>
            <div class={[styles.bannerItem, styles.datRate]}>
              <div class={styles.tips2}>{_t('当日完成率')}</div>
              <div class={styles.lineContent}>
                <div class={styles.lineBox}>
                  <div
                    class={styles.line}
                    style={{
                      width: `${dataObj.dailyCompletionRate}%`,
                    }}
                  ></div>
                </div>
                <div
                  class={styles.per}
                  style={{ left: `${dataObj.dailyCompletionRate}%` }}
                >
                  {dataObj.dailyCompletionRate}%
                </div>
              </div>
            </div>
          </div>

          <div class={styles.chart} v-show={dataObj.isWorkStation}>
            <div class={styles.chartItem}>
              <ChartItem
                isWorkStation={dataObj.isWorkStation}
                title=""
                chartType="chart"
                // @ts-ignore
                options={dataObj.chart7Option}
              />
            </div>
          </div>

          {ChartList.filter(
            (item) =>
              (item.belong == 'line' && !dataObj.isWorkStation) ||
              (item.belong == 'station' && dataObj.isWorkStation)
          ).map((item) => {
            return item ? (
              <div class={styles.chart}>
                <div class={styles.chartTitleList}>
                  {Object.keys(item.list).map((title: string) => (
                    <div
                      class={
                        item.current == title
                          ? styles.currentChartTitle
                          : styles.chartTitle
                      }
                      onClick={() => (item.current = title)}
                    >
                      {_t(title)}
                    </div>
                  ))}
                </div>
                <div
                  class={styles.chartItem}
                  style={{
                    paddingRight:
                      item.current == _t('产品加工周期分析') ? '600px' : '0px',
                  }}
                >
                  {item.current == _t('产品加工周期分析') ? (
                    <div class={styles.stationBox}>
                      {/* <div class={styles.limitBox}>
                        {_t('目标值')}
                        <el-input
                          type="number"
                          style="width: 100px;margin:0 10px"
                        />
                        {_t('上限值')}
                        <el-input
                          type="number"
                          style="width: 100px;margin:0 10px"
                        />
                        {_t('下限值')}
                        <el-input
                          type="number"
                          style="width: 100px;margin:0 10px"
                        />
                      </div> */}
                      <div class={styles.stationItem}>
                        {_t('样本数')}
                        <div class={styles.num}>{dataObj.sampleSize}</div>
                      </div>
                      <div class={styles.stationItem}>
                        {_t('平均值')}
                        <div class={styles.num}>{dataObj.average}</div>
                      </div>
                      <div class={styles.stationItem}>
                        {_t('最大值')}
                        <div class={styles.num}>{dataObj.max}</div>
                      </div>
                      <div class={styles.stationItem}>
                        {_t('最小值')}
                        <div class={styles.num}>{dataObj.min}</div>
                      </div>
                      <div class={styles.stationItem}>
                        {_t('极差值')}
                        <div class={styles.num}>{dataObj.range}</div>
                      </div>
                    </div>
                  ) : null}

                  <ChartItem
                    isWorkStation={dataObj.isWorkStation}
                    item={item}
                    title={item.current}
                    // @ts-ignore
                    chartType={item.list[item.current].type}
                    // @ts-ignore
                    options={dataObj[item.list[item.current].option]}
                    // @ts-ignore
                    columns={item.list[item.current].columns || ''}
                    // @ts-ignore
                    tableData={
                      item.list[item.current].type == 'table'
                        ? dataObj[item.list[item.current].tableData]
                        : []
                    }
                    tableUrl={item.list[item.current].tableUrl ?? ''}
                    dateTime={dataObj.subDate}
                    workSectionId={dataObj.subWorkSectionId}
                    productModel={dataObj.subProdModel}
                    // @ts-ignore
                    onCallback={clickChart}
                  />
                </div>
              </div>
            ) : null
          })}

          <div class={styles.chart} v-show={dataObj.isWorkStation}>
            <div class={styles.chartItem}>
              <ChartItem
                isWorkStation={dataObj.isWorkStation}
                title={_t('频数分布直方图')}
                chartType="chart"
                // @ts-ignore
                options={dataObj.chart9Option}
              />
            </div>
          </div>
        </div>
      )
    }
  },
})
