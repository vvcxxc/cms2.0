import MaterialLoading from './Views/MaterialLoading'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import materialManagement from '../../assets/svg/materialManagement.svg'

export default {
  is: 'JYLF-MaterialLoading',
  name: '物料上料',
  category: 'run',
  icon: materialManagement,
  authorizationRequired: false,
  canvasView: provider(MaterialLoading),
  settingsView: Setting,
}
