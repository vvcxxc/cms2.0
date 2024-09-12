import { reactive, ref, onUnmounted } from 'vue'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'

const subs = [
  {
    id: 'DefectList',
    name: '缺陷清单',
  },
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
export const permissionCodes = ref<any[]>([])
export const initPermission = (props: any) => {
  // // 前端页面权限设置
  const node = reactive(props.node)

  const permissions =
    process.env.NODE_ENV === 'development'
      ? []
      : window.app.current.project?.current.page?.permissions
  const permission = {
    id: node?.id,
    name: node?.name,
    subs,
  }

  permissions.push(permission)
  const userInfo = sdk.userInfo

  // mock data
  if (process.env.NODE_ENV === 'development') {
    userInfo.permissions = {
      all: true,
      widgets: [],
    }
  }

  if (userInfo.permissions.all) {
    permissionCodes.value = permission.subs.map((item) => item.id)
  } else {
    permissionCodes.value = userInfo.permissions.widgets
  }

  onUnmounted(() => {
    const index = permissions.findIndex((f: any) => f.id === node?.id)
    if (index !== -1) {
      permissions.splice(index, 1)
    }
  })
}

export const isHasPermission = (code: (typeof subsType)[number]) => {
  if (!permissionCodes.value.includes(code)) {
    ElMessage.warning('用户没有该权限！')
    return false
  }
  return true
}
