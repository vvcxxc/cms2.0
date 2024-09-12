import { defineComponent, PropType, SetupContext } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { useBatchParamsSignal } from '../../../../Controllers/BatchConfigurationDialog'
import ParamsSignalConfig from '../../../Components/ParamsSignalConfig/ParamsSignalConfig'

export default defineComponent({
  name: '批量配置模块',
  props: {
    active: {
      type: String as PropType<string>,
      default: '',
    },
  },
  emits: ['updateRef'],
  setup(props: any, ctx: SetupContext) {
    const { paramsRef, sectionKeyMap, currentRow, signalData } =
      useBatchParamsSignal(props, ctx)

    return () => {
      return (
        <ParamsSignalConfig
          sectionKeyMap={sectionKeyMap.value}
          row={currentRow.value}
          data={signalData.value}
          id={props.active}
          ref={paramsRef}
          max-height="410px"
          width="740px"
        />
      )
    }
  },
})
