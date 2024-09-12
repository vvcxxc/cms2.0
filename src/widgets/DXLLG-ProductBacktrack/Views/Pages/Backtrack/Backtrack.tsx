import { defineComponent } from 'vue'
import styles from './Backtrack.module.scss'
import IconButton from '@/components/IconButton/IconButton'
import { useBacktrack } from '../../../Controllers/Backtrack'
import Title from '../../Components/Title/Title'
import Parameter from '../../Components/Parameter/Parameter'
import Curve from '../../Components/Curve/Curve'
import ExportDialog from '../../Dialog/ExportDialog/ExportDialog'
import ExportSettingDialog from '../../Dialog/ExportSettingDialog/ExportSettingDialog'
import { vPermission } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '产品码回溯',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      filterForm,
      selectOption,
      traceData,
      getTraceData,
      onKeydown,
      onExport,
      exportPopShow,
      exportSettingPopShow,
      onOpenExport,
      onOpenSettingExport,
    } = useBacktrack(props)
    return () => {
      return (
        <div class={styles.Backtrack}>
          <div class={styles.header}>
            <div class={styles.leftForm}>
              {/* <Select v-model={filterForm.FilterType} class={styles.formSelect}>
                {selectOption.searchType.map((item) => {
                  return (
                    <el-option
                      label={item.label}
                      value={item.value}
                    ></el-option>
                  )
                })}
              </Select>
              <Select v-model={filterForm.searchMode} class={styles.formSelect}>
                {selectOption.searchMode.map((item) => {
                  return (
                    <el-option
                      label={item.label}
                      value={item.value}
                    ></el-option>
                  )
                })}
              </Select> */}
              <el-input
                v-model={filterForm.Filter}
                class={styles.formInput}
                onKeydown={onKeydown}
              />
              <el-button type="primary" onClick={getTraceData}>
                查询
              </el-button>
              <IconButton
                icon="out"
                v-permission="productBacktrack-export"
                onClick={onExport}
              >
                导出
              </IconButton>
              <IconButton
                icon="out"
                v-permission="productBacktrack-multExport"
                onClick={onOpenExport}
              >
                批量导出
              </IconButton>
              <IconButton
                icon="out"
                v-permission="productBacktrack-exportReport"
                onClick={onOpenSettingExport}
              >
                导出检验报告
              </IconButton>
            </div>
            {traceData.value && (
              <div class={styles.rightInfo}>
                <div class={`${styles.infoItem} ${styles.ngWorkSections}`}>
                  NG工序：
                  <span title={traceData.value.nG_WorkSections}>
                    {traceData.value.nG_WorkSections}
                  </span>
                </div>
                <div class={styles.infoItem}>
                  输入ID：{traceData.value.inputId}
                </div>
                {/* <div class={styles.infoItem}>
                  产品型号：{traceData.value.productModel}
                </div> */}
                <div class={styles.infoItem}>
                  是否合格：
                  <span
                    class={
                      traceData.value.isQualified === 'OK'
                        ? styles.ok
                        : styles.ng
                    }
                  >
                    {traceData.value.isQualified}
                  </span>
                </div>
              </div>
            )}
          </div>
          {traceData.value ? (
            <div class={styles.main}>
              {traceData.value.productTraceDetails?.map((item: any) => {
                return (
                  <div class={styles.stationItem}>
                    <div class={styles.stationLeft}>
                      <div class={styles.stationLabel}>
                        <div class={styles.label} title={item.workSectionName}>
                          {item.workSectionName}
                        </div>
                      </div>
                    </div>
                    <div class={styles.stationContent}>
                      <div class={styles.contentHeader}>
                        <div class={styles.contentHeaderLeft}>
                          <div class={styles.infoItem}>
                            产品ID：{item.serialNumber}
                          </div>
                          <div class={styles.infoItem}>
                            更新码：{item.updateCode}
                          </div>
                          <div class={styles.infoItem}>
                            是否合格：
                            <span
                              class={
                                item.isQualified === 'OK'
                                  ? styles.ok
                                  : styles.ng
                              }
                            >
                              {item.isQualified}
                            </span>
                          </div>
                          <div class={styles.infoItem}>
                            产品型号：
                            {item.productModel}
                          </div>
                        </div>
                        <div class={styles.contentHeaderRight}>
                          <div class={styles.infoItem}>
                            记录时间：{item.recordTime}
                          </div>
                        </div>
                      </div>
                      <div class={styles.contentItem}>
                        <Title title="过程参数" />
                        {item.productTraceProcessParameters?.length ? (
                          <Parameter
                            key={item.serialNumber}
                            processParameters={
                              item.productTraceProcessParameters
                            }
                          />
                        ) : (
                          <el-empty description="暂无数据" image-size={100} />
                        )}
                      </div>
                      {/* <div class={styles.contentItem}>
                        <Title title="曲线图片" />
                        {item.productTraceCurves?.length ||
                        item.productTraceImages?.length ? (
                          <Curve
                            key={item.serialNumber}
                            traceCurves={item.productTraceCurves}
                            picList={item.productTraceImages}
                          />
                        ) : (
                          <el-empty description="暂无数据" image-size={100} />
                        )}
                      </div> */}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <el-empty description="暂无数据" image-size={100} />
          )}
          <ExportDialog v-model={exportPopShow.value} />
          <ExportSettingDialog
            v-model={exportSettingPopShow.value}
            traceData={traceData.value}
          />
        </div>
      )
    }
  },
})
