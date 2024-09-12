import QualityManagement from './QualityManagement.vue'
import QualityManagementSettings from './QualityManagement.settings.vue'
import { provider } from '@/provider/index'
import Q from '../../assets/svg/q.svg'

export default {
  is: 'QualityManagement',
  name: '不良品管理',
  category: 'run',
  authorizationRequired: true,
  icon: Q,
  canvasView: provider(QualityManagement),
  settingsView: QualityManagementSettings,
}
