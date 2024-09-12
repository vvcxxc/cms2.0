import { defineComponent } from 'vue'
import styles from './BasicRuleSettings.module.scss'
import { useBasicRuleSettings } from '../../../Controllers/BasicRuleSettings'

import { _t } from '../../../app'
import BaseTable from '@/components/Table/Table'
export default defineComponent({
  name: '基础规则设置',
  setup(props, ctx) {
    const {
      dataObj,
      tableRef,
      dataSource,
      column,
      resetData1,
      saveData1,
      saveData2,
    } = useBasicRuleSettings(props, ctx)
    /**
     * @returns 表格
     */

    return () => {
      return (
        <div class={styles.basicRuleSettings}>
          <div class={styles.settingSearch}>
            <div class={styles.searchTitle}>判异规则设置</div>
            <div class={styles.searchBtn}>
              <div class={styles.recoverBtn} onClick={resetData1}>
                恢复默认
              </div>
              <div class={styles.saveBtn} onClick={saveData1}>
                保存
              </div>
            </div>
          </div>
          <div class={styles.settingTable}>
            <BaseTable
              autoFirstClickRow
              ref={tableRef}
              v-model:dataSource={dataSource.value}
              columns={column.value}
              isHidePagination={true}
              v-slots={{
                standardAnomalyRule: ({ row }: any) => {
                  return row.standardAnomalyRuleList.map((item: any) => {
                    const b = ['N', 'M', 'A', 'B', 'C'].includes(item)
                    return (
                      <span
                        style={{
                          color: b ? '#5A84FF' : 'inherit',
                          fontWeight: b ? 'bold' : 'inherit',
                        }}
                      >
                        {item}
                      </span>
                    )
                  })
                },
                nValue: ({ row }: any) => {
                  return (
                    <el-input
                      type="number"
                      v-model={row.nValue}
                      placeholder="请输入"
                    />
                  )
                },
                mValue: ({ row }: any) => {
                  return row.mValue === null ? (
                    '-'
                  ) : (
                    <el-input
                      type="number"
                      v-model={row.mValue}
                      placeholder="请输入"
                    />
                  )
                },
              }}
            />
          </div>

          <div class={styles.settingSearch}>
            <div class={styles.searchTitle}>实时监控时间范围</div>
            <div class={styles.searchBtn}>
              <div class={styles.saveBtn} onClick={saveData2}>
                保存
              </div>
            </div>
          </div>
          <div class={styles.rangeList}>
            <div class={styles.rangeInput}>
              最近时间：近
              <el-input
                style="width: 100px;padding: 0 5px;"
                type="number"
                v-model={dataObj.timeRange}
                placeholder="请输入"
              />
              小时
            </div>
          </div>
        </div>
      )
    }
  },
})
