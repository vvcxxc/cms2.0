import SPCBasicRuleSettings from './Views/SPCBasicRuleSettings'
import Setting from '@/components/Setting/Setting'
import { provider } from '@/provider/index'
import baseRule from '../../assets/svg/baseRule.svg'

export default {
  is: 'SPCBasicRuleSettings',
  name: '基础规则设置',
  category: 'run',
  icon: baseRule,
  authorizationRequired: true,
  canvasView: provider(SPCBasicRuleSettings),
  settingsView: Setting,
}
