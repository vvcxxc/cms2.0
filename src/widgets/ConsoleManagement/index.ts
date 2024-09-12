import ConsoleManagement from './Views/ConsoleManagement'
import Setting from '../ConsoleManagement/Settings/ConsoleManagement.settings'
import { provider } from '@/provider/index'
import control from '@/assets/svg/control.svg'

export default {
  is: 'ConsoleManagement',
  name: '控制台',
  category: 'run',
  icon: control,
  authorizationRequired: true,
  canvasView: provider(ConsoleManagement),
  settingsView: Setting,
}
