import { reactive, ref, onUnmounted, provide, inject } from 'vue'
// @ts-ignore
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
const KEY = 'ORDER_MANAGEMENT_PERMISSION'
const isDev = process.env.NODE_ENV === 'development'

export function usePermission(props: any) {
  // 前端页面权限设置
  const node = reactive(props.node || {})

  const subs = [
    {
      id: 'Order-tabs-management',
      name: '工单管理Tab',
    },
    {
      id: 'Order-tabs-records',
      name: '工单记录Tab',
    },
    {
      id: 'OrderManagement-actions-add',
      name: '添加',
    },
    {
      id: 'OrderManagement-actions-update',
      name: '编辑',
    },
    {
      id: 'OrderManagement-actions-delete',
      name: '删除',
    },
    {
      id: 'OrderManagement-actions-export',
      name: '导出',
    },
    {
      id: 'OrderManagement-actions-import',
      name: '导入',
    },
    {
      id: 'OrderManagement-actions-download',
      name: '下载模板',
    },
    {
      id: 'OrderManagement-actions-deliver',
      name: '下发',
    },
    {
      id: 'OrderManagement-actions-pause',
      name: '暂停',
    },
    {
      id: 'OrderManagement-actions-finish',
      name: '结束',
    },
    {
      id: 'OrderManagement-actions-sort',
      name: '排序',
    },
    {
      id: 'OrderRecords-actions-export',
      name: '导出',
    },
  ]

  const subsType = subs.map((e) => e.id)

  const allTabs = ['Order-tabs-management', 'Order-tabs-records']

  const permissionCodes = ref<any[]>([])

  const showTabs: any = ref([])

  // @ts-ignore
  const page = isDev
    ? {
        permissions: [],
      }
    : window.app.current.project?.current.page
  const permission = {
    id: node?.id,
    name: node?.name,
    subs,
  }
  if (
    page.permissions.every(
      (item: typeof permission) => item.id !== permission.id
    )
  ) {
    page.permissions.push(permission)
  }

  const initPermission = () => {
    const userInfo = sdk.userInfo

    // mock data
    if (isDev) {
      userInfo.permissions = {
        all: false,
        // @ts-ignore
        widgets: subs.map((item) => item.id),
      }
    }

    if (userInfo.permissions.all) {
      permissionCodes.value = permission.subs.map((item) => item.id)
      showTabs.value = allTabs
    } else {
      permissionCodes.value = userInfo.permissions.widgets
      permissionCodes.value.forEach((item: any) => {
        if (allTabs.includes(item)) {
          showTabs.value.push(item)
        }
      })
    }
  }

  const curTab: any = ref('OrderManagement')
  const changeTab = (tab: string) => {
    curTab.value = tab
  }

  const isHasPermission = (code: (typeof subsType)[number]) => {
    if (!permissionCodes.value.includes(code)) {
      ElMessage.warning('用户没有该权限！')
      return false
    }
    return true
  }

  onUnmounted(() => {
    if (node) {
      const index = page.permissions.findIndex((f: any) => f.id === node?.id)
      if (index !== -1) {
        page.permissions.splice(index, 1)
      }
    }
  })

  return {
    permissionCodes,
    showTabs,
    initPermission,
    isHasPermission,
    curTab,
    changeTab,
  }
}

// @ts-ignore
export function createProvider(props: any): ReturnType<typeof useStore> {
  let value = usePermission(props)
  provide(KEY, value)
  return value
}

export function createInjector(): ReturnType<typeof usePermission> {
  return inject(KEY) as ReturnType<typeof usePermission>
}
