import ProductBacktrack from './Views/ProductBacktrack'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import prod from '@/assets/svg/prod.svg'

export default {
  is: 'ProductBacktrack',
  name: '一码回溯',
  category: 'run',
  icon: prod,
  // authorizationRequired: true,
  canvasView: provider(ProductBacktrack),
  settingsView: Setting,
}
