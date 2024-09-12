import TraceManagement from './TraceManagement.vue'
import TraceManagementSettings from './TraceManagement.settings.vue'
import { provider } from '@/provider/index'
import T from '../../assets/svg/T.svg'

export default {
  is: 'TraceManagement',
  name: '追溯报表',
  category: 'run',
  icon: T,
  authorizationRequired: true,
  canvasView: provider(TraceManagement),
  settingsView: TraceManagementSettings,
}
