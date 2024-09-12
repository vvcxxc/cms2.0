import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './RelationMaterielDialog.module.scss'
import { useRelationMaterial } from '@/widgets/ProcessManagement/Controllers/Dialog'
import BaseTable from '@/components/Table/Table'
import { relationColumns } from '../../../../enum'
import Search from '@/components/Search/Search'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '关联物料',
  props: {
    modelValue: {
      type: String,
      default: '',
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
    type: {
      type: String,
    },
    readonly: {
      type: [Boolean, Object],
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props: any, ctx: SetupContext) {
    const {
      visible,
      data,
      modelValue,
      search,
      tableRef,
      onClose,
      onConfirm,
      onCheck,
      onSelect,
    } = useRelationMaterial(props, ctx)
    const Input = () => {
      const readonly =
        typeof props.readonly?.value === 'boolean'
          ? (props.readonly?.value as boolean)
          : (props.readonly as boolean)
      if (props.type === 'input') {
        return (
          <el-input
            v-model={modelValue.value}
            clearable={false}
            class={styles.selectVariable}
            placeholder={readonly ? _t('请选择') : _t('请输入')}
            readonly={readonly}
            suffix-icon={
              readonly ? (
                <el-button
                  link
                  type="primary"
                  size="small"
                  style="margin-right: 10px;"
                  onClick={onSelect}
                >
                  {_t('选择')}
                </el-button>
              ) : null
            }
          ></el-input>
        )
      }

      return modelValue.value ? (
        <span class={styles.selected} onClick={onSelect}>
          {modelValue.value}
        </span>
      ) : (
        <span onClick={onSelect} class={styles.select}>
          {_t('请选择')}
        </span>
      )
    }
    return () => {
      return (
        <div class={styles.relationDialog}>
          <Input />
          <BaseDialog
            width="954px"
            height="536px"
            v-model={visible.value}
            title={_t('关联物料')}
            onClose={onClose}
            onConfirm={onConfirm}
            destroy-on-close
          >
            <div class={styles.header}>
              <label class={styles.key}>{_t('关键字')}</label>
              <Search
                v-model={search.value}
                field="filter"
                tableRef={tableRef}
                placeholder={_t('请输入关键字')}
              />
            </div>
            <div class={styles.table}>
              <BaseTable
                ref={tableRef}
                url="/api/v1/messuite/query/material"
                columns={relationColumns}
                size="mini"
                v-model:dataSource={data.value}
                isChecked
                isVScroll
                onCheck={onCheck}
                isStop={true}
                LanguageScopeKey={LanguageScopeKey}
              />
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
