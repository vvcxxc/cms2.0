import ProductDelivery from './Views/ProductDelivery'
import ProductDeliverySettings from './Settings/ProductDelivery.settings'
import { provider } from '@/provider/index'
import T from '../../assets/svg/T.svg'

export default {
  is: 'ProductDelivery',
  name: '产品输送',
  category: 'run',
  icon: T,
  // authorizationRequired: true,
  canvasView: provider(ProductDelivery, true),
  settingsView: ProductDeliverySettings,
}
