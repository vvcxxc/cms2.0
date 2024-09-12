import { defineComponent } from 'vue'
import BaseDialog from '@/components/BaseDialog/index.vue'
import { useParamsConifgDialog } from '../../../../Controllers/ParamsConifgDialog'
import styles from './ParamsConifgDialog.module.scss'
import Search from '@/components/Search/Search'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
export default defineComponent({
  name: '参数选择',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '参数选择',
    },
    rowData: {
      type: Object as any,
      default: null,
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      visible,
      innerValue,
      onSearch,
      formulaTableRef,
      processTableRef,
      onFormulaCheck,
      onProcessCheck,
      processColumns,
      formulaColumns,
      currentTab,
      onChange,
      processParameters,
      formulaParameters,
      onOpen,
    } = useParamsConifgDialog(props, ctx)
    return () => (
      <BaseDialog
        append-to-body
        destroy-on-close
        class={styles.drawer}
        style="background: #fff"
        width="664px"
        height="578px"
        title={props.title}
        v-model={visible.value}
        onClose={onClose}
        onConfirm={onConfirm}
        onOpen={onOpen}
      >
        <div class={styles.container}>
          <div class={styles.tools}>
            <el-radio-group
              v-model={currentTab.value}
              onChange={onChange}
              size="small"
            >
              <el-radio-button label="process">采集参数</el-radio-button>
              <el-radio-button label="formula">配方参数</el-radio-button>
            </el-radio-group>
            <Search
              placeholder="请输入参数名或参数描述"
              class={styles.searchInner}
              v-model={innerValue.value}
              onConfirm={onSearch}
            />
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              v-show={currentTab.value === 'process'}
              key="process"
              id="key"
              ref={processTableRef}
              isChecked={true}
              v-model:dataSource={processParameters.value}
              onCheck={onProcessCheck}
              columns={processColumns}
              isHidePagination={true}
              isVScroll={true}
            />

            <BaseTable
              v-show={currentTab.value === 'formula'}
              key="formula"
              id="key"
              ref={formulaTableRef}
              isChecked={true}
              v-model:dataSource={formulaParameters.value}
              onCheck={onFormulaCheck}
              isVScroll={true}
              columns={formulaColumns}
              isHidePagination={true}
            />
          </div>
        </div>
      </BaseDialog>
    )
  },
})
