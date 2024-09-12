import { ref, defineComponent, Fragment } from 'vue'
import type { Ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseTable from '@/components/Table/Table'
import styles from './Flow.module.scss'
import { useFlow } from '../../../Controllers/Flow'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import Icon from '@/components/Icon/Icon'
import Tag from '@/components/Tag/Tag'
import TableFilter from '@/components/TableFilter/TableFilter'
import Search from '@/components/Search/Search'
import Text from '@/components/Text/Text'
import TdButton from '@/components/TdButton/TdButton'
import { ObjectType } from '@/widgets/FlowManagement/enum'
import BatchConfigurationDialog from '@/widgets/ProcessManagement/Views/Pages/Dialog/BatchConfigurationDialog/BatchConfigurationDialog'
import {
  vPermission,
  vEditionShow,
  isEdition,
} from '@/libs/Permission/Permission'
import BaseDialog from '@/components/BaseDialog/index.vue'
import G6Flow from '@/components/G6Flow/G6Flow'
import { _t, LanguageScopeKey } from '../../../app'

export default defineComponent({
  name: '流程',
  directives: {
    permission: vPermission,
    editionShow: vEditionShow,
  },
  setup(props, ctx) {
    const {
      dataSource,
      tableRef,
      search,
      batchDialog,
      flowConfig,
      isFullscreen,
      isEdit,
      flowContentRef,
      flowHeight,
      G6FlowRef,
      onConfirmFlow,
      onBatchConfirm,
      onSearch,
      onBatchConfigure,
      onSelectWorkSection,
      onLookFlow,
      onEditFlow,
    } = useFlow(props, ctx)

    /**
     * @returns 表格
     */
    const RenderBaseTable = () => {
      return (
        <div class={styles.list}>
          <BaseTable
            ref={tableRef}
            url="/api/v1/flowmanagement/flowdefinition"
            v-model:dataSource={dataSource.value}
            LanguageScopeKey={LanguageScopeKey}
            columns={columns}
            v-slots={{
              name: ({ row }: any) => {
                return (
                  <TdButton
                    onClick={() => onBatchConfigure(row)}
                    icon="batch-list"
                    text={<span style="color:#5A84FF">{_t('批量配置')}</span>}
                    tip={row.name}
                    style={{ width: 'calc(100% - 100px)' }}
                    disabled={
                      row.associationObjects[0]?.objectType !==
                      ObjectType.WorkSection
                    }
                  >
                    {row.name}
                  </TdButton>
                )
              },
              type: ({ row }: any) => {
                return row.businessType.description || '-'
              },
              action: ({ row }: any) => {
                return (
                  <div class={styles.flex}>
                    <IconButton
                      style="font-size:14px"
                      size="small"
                      icon="look"
                      status
                      onClick={() => onLookFlow(row, row.type, row.name)}
                    >
                      {_t('查看')}
                    </IconButton>
                    {isEdition(['Q']) ? (
                      <IconButton
                        icon="design"
                        size="small"
                        status
                        style="font-size:14px"
                        onClick={() => onEditFlow(row, row.type, row.name)}
                      >
                        {_t('设计')}
                      </IconButton>
                    ) : (
                      ''
                    )}
                  </div>
                )
              },
              abilitys: ({ row }: any) => {
                const v = row.abilitys?.map(
                  (v: { description: string }) => v.description
                )
                const text = v?.length ? v.join('，') : '-'
                return (
                  <Text tip={text} truncated={true}>
                    {text}
                  </Text>
                )
              },
              associationObjects: ({ row }: any) => {
                return (
                  <div onClick={onSelectWorkSection} class={styles.object}>
                    {row?.associationObjects?.length ? (
                      <Tag data={row.associationObjects} showTip max={3} />
                    ) : (
                      '-'
                    )}
                  </div>
                )
              },
            }}
          ></BaseTable>
        </div>
      )
    }
    return () => {
      return (
        <div class={styles.content} ref={flowContentRef}>
          <BatchConfigurationDialog
            v-model:visible={batchDialog.visible}
            flowType={batchDialog.flowType}
            title={batchDialog.title}
            // @ts-ignore
            onConfirm={onBatchConfirm}
          />
          <BaseDialog
            width="80%"
            top="3%"
            v-model={flowConfig.visible}
            title={flowConfig.title}
            destroy-on-close
            fullscreen={isFullscreen.value}
            submitDisabled={!isEdit.value}
            onConfirm={onConfirmFlow}
            onClose={() => {
              flowConfig.visible = false
            }}
          >
            <div class={styles.g6Flow}>
              <G6Flow
                ref={G6FlowRef}
                height={isFullscreen.value ? flowHeight.value : undefined}
                flowType={flowConfig.flowType}
                isEdit={isEdit.value}
              />
            </div>
          </BaseDialog>
          <div class={styles.headerContent}>
            <div class={styles.header}>
              <TableFilter
                v-permission="flow-filter"
                tableRef={tableRef}
                text={_t('添加')}
                defaultOptions={[
                  {
                    label: _t('全部'),
                  },
                ]}
                columns={columns}
              >
                <IconButton icon="f" key={_t('筛选')}>
                  {_t('筛选')}
                </IconButton>
              </TableFilter>
            </div>
            <Search
              placeholder={_t('请输入流程名称')}
              v-model={search.value}
              onConfirm={onSearch}
            />
          </div>
          <RenderBaseTable />
        </div>
      )
    }
  },
})
