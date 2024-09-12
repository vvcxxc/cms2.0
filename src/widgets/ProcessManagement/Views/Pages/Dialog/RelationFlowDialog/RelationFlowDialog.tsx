import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './RelationFlowDialog.module.scss'
import { useRelationFlow } from '@/widgets/ProcessManagement/Controllers/Dialog'
import { _t, LanguageScopeKey } from '../../../../app'
import BaseTable from '@/components/Table/Table'
import { relationFlowColumns } from '../../../../enum'
import Search from '@/components/Search/Search'
import Tag from '@/components/Tag/Tag'
import Text from '@/components/Text/Text'

export default defineComponent({
  name: '关联流程',
  props: {
    modelValue: {
      type: Array,
      default: [],
    },
    visible: {
      type: Boolean,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    // 表格数据
    dataSource: {
      type: Array,
      default: () => [],
    },
    // 当前起始坐标
    index: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      visible,
      data,
      modelValue,
      search,
      tableRef,
      isDisabled,
      onClose,
      onConfirm,
      onCheck,
      onShowDialog,
    } = useRelationFlow(props, ctx)
    return () => {
      return (
        <div class={styles.relationDialog}>
          <div onClick={onShowDialog} class={styles.flows}>
            {!modelValue.value.length ? (
              <span class={styles.flowTag}>{_t('请选择关联流程')}</span>
            ) : (
              <Tag
                v-model:data={modelValue.value}
                showClose={true}
                className={styles.tagContent}
              />
            )}
          </div>
          <BaseDialog
            width="1160px"
            height="536px"
            v-model={visible.value}
            title={_t('关联流程')}
            append-to-body={true}
            destroy-on-close
            submitDisabled={isDisabled.value}
            onClose={onClose}
            onConfirm={onConfirm}
          >
            <div class={styles.header}>
              <label class={styles.key}>{_t('流程名称')}</label>
              <Search
                v-model={search.value}
                tableRef={tableRef}
                placeholder={_t('请输入')}
              />
            </div>
            <div class={styles.table}>
              <BaseTable
                ref={tableRef}
                url="/api/v1/messuite/query/flowdefinition"
                columns={relationFlowColumns}
                size="mini"
                v-model:dataSource={data.value}
                isChecked
                isVScroll
                id="type"
                onCheck={onCheck}
                LanguageScopeKey={LanguageScopeKey}
                v-slots={{
                  abilitys: ({ row }: any) => {
                    const v = row.abilitys
                      ?.map((v: any) => v.description)
                      .join(',')
                    return (
                      <div style="width:200px">
                        {v.length ? (
                          <Text truncated={true} tag="p" tip={v}>
                            {v}
                          </Text>
                        ) : (
                          '-'
                        )}
                      </div>
                    )
                  },
                  type: ({ row }: any) => {
                    return row.businessType?.description || '-'
                  },
                  associationObjects: ({ row }: any) => {
                    return row.associationObjects ? (
                      <Tag data={row.associationObjects} />
                    ) : (
                      '-'
                    )
                  },
                }}
              />
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
