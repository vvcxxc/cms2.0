import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './ChooseWorkStationDialog.module.scss'
import { useWorkSection } from '../../Controllers/ChooseWorkStationDialog'
import BaseTable from '@/components/Table/Table'
import { ChooseWorkStationColumns } from '../../enum'
import Search from '@/components/Search/Search'
import Tag from '@/components/Tag/Tag'

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
    productId: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      visible,
      dataSource,
      search,
      tableRef,
      selections,
      modelValue,
      onCheck,
      onSearch,
      onClose,
      onConfirm,
      onShowDialog,
    } = useWorkSection(props, ctx)

    return () => {
      return (
        <div class={styles.relationDialog}>
          <div onClick={onShowDialog} class={styles.flows}>
            {!modelValue.value.length ? (
              <span class={styles.flowTag}>请选择点检工位</span>
            ) : (
              modelValue.value.map((item: any) => (
                <Tag showClose={true} style={{ marginRight: '5px' }}>
                  {item.workStationName}
                </Tag>
              ))
            )}
          </div>
          <BaseDialog
            width="860px"
            height="536px"
            v-model={visible.value}
            title="点检工位选择"
            append-to-body={true}
            destroy-on-close
            onClose={onClose}
            onConfirm={onConfirm}
            submitDisabled={!selections.value?.length}
          >
            <div class={styles.header}>
              <label class={styles.key}>工位</label>
              <Search
                onConfirm={onSearch}
                v-model={search.value}
                placeholder="请输入工位名称"
              />
            </div>
            <div class={styles.table}>
              <BaseTable
                ref={tableRef}
                id="workStationId"
                url={`/api/v1/jieyunlangfang/spotcheck/processroute/${props.productId}`}
                v-model:dataSource={dataSource.value}
                columns={ChooseWorkStationColumns}
                isChecked={true}
                onCheck={onCheck}
              ></BaseTable>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
