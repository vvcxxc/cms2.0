import OrderManagement from './OrderManagement.vue'
import OrderManagements from './OrderManagement.settings.vue'
import { provider } from '@/provider/index'
import order from '../../assets/svg/order.svg'

export default {
  is: 'OrderManagement',
  name: '工单管理',
  category: 'run',
  icon: order,
  authorizationRequired: true,
  canvasView: provider(OrderManagement),
  settingsView: OrderManagements,
}
