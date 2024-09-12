import BusinessFieldSetting from './Views/BusinessFieldSetting'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import field from '@/assets/svg/field.svg'

export default {
  is: 'BusinessFieldSetting',
  name: '业务字段设置',
  category: 'run',
  icon: field,
  authorizationRequired: true,
  canvasView: provider(BusinessFieldSetting),
  settingsView: Setting,
}
