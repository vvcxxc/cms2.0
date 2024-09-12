import { defineComponent, Fragment } from 'vue'
import styles from './SPCOperationAnalysis.module.scss'
import { useSPCOperationAnalysis } from '../../../Controllers/SPCOperationAnalysis'
import DatePicker from '@/components/DatePicker/index.vue'
import { _t } from '../../../app'
import BaseTable from '@/components/Table/Table'
import ProcessDapabilityDescription from '../../Dialog/ProcessDapabilityDescription'
import ExplanationOfDiscriminatoryRules from '../../Dialog/ExplanationOfDiscriminatoryRules'
import SampleDataDetails from '../../Dialog/SampleDataDetails'
import SampleDataInput from '../../Dialog/SampleDataInput'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'SPC运行分析',
  setup(props, ctx) {
    const {
      dataObj,
      chartRef1,
      tableRef1,
      dataSource1,
      chartRef2,
      tableRef2,
      dataSource2,
      columns,
      chartRef3,
      checkitemconfigList,
      anomalyRuleSelectConfigList,
      productModelList,
      strategy,
      strategyArray,
      getData,
      saveSPCRunAnalysisFn,
      saveRunModes,
      openSampleDataDetails,
      openSampleDataInput,
      onChangeCheckitemconfig,
      saveAnomalyRuleSelectConfigFn,
      saveAbilityAnalyzeConfigFn,
      html2canvasFn,
    } = useSPCOperationAnalysis(props, ctx)
    /**
     * @returns 表格
     */

    return () => {
      return (
        <div class={styles.SPCOperationAnalysis} v-loading={dataObj.loading}>
          <div
            class={styles.operationAnalysis}
            id="operationAnalysis"
            style={{ height: dataObj.chartTab != 0 ? '100%' : 'fit-content' }}
          >
            <div class={styles.analysisSearch}>
              <div class={styles.searchLeft}>
                <div class={styles.searchKey}>检测项目</div>
                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  clearable={false}
                  v-model={dataObj.checkItemConfigId}
                  onChange={() => onChangeCheckitemconfig(false)}
                  v-show={dataObj.chartTab != 0}
                >
                  {checkitemconfigList.value.map((item: any) => {
                    return (
                      <el-option label={item.name} value={item.id}></el-option>
                    )
                  })}
                </el-select>
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.checkItemConfigName}
                </div>
                <div class={styles.searchKey}>产品型号</div>
                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  clearable={false}
                  v-model={dataObj.productModelName}
                  onChange={() => saveSPCRunAnalysisFn(false)}
                  v-show={dataObj.chartTab != 0}
                >
                  {productModelList.value.map((item: string) => {
                    return <el-option label={item} value={item}></el-option>
                  })}
                </el-select>
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.productModelName}
                </div>
                <div class={styles.searchKey}>子组大小</div>

                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  clearable={false}
                  v-model={dataObj.subGroupCapacity}
                  onChange={() => saveSPCRunAnalysisFn(false)}
                  v-show={dataObj.chartTab != 0}
                >
                  {strategyArray(strategy[dataObj.controlchartType] || []).map(
                    (item: any) => {
                      return <el-option label={item} value={item}></el-option>
                    }
                  )}
                </el-select>
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.subGroupCapacity}
                </div>
                <div class={styles.searchKey}>子组数量</div>
                <el-input
                  type="number"
                  style="width: 185px;"
                  v-model={dataObj.subGroupCount}
                  onBlur={() => saveSPCRunAnalysisFn(false)}
                  v-show={dataObj.chartTab != 0}
                />
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.subGroupCount}
                </div>
              </div>
              <div
                class={styles.searchRight}
                v-show={dataObj.chartTab != 0}
                onClick={html2canvasFn}
              >
                导出分析报告
              </div>
            </div>
            <div class={styles.analysisSearch}>
              <div class={styles.searchLeft}>
                <div class={styles.searchKey}>运行模式</div>
                <el-select
                  style="width: 185px;margin-left: 5px;margin-right: 5px;"
                  clearable={false}
                  v-model={dataObj.runModes}
                  onChange={saveRunModes}
                  v-show={dataObj.chartTab != 0}
                >
                  <el-option label="手动录入" value={1}></el-option>
                  <el-option label="历史查询" value={2}></el-option>
                  <el-option label="实时监控" value={3}></el-option>
                </el-select>
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.runModes == 1
                    ? '手动录入'
                    : dataObj.runModes == 2
                    ? '历史查询'
                    : '实时监控'}
                </div>

                {dataObj.runModes == 2 || dataObj.runModes == 3 ? (
                  <Fragment>
                    <div class={styles.searchKey}>查询时间</div>
                    <DatePicker
                      type="datetime"
                      style="width: 200px;"
                      format="YYYY-MM-DD HH:mm:ss"
                      popper-class="light-datetime-picker"
                      class="light-datetime-picker"
                      clearable={false}
                      v-model={dataObj.queryStartTime}
                      disabled={dataObj.runModes == 3}
                      onChange={() => saveSPCRunAnalysisFn(false)}
                      v-show={dataObj.chartTab != 0}
                    ></DatePicker>
                    <div
                      v-show={dataObj.chartTab == 0}
                      class={styles.exportShowVal}
                    >
                      {dayjs(dataObj.queryStartTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                    </div>
                    <div class={styles.searchKey}>~</div>
                    <DatePicker
                      type="datetime"
                      style="width: 200px;"
                      format="YYYY-MM-DD HH:mm:ss"
                      popper-class="light-datetime-picker"
                      class="light-datetime-picker"
                      clearable={false}
                      v-model={dataObj.queryEndTime}
                      disabled={dataObj.runModes == 3}
                      onChange={() => saveSPCRunAnalysisFn(false)}
                      v-show={dataObj.chartTab != 0}
                    ></DatePicker>
                    <div
                      v-show={dataObj.chartTab == 0}
                      class={styles.exportShowVal}
                    >
                      {dayjs(dataObj.queryEndTime).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )}
                    </div>
                    <div class={styles.searchKey}>取样方式</div>
                    <el-select
                      style="width: 185px;margin-left: 5px;margin-right: 5px;"
                      clearable={false}
                      v-model={dataObj.samplingMethod}
                      disabled={dataObj.runModes == 3}
                      onChange={() => saveSPCRunAnalysisFn(false)}
                      v-show={dataObj.chartTab != 0}
                    >
                      <el-option label="连续取样" value={1}></el-option>
                      <el-option label="随机取样" value={2}></el-option>
                    </el-select>
                    <div
                      v-show={dataObj.chartTab == 0}
                      class={styles.exportShowVal}
                    >
                      {dataObj.samplingMethod == 1 ? '连续取样' : '随机取样'}
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div class={styles.searchKey}>
                      取样方式：{dataObj.sampleRemark || '-'}
                    </div>

                    <div
                      class={styles.searchRight}
                      v-show={dataObj.chartTab != 0}
                      onClick={openSampleDataInput}
                    >
                      样本数据录入
                    </div>
                  </Fragment>
                )}
              </div>
              <div
                class={styles.searchRight}
                v-show={dataObj.chartTab != 0}
                onClick={openSampleDataDetails}
              >
                样本数据详情
              </div>
            </div>
            <div class={styles.chartTitleList} v-show={dataObj.chartTab != 0}>
              <div
                class={
                  dataObj.chartTab == 1
                    ? styles.currentChartTitle
                    : styles.chartTitle
                }
                onClick={() => {
                  dataObj.chartTab = 1
                }}
              >
                控制图
              </div>
              <div
                class={
                  dataObj.chartTab == 2
                    ? styles.currentChartTitle
                    : styles.chartTitle
                }
                onClick={() => {
                  dataObj.chartTab = 2
                }}
              >
                过程能力分析
              </div>
            </div>
            <div class={styles.analysiskey} v-show={dataObj.chartTab == 0}>
              控制图
            </div>

            <div
              class={styles.chartContent}
              style={{
                height: dataObj.chartTab == 0 ? '1000px' : 'calc(100% - 150px)',
              }}
              v-show={dataObj.chartTab == 1 || dataObj.chartTab == 0}
            >
              <div class={styles.chartCheck}>
                <div class={styles.checkKey}>判异规则选择:</div>
                {anomalyRuleSelectConfigList.value.map((item: any) => (
                  <el-checkbox
                    label={item.ruleCode}
                    value={item.ruleCode}
                    v-model={item.isSelected}
                    onChange={saveAnomalyRuleSelectConfigFn}
                  />
                ))}
                <div
                  v-show={dataObj.chartTab != 0}
                  class={styles.checkBtn}
                  onClick={() =>
                    (dataObj.explanationOfDiscriminatoryRulesShow = true)
                  }
                >
                  标准判异规则说明
                </div>
              </div>

              <div class={styles.chartList}>
                <div class={styles.chartLine}>
                  <div
                    class={styles.chartBox}
                    style={{
                      boxShadow:
                        dataObj.chartTab != 0
                          ? '0px 1px 10px 1px rgba(0, 0, 0, 0.16)'
                          : 'unset',
                      border:
                        dataObj.chartTab != 0
                          ? 'unset'
                          : '1px solid rgba(0, 0, 0, 0.16)',
                    }}
                  >
                    <div class={styles.title}>
                      {dataObj.meanValueAnalysisResult?.controlChartTitle}
                    </div>
                    <div class={styles.chart} ref={chartRef1}></div>
                  </div>
                  <div
                    class={styles.chartTable}
                    style={{
                      boxShadow:
                        dataObj.chartTab != 0
                          ? '0px 1px 10px 1px rgba(0, 0, 0, 0.16)'
                          : 'unset',
                      border:
                        dataObj.chartTab != 0
                          ? 'unset'
                          : '1px solid rgba(0, 0, 0, 0.16)',
                    }}
                  >
                    <div class={styles.title}>
                      {dataObj.meanValueAnalysisResult?.controlChartTitle}
                      -判异点详情
                    </div>

                    <div class={styles.table}>
                      <BaseTable
                        ref={tableRef1}
                        columns={columns.value}
                        v-model:dataSource={dataSource1.value}
                        isHidePagination={true}
                      />
                    </div>
                  </div>
                </div>
                <div class={styles.chartLine}>
                  <div
                    class={styles.chartBox}
                    style={{
                      boxShadow:
                        dataObj.chartTab != 0
                          ? '0px 1px 10px 1px rgba(0, 0, 0, 0.16)'
                          : 'unset',
                      border:
                        dataObj.chartTab != 0
                          ? 'unset'
                          : '1px solid rgba(0, 0, 0, 0.16)',
                    }}
                  >
                    <div class={styles.title}>
                      {dataObj.differenceValueAnalysisResult?.controlChartTitle}
                    </div>
                    <div class={styles.chart} ref={chartRef2}></div>
                  </div>
                  <div
                    class={styles.chartTable}
                    style={{
                      boxShadow:
                        dataObj.chartTab != 0
                          ? '0px 1px 10px 1px rgba(0, 0, 0, 0.16)'
                          : 'unset',
                      border:
                        dataObj.chartTab != 0
                          ? 'unset'
                          : '1px solid rgba(0, 0, 0, 0.16)',
                    }}
                  >
                    <div class={styles.title}>
                      {dataObj.differenceValueAnalysisResult?.controlChartTitle}
                      -判异点详情
                    </div>

                    <div class={styles.table}>
                      <BaseTable
                        ref={tableRef2}
                        columns={columns.value}
                        v-model:dataSource={dataSource2.value}
                        isHidePagination={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class={styles.analysiskey} v-show={dataObj.chartTab == 0}>
              过程能力分析
            </div>
            <div
              class={styles.chartContent}
              style={{
                height: dataObj.chartTab == 0 ? '850px' : 'calc(100% - 150px)',
              }}
              v-show={dataObj.chartTab == 2 || dataObj.chartTab == 0}
            >
              <div class={styles.chartCheck}>
                <div class={styles.checkKey}>规格设置：</div>
                <div class={styles.checkKey}>规格下限 LSL</div>
                <el-input
                  type="number"
                  style="width: 100px;"
                  v-model={dataObj.lslValue}
                  onBlur={saveAbilityAnalyzeConfigFn}
                  v-show={dataObj.chartTab != 0}
                />
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.lslValue}
                </div>
                <div class={styles.checkKey}>目标值</div>
                <el-input
                  type="number"
                  style="width: 100px;"
                  v-model={dataObj.targetValue}
                  onBlur={saveAbilityAnalyzeConfigFn}
                  v-show={dataObj.chartTab != 0}
                />
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.targetValue}
                </div>
                <div class={styles.checkKey}>规格上限 USL</div>
                <el-input
                  type="number"
                  style="width: 100px;"
                  v-model={dataObj.uslValue}
                  onBlur={saveAbilityAnalyzeConfigFn}
                  v-show={dataObj.chartTab != 0}
                />
                <div
                  v-show={dataObj.chartTab == 0}
                  class={styles.exportShowVal}
                >
                  {dataObj.uslValue}
                </div>
                <div
                  v-show={dataObj.chartTab != 0}
                  class={styles.checkBtn}
                  onClick={() =>
                    (dataObj.processDapabilityDescriptionShow = true)
                  }
                >
                  过程能力说明
                </div>
              </div>

              <div class={styles.chartFlex}>
                <div
                  class={styles.chartLeft}
                  style={{
                    boxShadow:
                      dataObj.chartTab != 0
                        ? '0px 1px 10px 1px rgba(0, 0, 0, 0.16)'
                        : 'unset',
                    border:
                      dataObj.chartTab != 0
                        ? 'unset'
                        : '1px solid rgba(0, 0, 0, 0.16)',
                  }}
                >
                  <div class={styles.chartFlexTitle}>数据分布图</div>
                  <div class={styles.chart} ref={chartRef3}></div>
                </div>
                <div class={styles.chartInfo}>
                  <div class={styles.infoUp}>
                    <div class={styles.infoItem}>
                      <div class={styles.itemTitle}>常量</div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>规格下限 LSL：</div>
                        <div class={styles.val}>{dataObj.constDto?.lsl}</div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>目标值：</div>
                        <div class={styles.val}>
                          {dataObj.constDto?.targetValue}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>规格上限 USL：</div>
                        <div class={styles.val}>{dataObj.constDto?.usl}</div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>子组大小：</div>
                        <div class={styles.val}>
                          {dataObj.constDto?.subGroupCapacity}
                        </div>
                      </div>
                    </div>
                    <div class={styles.infoItem}>
                      <div class={styles.itemTitle}>统计值</div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>样本数：</div>
                        <div class={styles.val}>
                          {dataObj.statisticalValue?.sampleCount}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>平均值：</div>
                        <div class={styles.val}>
                          {dataObj.statisticalValue?.meanValue}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}> 最大值：</div>
                        <div class={styles.val}>
                          {dataObj.statisticalValue?.maxValue}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>最小值：</div>
                        <div class={styles.val}>
                          {dataObj.statisticalValue?.minValue}
                        </div>
                      </div>
                    </div>
                    <div class={styles.infoItem}>
                      <div class={styles.itemTitle}>计算值</div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>标准差（组间）：</div>
                        <div class={styles.val}>
                          {dataObj.calculatedValue?.betweenGroupStaDev}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>标准差（组内）：</div>
                        <div class={styles.val}>
                          {dataObj.calculatedValue?.withinGroupStaDev}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>标准差（组间/组内）：</div>
                        <div class={styles.val}>
                          {dataObj.calculatedValue?.betweenToWithinGroupStaDev}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>标准差（整体）：</div>
                        <div class={styles.val}>
                          {dataObj.calculatedValue?.overallStaDev}
                        </div>
                      </div>
                    </div>
                    <div class={styles.infoItem}>
                      <div class={styles.itemTitle}>过程能力（组内）</div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>Cp：</div>
                        <div class={styles.val}>
                          {dataObj.withinGroupProcessCapability?.cp}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>CPL：</div>
                        <div class={styles.val}>
                          {dataObj.withinGroupProcessCapability?.cpl}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>CPU：</div>
                        <div class={styles.val}>
                          {dataObj.withinGroupProcessCapability?.cpu}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>Cpk：</div>
                        <div class={styles.val}>
                          {dataObj.withinGroupProcessCapability?.cpk}
                        </div>
                      </div>
                    </div>
                    <div class={styles.infoItem}>
                      <div class={styles.itemTitle}>过程能力（整体）</div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>Pp：</div>
                        <div class={styles.val}>
                          {dataObj.overallProcessCapabilityDto?.pp}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>PPL：</div>
                        <div class={styles.val}>
                          {dataObj.overallProcessCapabilityDto?.ppl}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>PPU：</div>
                        <div class={styles.val}>
                          {dataObj.overallProcessCapabilityDto?.ppu}
                        </div>
                      </div>
                      <div class={styles.itemLine}>
                        <div class={styles.key}>Ppk：</div>
                        <div class={styles.val}>
                          {dataObj.overallProcessCapabilityDto?.ppk}
                        </div>
                      </div>
                    </div>
                    <div class={styles.infoItem}>
                      <div class={styles.itemTitle}>过程能力（其他）</div>
                      {/* <div class={styles.itemLine}>
                        <div class={styles.key}>Ca：</div>
                        <div class={styles.val}>
                          {dataObj.otherProcessCapability?.ca}
                        </div>
                      </div> */}
                      <div class={styles.itemLine}>
                        <div class={styles.key}>Cpm：</div>
                        <div class={styles.val}>
                          {dataObj.otherProcessCapability?.cpm}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class={styles.infoDown}>
                    <div class={styles.downTitle}>性能</div>
                    <div class={styles.lineLabel}>
                      <div class={styles.x1}></div>
                      <div class={styles.x2}>实测</div>
                      <div class={styles.x2}>预期（组内）</div>
                      <div class={styles.x2}>预期（整体）</div>
                    </div>
                    <div class={styles.lineItem}>
                      <div class={styles.x1}>{'PPM  <  LSL：'}</div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmLessThanlsl?.actualMeasurement}
                      </div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmLessThanlsl?.withinGroupExpect}
                      </div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmLessThanlsl?.overallExpect}
                      </div>
                    </div>
                    <div class={styles.lineItem}>
                      <div class={styles.x1}>{'PPM  >  USL：'}</div>
                      <div class={styles.x2}>
                        {
                          dataObj.performance?.ppmGreaterThanlsl
                            ?.actualMeasurement
                        }
                      </div>
                      <div class={styles.x2}>
                        {
                          dataObj.performance?.ppmGreaterThanlsl
                            ?.withinGroupExpect
                        }
                      </div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmGreaterThanlsl?.overallExpect}
                      </div>
                    </div>
                    <div class={styles.lineItem}>
                      <div class={styles.x1}>{'PPM 合计：'}</div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmSummation?.actualMeasurement}
                      </div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmSummation?.withinGroupExpect}
                      </div>
                      <div class={styles.x2}>
                        {dataObj.performance?.ppmSummation?.overallExpect}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ProcessDapabilityDescription
              v-model={dataObj.processDapabilityDescriptionShow}
            />
            <ExplanationOfDiscriminatoryRules
              v-model={dataObj.explanationOfDiscriminatoryRulesShow}
            />
            <SampleDataDetails
              v-model={dataObj.sampleDataDetailsShow}
              checkItemConfigId={dataObj.checkItemConfigId}
              checkItemConfigName={dataObj.checkItemConfigName}
              runModes={dataObj.runModes}
            />
            <SampleDataInput
              v-model={dataObj.sampleDataInputShow}
              checkItemConfigId={dataObj.checkItemConfigId}
              checkItemConfigName={dataObj.checkItemConfigName}
              onClose={getData}
            />
          </div>
        </div>
      )
    }
  },
})
