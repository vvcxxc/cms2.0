// @ts-nocheck
import './cms/index.css'
import { createApp, ComponentPublicInstance } from 'vue'
import App from './App.vue'
import { setXProject } from './api/index'
import { router, routeInfo } from './router'
import {
  renderWithQiankun,
  qiankunWindow,
} from 'vite-plugin-qiankun/dist/helper'
let instance: ComponentPublicInstance | null = null
import sdk from 'sdk'

function render(props = {}) {
  instance = createApp(App)
  instance.use(router)
  instance.use(sdk.lib.useTable)
  setXProject()
  instance.mount('#app')
}

renderWithQiankun({
  mount(props) {
    props.setGlobalState(routeInfo)
    render(props)
  },
  bootstrap() {
    console.log('bootstrap')
  },
  unmount(props: any) {
    instance.$destroy()
    instance.$el.innerHTML = ''
    instance = null
  },
})

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
