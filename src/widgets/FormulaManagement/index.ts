import FormulaManagement from './Views/FormulaManagement'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import f from '../../assets/svg/f.svg'

export default {
  is: 'FormulaManagement',
  name: '配方管理',
  category: 'run',
  icon: f,
  authorizationRequired: true,
  canvasView: provider(FormulaManagement),
  settingsView: Setting,
}
