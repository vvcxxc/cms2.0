import WorkStationRole from './Views/WorkStationRole'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import field from '@/assets/svg/field.svg'

export default {
  is: 'CYYJ-WorkStationRole',
  name: '角色工位权限',
  category: 'run',
  icon: field,
  authorizationRequired: false,
  canvasView: provider(WorkStationRole),
  settingsView: Setting,
}
