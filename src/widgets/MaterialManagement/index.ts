import MaterialManagement from './Views/MaterialManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import materialManagement from '../../assets/svg/materialManagement.svg'

export default {
  is: 'MaterialManagement',
  name: '物料管理',
  category: 'run',
  icon: materialManagement,
  authorizationRequired: true,
  canvasView: provider(MaterialManagement),
  settingsView: Setting,
}
