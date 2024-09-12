import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './WorkSectionDialog.module.scss'
import { useWorkSection } from '@/widgets/ProcessManagement/Controllers/Dialog'
import BaseTable from '@/components/Table/Table'
import { columns } from '../../Process/Config'
import Search from '@/components/Search/Search'
import Tag from '@/components/Tag/Tag'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '工序',
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
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
    /**
     * 输入框模式还是弹窗模式
     */
    mode: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启多选
     */
    isChecked: {
      type: Boolean,
      default: false,
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
      current,
      onCheck,
      onSearch,
      onClose,
      onConfirm,
      onRowClick,
      onShowDialog,
    } = useWorkSection(props, ctx)
    const processColumns = columns()
    return () => {
      return (
        <div class={styles.relationDialog}>
          {!props.mode ? (
            <div onClick={onShowDialog} class={styles.flows}>
              {!modelValue.value.id ? (
                <span class={styles.flowTag}>{_t('请选择所属工序')}</span>
              ) : (
                <Tag showClose={true}>{modelValue.value?.name}</Tag>
              )}
            </div>
          ) : null}
          <BaseDialog
            width="1160px"
            height="536px"
            v-model={visible.value}
            title={_t('工序列表')}
            append-to-body={true}
            destroy-on-close
            onClose={onClose}
            onConfirm={onConfirm}
            submitDisabled={!current.value?.id}
          >
            <div class={styles.header}>
              <label class={styles.key}>{_t('关键字')}</label>
              <Search
                onConfirm={onSearch}
                v-model={search.value}
                placeholder={_t('请输入')}
              />
            </div>
            <div class={styles.table}>
              <BaseTable
                ref={tableRef}
                url="/api/v1/messuite/query/worksection"
                v-model:dataSource={data.value}
                columns={processColumns.value}
                onRowClick={onRowClick}
                isChecked={props.isChecked}
                onCheck={onCheck}
                LanguageScopeKey={LanguageScopeKey}
                v-slots={{
                  segment: ({ row }: any) => {
                    return row?.segment?.name ? (
                      <div class={styles.tagBox}>{row?.segment?.name}</div>
                    ) : (
                      '-'
                    )
                  },
                  flowDefinitions: ({ row }: any) => {
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
          </BaseDialog>
        </div>
      )
    }
  },
})
