import { PropType, computed, defineComponent, ref } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { useBatchMaterialFeeding } from '../../Controllers/BatchMaterialFeeding'
import BaseTable from '@/components/Table/Table'

export default defineComponent({
  name: '批次料上料',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },

    checkItemConfigId: {
      type: String,
      default: '',
    },
    checkItemConfigName: {
      type: String,
      default: '',
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      tableRef,
      dataSource,
      column,
      visible,
      materialInputsRef,
      rowStyle,
      getVariableValue,
      onOpen,
      onClose,
      keydown,
      setMaterialVal,
    } = useBatchMaterialFeeding(props, ctx)

    return () => (
      <BaseDialog
        width="830px"
        height="300px"
        title="批次料上料"
        destroy-on-close
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onClose}
        onOpen={onOpen}
      >
        <BaseTable
          autoFirstClickRow
          ref={tableRef}
          v-model:dataSource={dataSource.value}
          columns={column.value}
          isHidePagination={true}
          rowStyle={rowStyle}
          v-slots={{
            barcodeVariable: ({ row, index }: any) => {
              return (
                <el-input
                  v-model={row.code}
                  ref={(ref: any) => (materialInputsRef.value[index] = ref)}
                  onKeydown={keydown}
                  onBlur={() => setMaterialVal(row, index)}
                />
              )
            },
            verificationResultSignal: ({ row }: any) => {
              return (
                <div
                  style={{
                    color:
                      getVariableValue(row.verificationResultSignal) == 1
                        ? '#77A826'
                        : '#D9001B',
                  }}
                >
                  {getVariableValue(row.verificationResultSignal) == 1
                    ? 'OK'
                    : getVariableValue(row.verificationResultSignal) == 2
                    ? 'NG'
                    : ''}
                </div>
              )
            },
          }}
        />
      </BaseDialog>
    )
  },
})
