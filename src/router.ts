import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  createWebHistory,
} from 'vue-router'
import pkg from '../package.json'
import sdk from 'sdk'
import { menu, menuMap } from '@/config/menu'
import { h } from 'vue'
const { request } = sdk.utils
const routes: Array<{
  name: string
  path: string
  component: any
  icon: any
  meta: {
    widgetName: string
  }
}> = []

const widgetsMap: any = import.meta.glob('./widgets/*/*.vue')
const widgetsTsxMap: any = import.meta.glob('./widgets/*/Views/*.tsx')

const Map = Object.assign(widgetsMap, widgetsTsxMap)
for (const filePath in Map) {
  if (!filePath.match(/.*\.settings\.vue/)) {
    const component = widgetsMap[filePath]
    const patchName = filePath.split('/')[2]

    routes.push({
      path: `/${pkg.name}/` + patchName,
      name: menuMap[patchName].name,
      icon: menuMap[patchName].icon,
      meta: {
        widgetName: patchName,
      },
      component,
    })
  }
}
const allRoutes = routes[0]
  ? [
      {
        ...routes[0],
        path: '/',
        name: '默认页',
      },
      ...routes,
    ]
  : routes
console.log(allRoutes, 'routes')

export const routeInfo = {
  routes: menu,
}
export const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes,
})

let lastProjectId = sessionStorage.getItem('X-Project')

const initCMSToken = async () => {
  const XProject: any = sessionStorage.getItem('X-Project')
  const token = sessionStorage.getItem('Token')
  let type = ''
  if (!token) {
    type = 'Tourist'
  }
  if (!token || (XProject && lastProjectId !== XProject)) {
    lastProjectId = XProject
    sessionStorage.setItem('X-Project', XProject)

    // token
    const rs = await request({
      url: `/api/v1/auth/requesttoken`,
      method: 'post',
      data: type,
      // data: 'string',
    })
    sessionStorage.setItem('Token', rs)
  }
}

router.beforeEach(() => {
  initCMSToken()
})
