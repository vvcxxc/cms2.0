import { reactive, ref, onUnmounted } from 'vue'
import sdk from 'sdk'
import { ElMessage } from 'element-plus'

const subs = [
  {
    id: 'BarcodeGenerativeRule',
    name: '条码生成规则',
  },
  {
    id: 'BarcodeCheckRule',
    name: '条码校验规则',
  },
  {
    id: 'BarcodeAnalysis',
    name: '条码解析规则',
  },
  
  // {
  //   id: 'BarcodeGenerativeRule-edit',
  //   name: '条码生成规则-编辑',
  // },
  // {
  //   id: 'BarcodeGenerativeRule-add',
  //   name: '条码生成规则-添加',
  // },
  // {
  //   id: 'BarcodeGenerativeRule-delete',
  //   name: '条码生成规则-删除',
  // },
  {
    id: 'BarcodeAnalysis-edit',
    name: '条码解析规则-编辑',
  },
  {
    id: 'BarcodeAnalysis-add',
    name: '条码解析规则-添加',
  },
  {
    id: 'BarcodeAnalysis-delete',
    name: '条码解析规则-删除',
  },
] as const
export const permissionCodes = ref<any[]>([])
export const initPermission = (props: any) => {
  // // 前端页面权限设置
  const node = reactive(props.node)

  const permissions =
    process.env.NODE_ENV === 'development'
      ? []
      : //@ts-ignore
        window.app.current.project?.current.page?.permissions
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
      widgets: ['BarcodeGenerativeRule'],
    }
  }

  if (userInfo.permissions.all) {
    permissionCodes.value = permission.subs.map((item) => item.id)
  } else {
    permissionCodes.value = userInfo.permissions.widgets
  }

  onUnmounted(() => {
    if (node) {
      const index = permissions.findIndex((f: any) => f.id === node?.id)
      if (index !== -1) {
        permissions.splice(index, 1)
      }
    }
  })
}

export const isHasPermission = (code: (typeof subs)[number]['id']) => {
  if (!permissionCodes.value.includes(code)) {
    ElMessage.warning('用户没有该权限！')
    return false
  }
  return true
}
