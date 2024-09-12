import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './ChooseProcessDialog.module.scss'
import {
  useChooseProcess
} from '@/widgets/ProcessConfiguration/Controllers/ChooseProcess'
 import BaseTable from '@/components/Table/Table'
import { chooseProcessColumns } from '../../../../enum'
 import IconButton from '@/components/IconButton/IconButton'
import DyForm from '@/components/DyForm/DyForm'

export default defineComponent({
  name: '选择工序配置',
  props: {
    curProcess: {
      type: Array,
      default: () => [],//length只有1
    },
    curselectionList: {
      type: Array,
      default: () => [],
    },
    searchLineType: {
      type: String,
      default:'1',
    },
    settingType: {
      type: String,
      default:'missProcessSettings',
    },
    visible: {
      type: Boolean,
      default: null,
    }
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      visible,
      processTableRef,
      formRef,
      formItems,
      formData,
      selectionsList,
      onClose,
      onConfirm,
      onCheck,
      openDetection,
      pageInfo,
      computedProcessList
    } = useChooseProcess(props, ctx)
     return () => {
      return (
        <div class={styles.relationDialog}>
          <div >
            <IconButton  icon="add-p"   type="primary" onClick={()=>openDetection('add')}  >
              新增
            </IconButton>
            <IconButton  icon="edit" onClick={()=>openDetection('edit' )}  >
              编辑
            </IconButton>
          
          </div>

          <BaseDialog
            width="954px"
            height="536px"
            v-model={visible.value}
            title={pageInfo.dialogTitle}
            destroy-on-close
            onClose={onClose}
            onConfirm={onConfirm}
          >
            <div class={styles.container}>
                  <DyForm
                    ref={formRef}
                    formData={formData}
                    labelWidth="106px"
                    formItemProps={formItems.value}
                  ></DyForm>
                <div class={styles.mainTable}>
                <div  class={styles.tableLabel} > {pageInfo.processTitle}</div>
                  <BaseTable
                   ref={processTableRef}
                   params={{
                    productId:props.curProcess.length? props.curProcess[0].productId :'',
                    productionLineSegmentId:formData.productionLineSegmentId,
                    includeDetails:false
                   }}
                   url="/api/v1/messuite/query/processroutes"
                   selections={selectionsList.value}
                  v-model:dataSource={ computedProcessList.value}
                  columns={chooseProcessColumns}
                  isChecked={true}
                  isDrag={true}
                  isHidePagination={true}
                  onCheck={onCheck}
                  />
                </div>
             </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
