import { defineComponent } from 'vue'
import styles from './MaterialLoading.module.scss'
import BaseTable from '@/components/Table/Table'
import Text from '@/components/Text/Text'
import { useMaterialLoading } from '../Controllers/MaterialLoading'

export default defineComponent({
  name: '物料上料',

  setup(props: any, ctx) {
    const {
      tableRef,
      dataSource,
      dataObj,
      materialTypeMap,
      columns,
      materialInputsRef,
      sendCode,
      clearInfo,
      getVariableValue,
    } = useMaterialLoading()

    return () => {
      return (
        <div class={styles.MaterialLoading}>
          <div class={styles.MaterialLoadingTitle}>物料上料</div>
          <div class={styles.MaterialLoadingContent}>
            <div class={styles.MaterialLoadingLabelInfo}>
              <div class={styles.MaterialLoadingLabel}>
                产品型号：{dataObj.productModel}
              </div>
            </div>
            <div class={styles.MaterialLoadingTable}>
              <BaseTable
                ref={tableRef}
                dataSource={dataSource.value}
                columns={columns}
                isHidePagination={true}
                v-slots={{
                  materialType: ({ row }: any) => {
                    return <span>{materialTypeMap[row.materialType]}</span>
                  },
                  bindMaterialVariable: ({ row }: any) => {
                    return (
                      <Text fontSize="12px" color="#99999A">
                        {getVariableValue(row.bindMaterialVariable)}
                      </Text>
                    )
                  },
                  barcodeVariable: ({ row, index }: any) => {
                    return (
                      <el-input
                        ref={(ref: any) =>
                          (materialInputsRef.value[index] = ref)
                        }
                        type="text"
                        v-model={row.code}
                        onKeyup={($event: any) => sendCode($event, row, index)}
                      />
                    )
                  },
                  verificationResultSignal: ({ row }: any) => {
                    return (
                      <span
                        style={{
                          color:
                            getVariableValue(row.verificationResultSignal) == 1
                              ? '#109B00'
                              : '#CC0000',
                        }}
                      >
                        {getVariableValue(row.verificationResultSignal) == 1
                          ? 'OK'
                          : getVariableValue(row.verificationResultSignal) == 2
                          ? 'NG'
                          : ''}
                      </span>
                    )
                  },
                }}
              />
            </div>
            <div class={styles.MaterialLoadingfinish}>
              <div class={styles.finishBtn} onClick={clearInfo}>
                上料完成
              </div>
            </div>
          </div>
        </div>
      )
    }
  },
})
