import { computed, defineComponent, ref } from 'vue'
import Title from '@/components/Title/Title'
import styles from './WorkSection.module.scss'
import { CaretBottom, Search } from '@element-plus/icons-vue'
import BaseTable from '@/components/Table/Table'
import { useWorkSection } from '../../../Controllers/WorkSection'
import { EnumListItemType } from '@/libs/Store/Store.d'
import { _t } from '@/libs/Language/Language'
export default defineComponent({
  name: '工序',
  props: {
    title: {
      type: String,
      default: '工序',
    },
    initData: {
      type: Boolean,
      default: true,
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
    isDrag: {
      type: Boolean,
      default: false,
    },
    showSeq: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['check', 'change', 'sort', 'update:dataSource'],
  setup(props, ctx) {
    const {
      columns,
      state,
      dataSource,
      filterForm,
      onChange,
      tableRef,
      onCheck,
      showLineStructure,
      disabledDrag,
      onDrag,
    } = useWorkSection(props, ctx)

    return () => (
      <div class={styles.workSection}>
        <Title>{props.title}</Title>
        <el-form
          inline
          class={styles.searchTool}
          onSubmit={(e: Event) => e.preventDefault()}
        >
          {showLineStructure.value && (
            <el-form-item label={_t('工序段')} class={styles.formItem}>
              <el-select
                onChange={onChange}
                v-model={filterForm.Segment}
                style="width: 80px"
                size="small"
                suffix-icon={
                  <el-icon>
                    <CaretBottom />
                  </el-icon>
                }
                placeholder={_t('请选择工序段')}
              >
                <el-option label={_t('全部')} value="" />
                {state.value.map((item: EnumListItemType) => {
                  return <el-option label={item.name} value={item.value} />
                })}
              </el-select>
            </el-form-item>
          )}

          <el-form-item label={_t('工序')} class={styles.formItem}>
            <el-input
              onChange={onChange}
              v-model={filterForm.Filter}
              size="small"
              prefix-icon={Search}
              placeholder={_t('请输入工序名称')}
            />
          </el-form-item>
        </el-form>
        <div class={styles.sectionTable}>
          <BaseTable
            ref={tableRef}
            disabledDrag={disabledDrag.value}
            style="margin-top:10px"
            v-model:dataSource={dataSource.value}
            columns={columns.value}
            isDrag={props.isDrag}
            isChecked={props.isChecked}
            isHidePagination={true}
            onCheck={onCheck}
            onDrag={onDrag}
            // onRowClick={onRowClick}
            vSlots={{
              segment: ({ row }: any) => {
                return row.segment?.name ?? '-'
              },
            }}
          />
        </div>
      </div>
    )
  },
})
