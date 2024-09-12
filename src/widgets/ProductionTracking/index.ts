import ProductionTracking from './Views/ProductionTracking'
import Setting from './Settings/ProductionTracking.settings.vue'
import { provider } from '@/provider/index'
import realTime from '../../assets/svg/realTime.svg'

export default {
  is: 'ProductionTracking',
  name: '生产跟踪',
  category: 'run',
  icon: realTime,
  authorizationRequired: true,
  canvasView: provider(ProductionTracking, false, {
    width: '600px',
    height: '220px',
    padding: 0,
    background: '#fff',
  }),
  settingsView: Setting,
}
