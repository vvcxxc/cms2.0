import { DefineComponent, SetupContext, defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import styles from './ProcessDrawer.module.scss'
import { useProcessDrawer } from '@/widgets/ProcessManagement/Controllers/ProcessDrawer'
import DyForm from '@/components/DyForm/DyForm'
import Title from '@/components/Title/Title'
import Tab from '@/components/Tab/Tab'
import TabPane from '@/components/Tab/TabPane'
import CommonTable from '../../../Components/CommonTable/CommonTable'
import { isEdition } from '@/libs/Permission/Permission'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '工序弹窗',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    row: {
      type: Object,
      default: null,
    },
    sort: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'close', 'submit', 'confirm'],
  setup(props, ctx: SetupContext) {
    const {
      onClose,
      onConfirm,
      onOpen,
      formRef,
      paramsColumns,
      visible,
      formItems,
      tabData,
      formData,
    } = useProcessDrawer(props, ctx)
    return () => {
      return (
        <BaseDrawer
          class={styles.drawer}
          size="800px"
          title={props.title || _t('添加工序')}
          v-model={visible.value}
          close-on-click-modal={true}
          onConfirm={onConfirm}
          onOpen={onOpen}
          before-close={onClose}
          onClose={onClose}
          destroy-on-close
        >
          <DyForm
            ref={formRef}
            formData={formData}
            labelWidth="106px"
            formItemProps={formItems.value}
            LanguageScopeKey={LanguageScopeKey}
          ></DyForm>
          <Title>{_t('参数配置')}</Title>
          <Tab active={tabData.value[0].name} size="small" type="params">
            {tabData.value.map((item: any) => {
              return (
                <TabPane
                  isHide={!isEdition([item.edition])}
                  key={item.name}
                  label={item.label}
                  name={item.name}
                >
                  <CommonTable
                    ref={item.ref}
                    isContextMenu={true}
                    v-model:dataSource={item.data.value}
                    columns={item.columns ? item.columns : paramsColumns}
                    max-height="440px"
                    isFooter
                    // @ts-ignore
                    isStop={item.isStop}
                    LanguageScopeKey={LanguageScopeKey}
                  />
                </TabPane>
              )
            })}
          </Tab>
        </BaseDrawer>
      )
    }
  },
})
