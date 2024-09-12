import BOMManagement from './Views/BOMManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import bom from '../../assets/svg/bom.svg'

export default {
  is: 'BOMManagement',
  name: 'BOM管理',
  category: 'run',
  icon: bom,
  authorizationRequired: true,
  canvasView: provider(BOMManagement),
  settingsView: Setting,
}
