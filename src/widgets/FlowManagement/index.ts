import FlowManagement from './Views/FlowManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import flow from '@/assets/svg/flow.svg'

export default {
  is: 'FlowManagement',
  name: '流程管理',
  category: 'run',
  icon: flow,
  authorizationRequired: true,
  canvasView: provider(FlowManagement),
  settingsView: Setting,
}
