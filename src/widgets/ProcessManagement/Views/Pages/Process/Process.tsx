import { ref, defineComponent, computed, PropType, Fragment, watch } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/Table/Table'
import styles from './Process.module.scss'
import { useProcess } from '../../../Controllers/Process'
import IconButton from '@/components/IconButton/IconButton'
import Icon from '@/components/Icon/Icon'
import { CaretBottom } from '@element-plus/icons-vue'
import SearchInput from '@/components/SearchInput/SearchInput'
import Tag from '@/components/Tag/Tag'
import ProcessDrawer from '../Dialog/ProcessDrawer/ProcessDrawer'
import ProcessSettingDialog from '../Dialog/ProcessSettingDialog/ProcessSettingDialog'
import TableFilter from '@/components/TableFilter/TableFilter'
import Search from '@/components/Search/Search'
import { columns } from './Config'
import { useGlobalState } from '@/libs/Store/Store'
import TdButton from '@/components/TdButton/TdButton'
import { vPermission, vEditionShow } from '@/libs/Permission/Permission'
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
}

export default defineComponent({
  name: '工序管理',
  directives: {
    permission: vPermission,
    editionShow: vEditionShow,
  },
  setup(props, ctx) {
    const { systemConfig } = useGlobalState()

    const {
      dataSource,
      contextMenu,
      headData,
      dialogConfig,
      dialogSettingConfig,
      tableRef,
      current,
      search,
      sort,
      dataSourceMap,
      groupKeyMap,
      headers,
      onError,
      onSearch,
      onRowClick,
      onConfirmWorkSection,
      onCheck,
      onAddProcess,
      onExport,
      onGroupChange,
      onBeforeLoad,
      openDetail,
      onSuccess,
      onBeforeUpload,
    } = useProcess(props, ctx)
    const processColumns = columns()

    /**
     * 产线结构 0 -工序工位 1- 产线的-工序工位
     */
    const productionLineStructure = computed(() => {
      const state: Ref<any> = systemConfig.state
      const structure = state.value.ProductionLineStructure
      return structure == 0
    })

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
      } = props

      return (
        <div
          class={{
            [styles.processList]: !isGroup,
            [styles.groupTable]: isGroup,
          }}
        >
          <BaseTable
            ref={tableRef}
            url={url}
            LanguageScopeKey={LanguageScopeKey}
            sortUrlTpl="/api/v1/processmanagement/worksection/{id}/adjustsort/{sort}"
            v-model:dataSource={dataSource.value}
            columns={processColumns.value}
            contextMenu={contextMenu}
            // params={params}
            isDrag={isDrag}
            isChecked={isChecked}
            autoHeight={autoHeight}
            onCheck={onCheck}
            onRowClick={onRowClick}
            onBeforeLoad={onBeforeLoad}
            height={isGroup ? 'auto' : ''}
            isHidePagination={isHidePagination}
            pageSize={200}
            v-slots={{
              name: ({ row }: any) => {
                return row?.name ? (
                  <TdButton
                    onClick={() => openDetail(row)}
                    text={<span style="color:#5a84ff">{_t('详情')}</span>}
                    icon="scale"
                    tip={row?.name}
                    hover
                  >
                    {row?.name}
                  </TdButton>
                ) : (
                  '-'
                )
              },
              segment: ({ row }: any) => {
                return row?.segment?.name ? (
                  <div class={styles.tagBox}>{row?.segment?.name}</div>
                ) : (
                  '-'
                )
              },
              flowDefinitions: ({ row }: any) => {
                const flowDefinitions = row.flowDefinitions
                if (!flowDefinitions || flowDefinitions.length === 0) {
                  return '-'
                }
                return (
                  <Tag
                    data={row.flowDefinitions || []}
                    max={2}
                    showTip={true}
                  ></Tag>
                )
              },
            }}
          ></BaseTable>
        </div>
      )
    }
    return () => {
      return (
        <div class={styles.processContent}>
          {/* 添加/编辑 */}
          <ProcessDrawer
            v-model={dialogConfig.visible}
            title={dialogConfig.title}
            //@ts-ignore
            row={current.value}
            sort={sort.value}
            onConfirm={onConfirmWorkSection}
          />
          <ProcessSettingDialog
            v-model={dialogSettingConfig.visible}
            title={dialogSettingConfig.title}
          />
          <div class={styles.headerContent}>
            <div class={styles.header}>
              <IconButton
                v-permission="workSection-add"
                icon="add-p"
                onClick={onAddProcess}
                status="add"
                type="primary"
              >
                {_t('添加工序')}
              </IconButton>
              <el-divider direction="vertical" />
              <IconButton
                v-permission="workSection-setting"
                onClick={() => (dialogSettingConfig.visible = true)}
                icon="s"
              >
                {_t('工序设置')}
              </IconButton>

              {!headData.group ? (
                <TableFilter
                  v-permission="workSection-filter"
                  tableRef={tableRef}
                  text={_t('添加条件')}
                  columns={processColumns.value}
                >
                  <IconButton icon="f">{_t('筛选')}</IconButton>
                </TableFilter>
              ) : null}
              <IconButton
                v-permission="workSection-group"
                popoverWidth={250}
                v-slots={{
                  content: () => {
                    return (
                      <div class={styles.group}>
                        {_t('分组条件')}:
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
                          placeholder={_t('分组条件')}
                          onChange={onGroupChange}
                        >
                          {!productionLineStructure.value ? (
                            <el-option label={_t('所属产线段')} value={1} />
                          ) : null}
                          <el-option label={_t('关联流程')} value={2} />
                        </el-select>
                      </div>
                    )
                  },
                }}
                icon="g"
              >
                {_t('分组')}
              </IconButton>
              <el-upload
                v-permission="workSection-import"
                name="file"
                accept=".xlsx,.xls,.csv"
                show-file-list={false}
                onError={onError}
                onSuccess={onSuccess}
                before-upload={onBeforeUpload}
                headers={headers.value}
                action="/api/v1/processmanagement/worksection/import"
              >
                <IconButton icon="in"> {_t('导入')}</IconButton>
              </el-upload>

              <IconButton
                v-permission="workSection-output"
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
              url="/api/v1/processmanagement/worksection"
              dataSource={dataSource}
              isChecked={true}
              isDrag={true}
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
                      style={{ marginBottom: '10px' }}
                      title={groupKeyMap[key]?.name}
                      name={key}
                    >
                      <RenderBaseTable
                        // url="/api/v1/processmanagement/worksection"
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
