import StationBeatAnalysis from './Views/StationBeatAnalysis'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import beatAnalysis from '../../assets/svg/beatAnalysis.svg'

export default {
  is: 'StationBeatAnalysis',
  name: '工位节拍分析',
  category: 'run',
  icon: beatAnalysis,
  authorizationRequired: true,
  canvasView: provider(StationBeatAnalysis),
  settingsView: Setting,
}
