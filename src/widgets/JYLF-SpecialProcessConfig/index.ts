import SpecialProcessConfig from './Views/SpecialProcessConfig'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import flow from '@/assets/svg/flow.svg'

export default {
  is: 'JYLF-SpecialProcessConfig',
  name: '特殊工艺配置',
  category: 'run',
  icon: flow,
  authorizationRequired: false,
  canvasView: provider(SpecialProcessConfig),
  settingsView: Setting,
}
