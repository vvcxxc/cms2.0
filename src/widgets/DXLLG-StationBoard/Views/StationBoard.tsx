import { defineComponent } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './StationBoard.module.scss'
import { useStationBoard } from '../Controllers/StationBoard'
import IconButton from '@/components/IconButton/IconButton'
import BatchMaterialFeeding from './Dialog/BatchMaterialFeeding'

export default defineComponent({
  setup(props, ctx) {
    const {
      carouselRef,
      myCarousel,
      materialTableRef,
      paramsTableRef,
      materialColumns,
      paramsColumns,
      dataObj,
      workType,
      unqualifiedReasonMap,
      worksectionList,
      workstationList,
      prodCodeInputsRef,
      materialInputsRef,
      paramsInputsRef,
      sopUrls,
      carouselHeight,
      checkNow,
      sopMap,
      setProdCodeValue,
      setMaterialVal,
      getWorkstationListFn,
      loginFn,
      getVariableValue,
      keydown,
      setParamsVal,
      exitFn,
      finishFn,
      rowStyle1,
      rowStyle2,
    } = useStationBoard(props, ctx)
    const LoginItem = () => {
      return (
        <div class={styles.loginBody} key="loginBody">
          <div class={styles.loginBox}>
            <div class={styles.loginTitle}>上岗登录</div>
            <div class={styles.formBox}>
              <div class={styles.formKey}>上岗工序</div>
              <el-select
                v-model={dataObj.loginWorksection}
                onChange={getWorkstationListFn}
              >
                {worksectionList.value.map((item: any) => (
                  <el-option
                    key={item.id}
                    label={item.name}
                    value={item.id}
                  ></el-option>
                ))}
              </el-select>
              <div class={styles.formKey}>上岗工位</div>
              <el-select v-model={dataObj.loginWorkstation}>
                {workstationList.value.map((item: any) => (
                  <el-option
                    key={item.id}
                    label={item.name}
                    value={item.id}
                  ></el-option>
                ))}
              </el-select>
              <div class={styles.formKey}>用户名</div>
              <el-input placeholder="请输入" v-model={dataObj.loginName} />
              <div class={styles.formKey}>密码</div>
              <el-input
                placeholder="请输入"
                v-model={dataObj.loginPass}
                type="password"
              />
              <div class={styles.loginBtn} onClick={loginFn}>
                登录
              </div>
            </div>
          </div>
        </div>
      )
    }
    const StationItem = () => {
      return (
        <div class={styles.stationBody} key="stationBody">
          <div class={styles.sop}>
            <div class={styles.contenter}>
              <div class={styles.label}>ESOP指导书</div>
              <div class={styles.carousel} ref={myCarousel}>
                <el-carousel
                  ref={carouselRef}
                  style={{
                    height: carouselHeight.value + 'px',
                    width: '100%',
                  }}
                  autoplay={false}
                  indicator-position={false}
                  loop={false}
                  arrow="click"
                  height={carouselHeight.value + 'px'}
                >
                  {sopUrls.value.map((e: any) => (
                    <el-carousel-item>
                      <embed
                        type="application/pdf"
                        style="width: 100%;  height: 100%"
                        src={e}
                      />
                    </el-carousel-item>
                  ))}
                </el-carousel>
              </div>
            </div>
          </div>
          <div class={styles.info}>
            <div class={styles.prod}>
              <div class={styles.contenter}>
                <div class={styles.label}>产品信息</div>
                <div class={styles.line}>
                  <div class={styles.key}>产品条码：</div>
                  <el-input
                    placeholder="请输入"
                    ref={prodCodeInputsRef.value}
                    style="width: 300px"
                    v-model={dataObj.prodCode}
                    onKeydown={keydown}
                    onBlur={setProdCodeValue}
                  />
                </div>
                <div class={styles.line}>
                  <div class={styles.key}>进站结果：</div>
                  <div class={styles.val1}>
                    <div
                      class={
                        getVariableValue(dataObj.inbound_ResultVariable) == 1
                          ? styles.greenLight
                          : styles.redLight
                      }
                    ></div>
                  </div>
                  <div class={styles.key}>异常原因：</div>
                  <div class={styles.val2}>
                    {getVariableValue(dataObj.inbound_Description)}
                  </div>
                </div>
                <div class={styles.line}>
                  <div class={styles.key}>加工类型：</div>
                  <div class={styles.val1}>{workType.value}</div>
                  <div class={styles.key} v-show={workType.value == '返修加工'}>
                    返修工序：
                  </div>
                  <div
                    class={styles.val2}
                    v-show={workType.value == '返修加工'}
                  >
                    {dataObj.repairSection}
                  </div>
                </div>
              </div>
            </div>
            <div class={styles.material}>
              <div
                class={styles.contenterBtn}
                onClick={() => (dataObj.batchMaterialFeedingShow = true)}
              >
                批次料上料
              </div>
              <div class={styles.contenter}>
                <div class={styles.label}>物料信息</div>
                <div class={styles.table}>
                  <BaseTable
                    ref={materialTableRef}
                    v-model:dataSource={dataObj.materialDto}
                    columns={materialColumns}
                    isHidePagination={true}
                    cellStyle={rowStyle1}
                    v-slots={{
                      barcodeVariable: ({ row, index }: any) => {
                        return row.materialType == '唯一料' ? (
                          <el-input
                            placeholder="请输入"
                            v-model={row.code}
                            ref={(ref: any) =>
                              (materialInputsRef.value[index] = ref)
                            }
                            onKeydown={keydown}
                            onBlur={() => setMaterialVal(row, index)}
                          />
                        ) : (
                          <span>{getVariableValue(row.barcodeVariable)}</span>
                        )
                      },
                      verificationResultSignal: ({ row }: any) => {
                        return (
                          <div
                            style={{
                              color:
                                getVariableValue(
                                  row.verificationResultSignal
                                ) == 1
                                  ? '#77A826'
                                  : '#D9001B',
                            }}
                          >
                            {getVariableValue(row.verificationResultSignal) == 1
                              ? 'OK'
                              : getVariableValue(
                                  row.verificationResultSignal
                                ) == 2
                              ? 'NG'
                              : ''}
                          </div>
                        )
                      },
                    }}
                  ></BaseTable>
                </div>
              </div>
            </div>
            <div class={styles.params}>
              <div class={styles.contenter}>
                <div class={styles.label}>过程参数信息</div>
                <div class={styles.table}>
                  <BaseTable
                    ref={paramsTableRef}
                    v-model:dataSource={dataObj.parameterDto}
                    columns={paramsColumns}
                    isHidePagination={true}
                    cellStyle={rowStyle2}
                    v-slots={{
                      lower: ({ row }: any) => {
                        return (
                          <span>
                            {row.lower == null ? '-' : String(row.lower)}
                          </span>
                        )
                      },
                      upper: ({ row }: any) => {
                        return (
                          <span>
                            {row.upper == null ? '-' : String(row.upper)}
                          </span>
                        )
                      },
                      targetValue: ({ row }: any) => {
                        return (
                          <span>
                            {row.targetValue == null
                              ? '-'
                              : String(row.targetValue)}
                          </span>
                        )
                      },
                      variable: ({ row, index }: any) => {
                        return (
                          <el-input
                            placeholder="请输入"
                            ref={(ref: any) =>
                              (paramsInputsRef.value[index] = ref)
                            }
                            v-model={row.code}
                            onKeydown={keydown}
                            onBlur={() => setParamsVal(row, index)}
                          />
                        )
                      },
                      judge: ({ row }: any) => {
                        return (
                          <el-select
                            v-model={row.judge}
                            placeholder="请选择"
                            v-slots={{
                              tag: () => (
                                <span
                                  style={{
                                    color:
                                      row.judge == 'OK' ? '#77A826' : '#D9001B',
                                  }}
                                >
                                  {row.judge}
                                </span>
                              ),
                            }}
                          >
                            <el-option label="OK" value="OK"></el-option>
                            <el-option label="NG" value="NG"></el-option>
                          </el-select>
                        )
                      },
                    }}
                  ></BaseTable>
                </div>
              </div>
            </div>
            <div class={styles.judge}>
              <div class={styles.contenter}>
                <div class={styles.label}>加工结果判定</div>
                <div class={styles.line}>
                  <div class={styles.key}>加工结果:</div>
                  <el-radio-group v-model={dataObj.processingResults}>
                    <el-radio-button label="OK" value={1} />
                    <el-radio-button label="NG" value={2} />
                  </el-radio-group>
                </div>
                <div class={styles.line}>
                  <div class={styles.key}>不良原因:</div>
                  <div class={styles.ngReasonBox}>
                    <el-select v-model={dataObj.ngReason}>
                      {Object.keys(unqualifiedReasonMap.value)?.map(
                        (e: any) => (
                          <el-option
                            label={unqualifiedReasonMap.value[e]}
                            value={unqualifiedReasonMap.value[e]}
                          ></el-option>
                        )
                      )}
                    </el-select>
                  </div>
                </div>
                <div class={styles.submitLine}>
                  <div
                    class={styles.judgeBtn}
                    style={{
                      background: checkNow.value ? '#5d9ae6' : '#ededed',
                    }}
                    onClick={finishFn}
                  >
                    提交
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    //#endregion
    return () => {
      return (
        <div class={styles.content}>
          <div class={styles.header}>
            <div class={styles.left} v-show={dataObj.curWorkStation}>
              <IconButton icon="station" width={21} height={21} />
              {dataObj.workStationName}
            </div>

            <div class={styles.right} v-show={dataObj.curWorkStation}>
              <span style="margin: 0 18px">
                {dataObj.nowTime.date}
                <span style="margin: 0 8px"> {dataObj.nowTime.time}</span>
                {dataObj.nowTime.weekday}
              </span>
              <IconButton icon="user" width={21} height={21}>
                姓名：{dataObj.curName}
              </IconButton>
              <IconButton icon="exit" width={21} height={21} onClick={exitFn} />
            </div>
          </div>
          {dataObj.curWorkStation === '' ? <LoginItem /> : <StationItem />}
          <BatchMaterialFeeding
            v-model={dataObj.batchMaterialFeedingShow}
            dataSource={dataObj.materialDto}
            onClose={() => {}}
            onConfirm={() => {}}
          />
        </div>
      )
    }
  },
})
