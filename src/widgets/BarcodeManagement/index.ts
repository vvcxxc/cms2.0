import BarcodeManagement from './BarcodeManagement.vue'
import BarcodeManagementSettings from './BarcodeManagement.settings.vue'
import { provider } from '@/provider/index'
import barcode from '../../assets/svg/barcode.svg'

export default {
  is: 'BarcodeManagement',
  name: '条码管理',
  category: 'run',
  icon: barcode,
  authorizationRequired: true,
  canvasView: provider(BarcodeManagement),
  settingsView: BarcodeManagementSettings,
}
