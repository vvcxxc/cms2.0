import { defineComponent, SetupContext } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './Trace.module.scss'
import { useTrace } from '../../../Controllers/Trace'
import { _t } from '@/widgets/ProductionTracking/app'
import './Trace.scss'

export default defineComponent({
  name: '追溯',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
    isFilter: {
      type: Boolean,
      default: true,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    num: {
      type: Number,
      default: 3,
    },
    productId: {
      type: String,
      default: '',
    },
    workSectionId: {
      type: String,
      default: '',
    },
    productModel: {
      type: String,
      default: '',
    },
    dataConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx: SetupContext) {
    const {
      dataSource,
      columns,
      renderRowStyle,
      isFilter,
      productId,
      productList,
      workSectionId,
      workSectionTree,
      onSectionChange,
      onProductChange,
    } = useTrace(props, ctx)
    return () => {
      return (
        <div class={styles.container}>
          {isFilter.value ? (
            <div class={styles.header}>
              <div class={styles.row} style="margin-right: 10px">
                <label>{_t('产品型号')}</label>
                <el-select
                  class={styles.select}
                  v-model={productId.value}
                  style="width: 200px"
                  placeholder={_t('请选择')}
                  clearable
                  filterable
                  onChange={onProductChange}
                >
                  {productList.value?.map((product) => {
                    return (
                      <el-option
                        key={product.id}
                        label={product.model}
                        value={product.id}
                      ></el-option>
                    )
                  })}
                </el-select>
              </div>
              <div class={styles.row}>
                <label>{_t('工序')}</label>
                <el-tree-select
                  class={styles.select}
                  v-model={workSectionId.value}
                  default-expand-all
                  placement="bottom-start"
                  node-key="headerId"
                  value-key="headerId"
                  clearable
                  filterable
                  placeholder={_t('请选择')}
                  data={workSectionTree.value}
                  style="width: 200px"
                  onChange={onSectionChange}
                ></el-tree-select>
              </div>
            </div>
          ) : null}

          <div
            class={styles.traceContent}
            style={isFilter.value ? { height: 'calc(100% - 50px)' } : {}}
          >
            <BaseTable
              id="Id"
              class="information-production-tracking-trace-style information-table-custom-style"
              cellStyle={renderRowStyle}
              columns={columns.value}
              v-model:dataSource={dataSource.value}
              isChecked={false}
              isFooter={false}
              isVScroll={true}
              isDrag={false}
              isHidePagination={true}
              headBorder={true}
              maxHeight="auto"
            ></BaseTable>
          </div>
        </div>
      )
    }
  },
})
