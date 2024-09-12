import { reactive, ref, onUnmounted, provide, inject } from 'vue'
// @ts-ignore
import sdk from 'sdk'
import { ElMessage } from 'element-plus'
const KEY = 'QUALITY_MANAGEMENT_PERMISSION'
const isDev = process.env.NODE_ENV === 'development'

export function usePermission(props: any) {
  // 前端页面权限设置
  const node = reactive(props.node)

  const subs = [
    {
      id: 'ToDoUnqualified',
      name: '待办不良品',
    },
    {
      id: 'JudgmentRecord',
      name: '产品判定记录',
    },
    {
      id: 'ToDoUnqualified-judgment',
      name: '待办不良品-判定',
    },
    {
      id: 'ToDoUnqualified-configuration',
      name: '待办不良品-配置',
    },
    {
      id: 'JudgmentRecord-export',
      name: '产品判定记录-导出',
    },
  ]

  const subsType = subs.map((e) => e.id)

  const allTabs = ['ToDoUnqualified', 'JudgmentRecord']

  const permissionCodes = ref<any[]>([])

  const showTabs: any = ref([])

  // @ts-ignore
  const permissions = isDev
    ? []
    : window.app?.current.project?.current.page?.permissions

  const permission = {
    id: node?.id,
    name: node?.name,
    subs,
  }
  if (
    permissions.every((item: typeof permission) => item.id !== permission.id)
  ) {
    permissions.push(permission)
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
      console.log('all', permissionCodes)
    } else {
      permissionCodes.value = userInfo.permissions.widgets
      permissionCodes.value.forEach((item: any) => {
        if (allTabs.includes(item)) {
          showTabs.value.push(item)
        }
      })
      console.log(permissionCodes)
    }
  }

  const curTab: any = ref('ToDoUnqualified')
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
      const index = permissions.findIndex((f: any) => f.id === node?.id)
      if (index !== -1) {
        permissions.splice(index, 1)
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
