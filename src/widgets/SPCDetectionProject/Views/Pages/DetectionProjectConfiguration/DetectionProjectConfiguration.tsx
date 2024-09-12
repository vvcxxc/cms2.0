import { defineComponent } from 'vue'
import styles from './DetectionProjectConfiguration.module.scss'
import { useDetectionProjectConfiguration } from '../../../Controllers/DetectionProjectConfiguration'
import IconButton from '@/components/IconButton/IconButton'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
import DataPreview from '../../Dialog/DataPreview/DataPreview'
import ControlChartSelect from '../../Dialog/ControlChartSelect/ControlChartSelect'
import Text from '@/components/Text/Text'

export default defineComponent({
  name: '检测项目配置',
  setup(props, ctx) {
    const {
      dataObj,
      tableRef1,
      dataSource1,
      tableRef2,
      dataSource2,
      column2,
      column1,
      tableDataTreeList,
      controlchartTypeList,
      getData1,
      saveData1,
      onCheck1,
      onRowClick1,
      onCheck2,
      onRowClick2,
      onOpenControlChartSelect,
      onOpenDataPreview,
      selectVariable,
      visibleChange,
      controlChartSelectCallBack,
      onAdd1,
      onDel1,
      changeDataTable,
    } = useDetectionProjectConfiguration(props, ctx)
    /**
     * @returns 表格
     */

    return () => {
      return (
        <div class={styles.DetectionProjectConfiguration}>
          <div class={styles.configurationItem}>
            <div class={styles.itemTitle}>检测项目配置（计量型）</div>
            <div class={styles.itemSearh}>
              <div class={styles.itemBtnList}>
                <IconButton icon="add-p" type="primary" onClick={onAdd1}>
                  添加
                </IconButton>
                <IconButton icon="delete" onClick={onDel1}>
                  删除
                </IconButton>
              </div>
              <div class={styles.rightList}>
                <Search v-model={dataObj.filter1} onConfirm={getData1} />
                <div class={styles.save} onClick={saveData1}>
                  保存
                </div>
              </div>
            </div>
            <div class={styles.itemTable}>
              <BaseTable
                autoFirstClickRow
                ref={tableRef1}
                v-model:dataSource={dataSource1.value}
                columns={column1.value}
                isHidePagination={true}
                isDrag={true}
                isChecked={true}
                onCheck={onCheck1}
                onRowClick={onRowClick1}
                v-slots={{
                  name: ({ row }: any) => <el-input v-model={row.name} />,
                  controlchartType: ({ row }: any) => (
                    <div class={styles.flex}>
                      {row.controlchartType ? (
                        <div
                          class={
                            styles[
                              controlchartTypeList[row.controlchartType] || ''
                            ]
                          }
                        >
                          {controlchartTypeList[row.controlchartType]}
                        </div>
                      ) : (
                        <div></div>
                      )}
                      <div
                        class={styles.preview}
                        onClick={() => onOpenControlChartSelect(row, '计量型')}
                      >
                        选择
                      </div>
                    </div>
                  ),
                  dataTableName: ({ row }: any) => (
                    <div class={styles.flex}>
                      <div class={styles.treeSelect}>
                        <el-tree-select
                          class={styles.ConfigurationSelect}
                          popper-class={styles.ConfigurationSelect}
                          v-model={row.dataTableId}
                          node-key="id"
                          data={tableDataTreeList.value}
                          props={{
                            children: 'children',
                            label: 'name',
                            id: 'id',
                          }}
                          render-after-expand={false}
                          onChange={() => changeDataTable(row)}
                        />
                      </div>
                      <div
                        class={styles.preview2}
                        onClick={() => onOpenDataPreview(row)}
                      >
                        预览
                      </div>
                    </div>
                  ),
                  checkDataFieldName: ({ row }: any) => (
                    <el-select
                      v-model={row.checkDataFieldId}
                      onVisibleChange={(visible: boolean) =>
                        visible && visibleChange(row)
                      }
                      loading={dataObj.loading}
                    >
                      {row.dataSelectList.map((item: any) => {
                        return (
                          <el-option
                            label={item.fieldName}
                            value={item.id}
                          ></el-option>
                        )
                      })}
                    </el-select>
                  ),
                  recordTimeFieldName: ({ row }: any) => (
                    <el-select
                      v-model={row.recordTimeFieldId}
                      onVisibleChange={(visible: boolean) =>
                        visible && visibleChange(row)
                      }
                      loading={dataObj.loading}
                    >
                      {row.dataSelectList.map((item: any) => {
                        return (
                          <el-option
                            label={item.fieldName}
                            value={item.id}
                          ></el-option>
                        )
                      })}
                    </el-select>
                  ),
                  productModelFieldName: ({ row }: any) => (
                    <el-select
                      v-model={row.productModelFieldId}
                      onVisibleChange={(visible: boolean) =>
                        visible && visibleChange(row)
                      }
                      loading={dataObj.loading}
                    >
                      {row.dataSelectList.map((item: any) => {
                        return (
                          <el-option
                            label={item.fieldName}
                            value={item.id}
                          ></el-option>
                        )
                      })}
                    </el-select>
                  ),
                  productBarCodeFieldName: ({ row }: any) => (
                    <el-select
                      v-model={row.productBarCodeFieldId}
                      onVisibleChange={(visible: boolean) =>
                        visible && visibleChange(row)
                      }
                      loading={dataObj.loading}
                    >
                      {row.dataSelectList.map((item: any) => {
                        return (
                          <el-option
                            label={item.fieldName}
                            value={item.id}
                          ></el-option>
                        )
                      })}
                    </el-select>
                  ),
                  cpkRealtimeDeliveryVariableName: ({ row }: any) => (
                    <div class={styles.flex}>
                      <Text
                        tip={row.cpkRealtimeDeliveryVariableName}
                        truncated={true}
                        class={styles.varSelect}
                      >
                        {row.cpkRealtimeDeliveryVariableName}
                      </Text>
                      <div
                        class={styles.preview3}
                        onClick={() =>
                          selectVariable(row, 'cpkRealtimeDeliveryVariableName')
                        }
                      >
                        关联
                      </div>
                    </div>
                  ),
                  anomalyRealTimeDeliveryVariableName: ({ row }: any) => (
                    <div class={styles.flex}>
                      <Text
                        tip={row.anomalyRealTimeDeliveryVariableName}
                        truncated={true}
                        class={styles.varSelect}
                      >
                        {row.anomalyRealTimeDeliveryVariableName}
                      </Text>
                      <div
                        class={styles.preview3}
                        onClick={() =>
                          selectVariable(
                            row,
                            'anomalyRealTimeDeliveryVariableName'
                          )
                        }
                      >
                        关联
                      </div>
                    </div>
                  ),
                }}
              />
            </div>
          </div>

          {/* <div class={styles.configurationItem}>
            <div class={styles.itemTitle}>检测项目配置（计数型）</div>
            <div class={styles.itemSearh}>
              <div class={styles.itemBtnList}>
                <IconButton icon="add-p" type="primary">
                  添加
                </IconButton>
                <IconButton icon="delete">删除</IconButton>
                <IconButton
                  icon="iconSelect"
                  onClick={() => onOpenDataPreview(null)}
                >
                  数据预览
                </IconButton>
              </div>
              <div class={styles.rightList}>
                <Search />
                <div class={styles.save}>保存</div>
              </div>
            </div>
            <div class={styles.itemTable}>
              <BaseTable
                autoFirstClickRow
                ref={tableRef2}
                v-model:dataSource={dataSource2.value}
                columns={column2.value}
                isHidePagination={true}
                isDrag={true}
                isChecked={true}
                onCheck={onCheck2}
                onRowClick={onRowClick2}
                v-slots={{
                  name: ({ row }: any) => <el-input v-model={row.name} />,
                }}
              />
            </div>
          </div> */}
          <DataPreview
            v-model={dataObj.dataPreviewVisible}
            rowData={dataObj.dataPreviewSelectRow}
            onConfirm={getData1}
          />
          <ControlChartSelect
            v-model={dataObj.controlChartSelectVisible}
            rowData={dataObj.controlChartSelectRow}
            controlChartSelectType={dataObj.controlChartSelectType}
            onConfirm={controlChartSelectCallBack} //没考虑计数型
          />
        </div>
      )
    }
  },
})
