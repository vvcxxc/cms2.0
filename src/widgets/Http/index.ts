import Http from './Http.vue'
import HttpSettings from './Settings/Http.settings.vue'
import http from '@/assets/images/http.png'

export default {
  is: 'Http请求',
  name: 'API请求',
  category: 'test',
  icon: http,
  // authorizationRequired: true,
  canvasView: Http,
  settingsView: HttpSettings,
}
