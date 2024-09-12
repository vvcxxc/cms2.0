import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './RelationBarcodeGenerateDialog.module.scss'
import { useRelationGenerate } from '@/widgets/ProcessManagement/Controllers/Dialog'
import Title from '@/components/Title/Title'
import Text from '@/components/Text/Text'
import BaseTable from '@/components/Table/Table'

import Search from '@/components/Search/Search'
import { _t, LanguageScopeKey } from '../../../../app'
import dayjs from 'dayjs'

export default defineComponent({
  name: '关联条码生成规则',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: [Object, Number, String],
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: null,
    },
    title: {
      type: String,
      default: _t('关联条码生成规则'),
    },
    mode: {
      type: String,
      default: 'select',
    },
    ruleType: {
      type: String,
      default: 'barcodegeneration',
    },
  },
  emits: ['update:modelValue', 'update:visible', 'close', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      visible,
      data,
      modelValue,
      search,
      tableRef,
      columns,
      url,
      onClose,
      onConfirm,
      onSelect,
      onRowClick,
      onSearch,
    } = useRelationGenerate(props, ctx)
    return () => {
      const { name, description } = modelValue.value
      return (
        <div class={styles.relationDialog}>
          {props.mode === 'select' &&
            (description ? (
              <span class={styles.selected} onClick={onSelect}>
                {description}
              </span>
            ) : (
              <span onClick={onSelect} class={styles.select}>
                {_t('请选择')}
              </span>
            ))}

          <BaseDialog
            width="954px"
            height="536px"
            destroy-on-close
            append-to-body={true}
            v-model={visible.value}
            title={props.title}
            onClose={onClose}
            onConfirm={onConfirm}
          >
            <div class={styles.header}>
              <label class={styles.key}>{_t('条码名称')}</label>
              <Search v-model={search.value} onConfirm={onSearch} />
            </div>
            <div class={styles.table}>
              <BaseTable
                ref={tableRef}
                url={url.value}
                columns={columns.value}
                size="mini"
                v-model:dataSource={data.value}
                isHidePagination={true}
                isVScroll
                onRowClick={onRowClick}
                v-slots={{
                  lastModificationTime: ({ row }: any) => (
                    <Text
                      tip={dayjs(row.lastModificationTime).format(
                        'YYYY-MM-DD HH:MM:ss'
                      )}
                    >
                      {dayjs(row.lastModificationTime).format(
                        'YYYY-MM-DD HH:MM:ss'
                      )}
                    </Text>
                  ),
                }}
              />
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
