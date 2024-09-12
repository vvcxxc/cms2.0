import ProcessManagement from './Views/ProcessManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import p from '../../assets/svg/p.svg'

export default {
  is: 'ProcessManagement',
  name: '工序管理',
  category: 'run',
  icon: p,
  authorizationRequired: true,
  canvasView: provider(ProcessManagement),
  settingsView: Setting,
}
