import { computed, defineComponent } from 'vue'
import BaseDrawer from '@/components/BaseDrawer/BaseDrawer'
import styles from './StationDrawer.module.scss'
import { useStationDrawer } from '@/widgets/ProcessManagement/Controllers/StationDrawer'
import DyForm from '@/components/DyForm/DyForm'
import Title from '@/components/Title/Title'
import ParamsSignalConfig from '../../../Components/ParamsSignalConfig/ParamsSignalConfig'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '工位弹窗',
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
      default: () => ({}),
    },
    sort: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'close', 'submit', 'confirm'],
  setup(props, ctx) {
    const {
      onClose,
      onConfirm,
      onOpen,
      ParamsRef,
      sectionKeyMap,
      visible,
      formItems,
      formData,
      signalData,
      formRef,
      currentRow,
    } = useStationDrawer(props, ctx)
    return () => {
      return (
        <BaseDrawer
          class={styles.drawer}
          size="800px"
          // modal={false}
          // direction="rtl"
          // clickable
          title={props.title || _t('添加工位')}
          v-model={visible.value}
          onClose={onClose}
          onOpen={onOpen}
          onConfirm={onConfirm}
          destroy-on-close
          before-close={onClose}
        >
          <DyForm
            formData={formData}
            labelWidth="106px"
            formItemProps={formItems.value}
            ref={formRef}
            onSubmit={() => ctx.emit('submit')}
            LanguageScopeKey={LanguageScopeKey}
          ></DyForm>
          <Title>{_t('参数信号配置')}</Title>
          <ParamsSignalConfig
            width="735px"
            max-height="338px"
            sectionKeyMap={sectionKeyMap.value}
            row={currentRow.value}
            ref={ParamsRef}
            data={signalData.value}
          />
        </BaseDrawer>
      )
    }
  },
})
