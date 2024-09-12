import ProcessConfiguration from './Views/ProcessConfiguration'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import processConfiguration from '../../assets/svg/processConfiguration.svg'

export default {
  is: 'ProcessConfiguration',
  name: '过程配置',
  category: 'run',
  icon: processConfiguration,
  authorizationRequired: true,
  canvasView: provider(ProcessConfiguration),
  settingsView: Setting,
}
