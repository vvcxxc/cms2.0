import { PropType, computed, defineComponent, ref } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { useControlChartSelect } from '../../../Controllers/ControlChartSelect'
import BaseTable from '@/components/Table/Table'
export default defineComponent({
  name: '物料编号弹窗',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    rowData: {
      type: Object as PropType<Object | null>,
      default: null,
    },
    controlChartSelectType: {
      type: String,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      column,
      visible,
      onRowClick,
      onOpen,
      onClose,
      onConfirm,
    } = useControlChartSelect(props, ctx)

    return () => (
      <BaseDialog
        width="950px"
        title="控制图选择"
        destroy-on-close
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        {/* <BaseTable
          autoFirstClickRow
          height="auto"
          ref={tableRef}
          v-model:dataSource={dataSource.value}
          columns={column}
          isHidePagination={true}
          onRowClick={onRowClick}
        /> */}
        <vxe-table
          ref={tableRef}
          header-row-class-name="information-table-base-header"
          data={dataSource.value}
          rowConfig={{
            isCurrent: true,
            isHover: true,
          }}
          header-cell-style={{
            background: '#dbdfe7',
            color: '#35363B',
            fontSize: '16px',
            fontWeight: 400,
          }}
          border={true}
          onCurrentChange={onRowClick}
        >
          {column.map((item: any) => {
            return (
              <vxe-column
                width={item.width}
                field={item.field}
                title={item.title}
                v-slots={{
                  default: ({ row }: any) => {
                    return item.field == 'num' && row.num ? (
                      <div>
                        {row.num.split('。').map((item: string) => (
                          <div>{item}</div>
                        ))}
                      </div>
                    ) : (
                      row[item.field]
                    )
                  },
                }}
              ></vxe-column>
            )
          })}
        </vxe-table>
      </BaseDialog>
    )
  },
})
