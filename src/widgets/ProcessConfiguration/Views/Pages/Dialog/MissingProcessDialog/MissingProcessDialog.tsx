import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { defineComponent, SetupContext } from 'vue'
import styles from './MissingProcessDialog.module.scss'
import {
  useMissingProcess
} from '@/widgets/ProcessConfiguration/Controllers/MissingProcess'
 import BaseTable from '@/components/Table/index.vue'//这里用Table.ts会导致setAllCheckboxRow失效
 import Text from '@/components/Text/Text'//这里用Table.ts会导致setAllCheckboxRow失效

 import IconButton from '@/components/IconButton/IconButton'
import ChooseProcessDialog from '../ChooseProcessDialog/ChooseProcessDialog'

export default defineComponent({
  name: '关联物料',
  props: {
    visible: {
      type: Boolean,
      default: null,
    },
    searchLineType: {
      type: String,
      default: '1',
    },
    curselectionList: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'close', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      visible,
       settingType,
      selections,
      dataSource,
      onClose,
      onConfirm,
      onCheck,
      onOpenSetting,
      delDetection,
      updateProcess,
      missingProcessColumns,
      missTableRef,
      dataObj,
      pageInfo,
    } = useMissingProcess(props, ctx)
     return () => {
      return (
        <div class={styles.MissingProcessDialog}>
          <div class={styles.DialogBtnList}>
            <div class={styles.DialogBtn} onClick={() => onOpenSetting('missProcessSettings')}   >漏工序检测设置 </div>
            <div class={styles.DialogBtn} onClick={() => onOpenSetting('productUpdateSettings')} >产品码更新设置 </div>
            <div class={styles.DialogBtn} onClick={() => onOpenSetting('productStatusDetectSettings')}>产品状态检测设置 </div>
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
              <div class={styles.currentVersion}>
                基本<div class={styles.info}>信息</div>
              </div>
              <div class={styles.baseInfo}>
              <div class={styles.label}>产品型号：{dataObj?.productModel}</div>
              <div class={styles.label}>当前工序：{dataObj?.productionLineSegmentName}-{dataObj?.workSectionName}</div>
              </div>
              <div class={styles.currentVersion}>
              {pageInfo.settingTitle}<div class={styles.info}>配置</div>
              </div>
              <div class={styles.mainTable}>
                <div class={styles.tableBtnList}>
                  <ChooseProcessDialog 
                   curselectionList={selections.value}
                   settingType={settingType.value}
                   curProcess={props.curselectionList}
                   searchLineType={props.searchLineType}
                   onConfirm={updateProcess}/>            
                  <IconButton  icon="delete" onClick={()=>delDetection()} style={{marginLeft:'15px'}} >删除</IconButton>
                </div>
                  <BaseTable
                   ref={ missTableRef}
                  v-model:dataSource={dataSource.value}
                  columns={missingProcessColumns.value}
                  isChecked={true}
                  isDrag={true}
                  isHidePagination={true}
                  onCheck={onCheck}
                  vSlots={{
                    workSectionNames: ({ row }: any) => {
                      return <Text tip={row.workSectionNames}><div  class={styles.ellipsis}>{row.workSectionNames }</div></Text>
                    },
                  }}
                />
              </div>
            </div>
          </BaseDialog>
        </div>
      )
    }
  },
})
