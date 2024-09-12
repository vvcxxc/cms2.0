import ProductManagement from './Views/ProductManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import prod from '@/assets/svg/prod.svg'

export default {
  is: 'ProductManagement',
  name: '产品管理',
  category: 'run',
  icon: prod,
  authorizationRequired: true,
  canvasView: provider(ProductManagement),
  settingsView: Setting,
}
