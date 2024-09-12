import StationBoard from './Views/StationBoard'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import board from '@/assets/svg/board.svg'

export default {
  is: 'DXLLG-StationBoard',
  name: '工位看板',
  category: 'run',
  icon: board,
  authorizationRequired: false,
  canvasView: provider(StationBoard),
  settingsView: Setting,
}
