import { defineComponent } from 'vue'
import type { Ref } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './Station.module.scss'
import { useStation } from '../../../Controllers/Station'
import IconButton from '@/components/IconButton/IconButton'
import { CaretBottom } from '@element-plus/icons-vue'
import Tag from '@/components/Tag/Tag'
import StationDrawer from '../Dialog/StationDrawer/StationDrawer'
import ProcessSettingDialog from '../Dialog/ProcessSettingDialog/ProcessSettingDialog'
import BatchConfigurationDialog from '../Dialog/BatchConfigurationDialog/BatchConfigurationDialog'
import TableFilter from '@/components/TableFilter/TableFilter'
import Search from '@/components/Search/Search'
import TdButton from '@/components/TdButton/TdButton'
import { vPermission } from '@/libs/Permission/Permission'
import { _t, LanguageScopeKey } from '../../../app'

interface RenderTableType {
  url?: string
  dataSource: Ref<any[]>
  isDrag?: boolean
  isChecked?: boolean
  isHidePagination?: boolean
  isGroup?: boolean
  params?: Record<string, any>
  autoHeight?: boolean
  LanguageScopeKey?: string
}

export default defineComponent({
  name: '工位管理',
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    const {
      dataSource,
      contextMenu,
      headData,
      dialogConfig,
      dialogSettingConfig,
      dialogBatchConfig,
      tableRef,
      search,
      sort,
      groupKeyMap,
      headers,
      dataSourceMap,
      columns,
      onBeforeUpload,
      onError,
      onSuccess,
      onGroupChange,
      onSearch,
      onExport,
      onBatchConfirm,
      onCheck,
      onAddProcess,
      onDrawerConfirm,
      openDetail,
      onBeforeLoad,
    } = useStation(props, ctx)

    /**
     * @returns 表格
     */
    const RenderBaseTable = (props: RenderTableType) => {
      const {
        url,
        dataSource,
        isDrag,
        isChecked,
        isHidePagination,
        isGroup,
        params,
        autoHeight,
        LanguageScopeKey,
      } = props
      return (
        <div
          class={{
            [styles.stationList]: !isGroup,
            [styles.groupTable]: isGroup,
          }}
        >
          <BaseTable
            ref={tableRef}
            LanguageScopeKey={LanguageScopeKey}
            url={url}
            sortUrlTpl="/api/v1/processmanagement/workstation/{id}/adjustsort/{sort}"
            v-model:dataSource={dataSource.value}
            columns={columns.value}
            contextMenu={contextMenu}
            pageSize={200}
            isDrag={isDrag}
            isChecked={isChecked}
            autoHeight={autoHeight}
            onCheck={onCheck}
            onBeforeLoad={onBeforeLoad}
            isHidePagination={isHidePagination}
            height={isGroup ? 'auto' : ''}
            v-slots={{
              name: ({ row }: any) => {
                return row?.name ? (
                  <TdButton
                    onClick={() => openDetail(row)}
                    text={<span style="color:#5a84ff">{_t('详情')}</span>}
                    icon="scale"
                    hover
                  >
                    {row?.name}
                  </TdButton>
                ) : (
                  '-'
                )
              },
              workSection: ({ row }: any) => {
                return row.workSection?.name ? (
                  <div class={styles.tagBox} title={row.workSection?.name}>
                    {row.workSection?.name}
                  </div>
                ) : (
                  '-'
                )
              },
              updateCodeVariable: ({ row }: any) => {
                return row.updateCodeVariable ? (
                  <div class={styles.tagBox}>{row.updateCodeVariable}</div>
                ) : (
                  '-'
                )
              },
              sopVariable: ({ row }: any) => {
                return row.sopVariable ? <Tag>{row.sopVariable}</Tag> : '-'
              },
              flowDefinitions: ({ row }: any) => {
                const flowDefinitions = row.workSection?.flowDefinitions
                if (!flowDefinitions || flowDefinitions.length === 0) {
                  return '-'
                }
                return <Tag data={flowDefinitions} max={2} showTip={true}></Tag>
              },
            }}
          ></BaseTable>
        </div>
      )
    }
    return () => {
      return (
        <div class={styles.stationContent}>
          {/* 批量配置 */}
          <BatchConfigurationDialog
            v-model:visible={dialogBatchConfig.visible}
            //@ts-ignore
            onConfirm={onBatchConfirm}
          />
          {/* 添加/编辑 */}
          <StationDrawer
            v-model={dialogConfig.visible}
            title={dialogConfig.title}
            //@ts-ignore
            row={dialogConfig.row}
            sort={sort.value}
            onConfirm={onDrawerConfirm}
          />

          <ProcessSettingDialog
            v-model={dialogSettingConfig.visible}
            title={dialogSettingConfig.title}
          />
          <div class={styles.headerContent}>
            <div class={styles.header}>
              <IconButton
                v-permission="workStation-add"
                icon="add-p"
                onClick={onAddProcess}
                type="primary"
                status="add"
              >
                {_t('添加工位')}
              </IconButton>
              <el-divider direction="vertical" />

              {!headData.group ? (
                <TableFilter
                  v-permission="workStation-filter"
                  text={_t('添加条件')}
                  columns={columns.value}
                  tableRef={tableRef}
                >
                  <IconButton icon="f"> {_t('筛选')} </IconButton>
                </TableFilter>
              ) : null}
              <IconButton
                v-permission="workStation-group"
                popoverWidth={250}
                v-slots={{
                  content: () => {
                    return (
                      <div class={styles.group}>
                        {_t('分组条件')}：
                        <el-select
                          v-model={headData.group}
                          style="width: 140px"
                          clearable
                          suffix-icon={
                            <span class={styles.iconGroup}>
                              <el-icon>
                                <CaretBottom />
                              </el-icon>
                            </span>
                          }
                          placeholder={` ${_t('分组条件')}：`}
                          onChange={onGroupChange}
                        >
                          <el-option label={_t('所属工序')} value={1} />
                        </el-select>
                      </div>
                    )
                  },
                }}
                icon="g"
              >
                {_t('分组')}
              </IconButton>
              <IconButton
                icon="batch-b"
                v-permission="workStation-batch-config"
                onClick={() => (dialogBatchConfig.visible = true)}
              >
                {_t('批量配置')}
              </IconButton>

              <el-upload
                v-permission="workStation-import"
                name="file"
                accept=".xlsx"
                show-file-list={false}
                action="/api/v1/processmanagement/workstation/import"
                headers={headers.value}
                onError={onError}
                onSuccess={onSuccess}
                before-upload={onBeforeUpload}
              >
                <IconButton icon="in"> {_t('导入')}</IconButton>
              </el-upload>
              <IconButton
                v-permission="workStation-output"
                icon="out"
                onClick={onExport}
              >
                {_t('导出')}
              </IconButton>
            </div>
            <Search
              placeholder={_t('请输入关键字')}
              v-model={search.value}
              onConfirm={onSearch}
              style={{ marginTop: '-1px' }}
            />
          </div>

          {!headData.group ? (
            <RenderBaseTable
              url="/api/v1/processmanagement/workstation"
              LanguageScopeKey={LanguageScopeKey}
              dataSource={dataSource}
              isChecked={true}
              isDrag={true}
              isGroup={false}
            />
          ) : (
            <div
              class={{
                [styles.overBox]: true,
              }}
            >
              <el-collapse size="small" modelValue={Object.keys(groupKeyMap)}>
                {Object.keys(dataSourceMap.value).map((key: string, index) => {
                  const data = dataSourceMap.value[key]
                  const dataSource: any = data.value ? data : { value: data }
                  return (
                    <el-collapse-item
                      title={groupKeyMap[key]?.name}
                      name={groupKeyMap[key]?.id}
                      style={{ marginBottom: '10px' }}
                    >
                      <RenderBaseTable
                        LanguageScopeKey={LanguageScopeKey}
                        dataSource={dataSource}
                        isChecked={true}
                        isDrag={false}
                        isGroup={true}
                        isHidePagination={true}
                        autoHeight={true}
                      />
                    </el-collapse-item>
                  )
                })}
              </el-collapse>
            </div>
          )}
        </div>
      )
    }
  },
})
