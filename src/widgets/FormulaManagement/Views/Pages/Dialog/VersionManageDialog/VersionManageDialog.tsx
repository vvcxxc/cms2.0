import { PropType, defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useVersionManageDialog } from '../../../../Controllers/VersionManageDialog'
import styles from './VersionManageDialog.module.scss'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
export default defineComponent({
  name: '版本管理',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    rowData: {
      type: Object as any,
      default: null,
    },
    openSource:{
      type: String as PropType<'VerSion' | 'Params'>,
      default: 'VerSion'
    }
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      visible,
      innerValue,
      onSearch,
      tableRef,
      dataSource,
      onCheck,
      columns,
      onCopy,
      onDelete,
      onAdd,
      onSetVersion,
      onBlur,
      onOpen,
      onDrag,
    } = useVersionManageDialog(props, ctx)
    return () => (
      <BaseDialog
        append-to-body
        destroy-on-close
        class={styles.drawer}
        style="background: #fff"
        width="664px"
        height="620px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        <div class={styles.container}>
          <h3 class={styles.currentVersion}>
            当前版本： {props.rowData.currentVersion}
          </h3>
          <div class={styles.tools}>
            <IconButton icon="add-p" onClick={onAdd} type="primary">
              添加
            </IconButton>
            <IconButton icon="delete" onClick={onDelete}>
              删除
            </IconButton>
            <IconButton icon="fb" onClick={onCopy}>
              创建副本
            </IconButton>
            <IconButton icon="fb" onClick={onSetVersion}>
              设为当前
            </IconButton>
            <Search
              placeholder="请输入版本名称"
              class={styles.searchInner}
              v-model={innerValue.value}
              onConfirm={onSearch}
            />
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              disabledDrag={!!innerValue.value}
              ref={tableRef}
              style="margin-top:10px"
              v-model:dataSource={dataSource.value}
              columns={columns}
              isChecked={true}
              isDrag={true}
              onDrag={onDrag}
              isHidePagination={true}
              onCheck={onCheck}
              vSlots={{
                name: ({ row }: any) => {
                  return (
                    <el-tooltip
                      effect="dark"
                      content={row.name}
                      disabled={!row.name}
                      placement="top"
                    >
                      <el-input
                        v-model={row.name}
                        onBlur={() => onBlur(row.name)}
                      />
                    </el-tooltip>
                  )
                },
                remark: ({ row }: any) => {
                  return (
                    <el-tooltip
                      effect="dark"
                      content={row.remark}
                      disabled={!row.remark}
                      placement="top"
                    >
                      <el-input v-model={row.remark} />
                    </el-tooltip>
                  )
                },
              }}
            />
          </div>
        </div>
      </BaseDialog>
    )
  },
})
