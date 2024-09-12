import ProductBacktrack from './Views/ProductBacktrack'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import backtrack from '@/assets/svg/backtrack.svg'

export default {
  is: 'DXLLG-ProductBacktrack',
  name: '产品码回溯',
  category: 'run',
  icon: backtrack,
  // authorizationRequired: true,
  canvasView: provider(ProductBacktrack),
  settingsView: Setting,
}
