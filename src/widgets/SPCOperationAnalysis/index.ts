import SPCOperationAnalysis from './Views/SPCOperationAnalysis'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import operationAnalysis from '../../assets/svg/operationAnalysis.svg'

export default {
  is: 'SPCOperationAnalysis',
  name: 'SPC运行分析',
  category: 'run',
  icon: operationAnalysis,
  authorizationRequired: true,
  canvasView: provider(SPCOperationAnalysis),
  settingsView: Setting,
}
