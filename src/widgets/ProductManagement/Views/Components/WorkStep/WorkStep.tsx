import { computed, defineComponent, ref } from 'vue'
import Title from '@/components/Title/Title'
import styles from './WorkStep.module.scss'
import { CaretBottom, Search } from '@element-plus/icons-vue'
import BaseTable from '@/components/Table/Table'
import IconButton from '@/components/IconButton/IconButton'
import Icon from '@/components/Icon/Icon'
import { useWorkStep } from '@/widgets/ProductManagement/Controllers/WorkStep'
import SingleUpload from '../SingleUpload/SingleUpload'
import { createInjector } from '@/widgets/ProductManagement/store/SOPStore'
import { _t, LanguageScopeKey } from '../../../app'

export default defineComponent({
  name: '工步管理',
  setup(props, { expose }) {
    const {
      columns,
      addStep,
      handleChangeFile,
      allStepList,
      curProcessStep,
      curProcessId,
      curProductId,
      onDelete,
      onCheck,
    } = useWorkStep()

    return () => (
      <div class={styles.workStep}>
        <Title> {_t('工步管理')}</Title>
        <div class={styles.headTool}>
          <IconButton icon="add-p" type="primary" onClick={addStep}>
            {_t('新增')}
          </IconButton>
          <IconButton icon="delete" onClick={onDelete}>
            {_t('删除')}
          </IconButton>
        </div>
        <div class={styles.stepTable}>
          <BaseTable
            v-model:dataSource={curProcessStep.value.sopSteps}
            columns={columns.value}
            isHidePagination={true}
            isChecked={true}
            isDrag={true}
            onCheck={onCheck}
            v-slots={{
              name: ({ row }: any) => {
                return <el-input v-model={row.name} />
              },
              description: ({ row }: any) => {
                return <el-input v-model={row.description} />
              },
              ['annex.header']: () => (
                <div class={styles.annex}>
                  {_t('附件')}
                  <Icon
                    style="margin-left: 4px"
                    icon="fj"
                    width={16}
                    height={16}
                  />
                </div>
              ),
              annex: (data: any) => {
                return (
                  <div class={styles.annex}>
                    <SingleUpload
                      key={data.row.id}
                      accept=".pdf"
                      stepId={data.row.id}
                      productId={curProductId.value}
                      processId={curProcessId.value}
                      hasAnnex={data.row.hasAnnex}
                      file={data.row.file}
                      onChange={(file) =>
                        handleChangeFile(file, data.row, data.index)
                      }
                    />
                  </div>
                )
              },
            }}
          />
        </div>
      </div>
    )
  },
})
