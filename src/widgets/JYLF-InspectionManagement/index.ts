import InspectionManagement from './Views/InspectionManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import field from '@/assets/svg/field.svg'

export default {
  is: 'JYLF-InspectionManagement',
  name: '点检管理',
  category: 'run',
  icon: field,
  authorizationRequired: false,
  canvasView: provider(InspectionManagement),
  settingsView: Setting,
}
