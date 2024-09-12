import { defineComponent } from 'vue'
import styles from './DetailSettingDialog.module.scss'
import { useProcessSettingDialog } from '../../../../Controllers/DetailParamsSettingDialog'
import CommonTable from '../../../Components/CommonTable/CommonTable'
import BaseDialog from '@/components/BaseDialog/index.vue'
import BaseTable from '@/components/Table/Table'
import Title from '@/components/Title/Title'

export default defineComponent({
  name: '配方值配置',
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
    isProcess: {
      type: Boolean,
      default: true,
    },
    row: {
      type: Object,
      default: {},
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx) {
    const {
      visible,
      onOpen,
      onClose,
      onConfirm,
      onCheckLeft,
      delSetting,
      tableRef1,
      tableRef2,
      dataSource1,
      dataSource2,
      columns1,
      columns2,
      dataObj,
    } = useProcessSettingDialog(props, ctx)
    return () => {
      return (
        <div class={styles.processSetting}>
          <BaseDialog
            width="900px"
            v-model={visible.value}
            title="配方值配置"
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            destroy-on-close
          >
            <div class={styles.labelLine}>
              <div class={styles.label}>
                当前工序：
                {props.row?.workSectionName}
              </div>
              <div class={styles.delete} onClick={delSetting}>
                删除配置
              </div>
            </div>

            <div class={styles.flexTable}>
              <div class={styles.tableLeft}>
                <Title top={5} bottom={12}>
                  关联配方
                </Title>
                <div class={styles.tableContent}>
                  <BaseTable
                    ref={tableRef1}
                    v-model:dataSource={dataSource1.value}
                    columns={columns1}
                    isHidePagination={true}
                    onRowClick={onCheckLeft}
                  />
                </div>
              </div>
              <div class={styles.tableRight}>
                <Title top={5} bottom={12}>
                  试漏仪参数
                </Title>
                <div class={styles.tableContent}>
                  <BaseTable
                    ref={tableRef2}
                    v-model:dataSource={dataSource2.value}
                    columns={columns2}
                    isHidePagination={true}
                    v-slots={{
                      setValue: ({ row, index }: any) => {
                        return <el-input v-model={row.setValue} />
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
