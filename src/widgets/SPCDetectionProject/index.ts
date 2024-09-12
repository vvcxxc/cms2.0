import SPCDetectionProject from './Views/SPCDetectionProject'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import detection from '../../assets/svg/detection.svg'

export default {
  is: 'SPCDetectionProject',
  name: '检测项目配置',
  category: 'run',
  icon: detection,
  authorizationRequired: true,
  canvasView: provider(SPCDetectionProject),
  settingsView: Setting,
}
