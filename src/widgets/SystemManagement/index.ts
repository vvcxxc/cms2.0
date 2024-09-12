import SystemManagement from './Views/SystemManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import system from '@/assets/svg/system.svg'

export default {
  is: 'SystemManagement',
  name: '系统管理',
  category: 'run',
  icon: system,
  authorizationRequired: true,
  canvasView: provider(SystemManagement),
  settingsView: Setting,
}
