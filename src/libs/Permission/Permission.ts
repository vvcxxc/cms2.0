import {
  reactive,
  ref,
  onUnmounted,
  VNode,
  DirectiveBinding,
  Directive,
  computed,
} from 'vue'
import { ElMessage } from 'element-plus'
import sdk from 'sdk'
import { Permission, UserInfo, Props, EditionTypeEnum } from './Permission.d'
import { useGlobalState } from '../Store/Store'
import { FeatureType } from '../Store/Store.d'

import { clone, cloneDeep, isBoolean } from 'lodash'
import { editionMap } from '../enum'

/**
 * 开发环境
 */
const isDev = process.env.NODE_ENV === 'development'
/**
 * 组件子权限
 */
let subsPermissions: Permission[] = []
/**
 * 临时缓存权限
 */
const permissionCodes = ref<string[]>([])

const featureMap = ref<Record<string, FeatureType>>({})

/**
 * 校验权限，发出警告
 * @param code
 * @returns
 */
const isPermission = (code: (typeof subsPermissions)[number]['id'], isHint = true) => {
  if (!permissionCodes.value.includes(code)) {
    isHint && ElMessage.warning('用户没有该权限！')
    return false
  }
  return true
}

export const vPermission: { [key: string]: Directive } = {
  created(
    el: HTMLElement,
    binding: DirectiveBinding,
    vNode: VNode,
    prevVNode: VNode
  ) {
    el.addEventListener(
      'click',
      (event: Event) => {
        if (!isPermission(binding.value)) {
          event.stopPropagation()
          return false
        }
      },
      true
    )
  },
}

/**
 * 设置权限
 * @param permissionMap
 */
const setPermissions = (permissionMap: Record<string, string>) => {
  Object.entries(permissionMap).forEach(([key, value]) => {
    subsPermissions.push({
      id: key,
      name: value,
    })
  })
}

export const vEditionShow: { [key: string]: Directive } = {
  updated(el: HTMLElement, binding: DirectiveBinding<EditionTypeEnum>) {
    if (el) {
      const state: Record<string, any> = useGlobalState()
      const l = Object.keys(state.featureMap.state.value)?.length
      const featureKeys = binding.value
        .split(',')
        .filter((v) => v)
        .map((v: string) => {
          return editionMap[v]
        })
      if (!isEdition(featureKeys) && l) {
        el.remove()
      }
    }
  },
}

/**
 * 判断是否有该功能
 * @param feature
 * @returns
 */
export const isEdition = (features: string[], condition = true) => {
  const state: Record<string, any> = useGlobalState()
  const l = Object.keys(state.featureMap.state.value)?.length
  if (l) {
    features = features.filter((v) => v)
    if (features.length === 0) return true
    let newFeatures = features
    if (features[0].length < 3) {
      newFeatures = features.map((v) => {
        return editionMap[v]
      })
    }

    if (!Object.keys(featureMap.value).length) {
      featureMap.value = state.featureMap.state.value
    }
    const check = newFeatures.every((key: string) => {
      return featureMap?.value?.[key]?.value
    })
    return check && condition
  }
}

/**
 * 功能版本控制
 */
export const useEditionFeature = async () => {
  const state = useGlobalState()
  const { getSystemConfig } = state

  await getSystemConfig(true)
  featureMap.value = state.featureMap.state.value
}

/**
 * 初始化权限
 * @param props
 * @param permissionMap
 * @example usePermission(props, {
 *    'user-add': '新增用户',
 *  })
 */
export const usePermission = (
  props: Props | any,
  permissionMap: Record<string, string>
) => {
  subsPermissions = []
  permissionCodes.value = []
  setPermissions(permissionMap)
  const node = computed(() => props.node || {})

  const page = isDev
    ? {
        permissions: [],
      }
    : window.app.current.project?.current.page
  const permission = {
    id: node.value?.id,
    name: node.value?.name,
    subs: subsPermissions,
  }

  page.permissions = page.permissions || []

  if (
    page.permissions.every(
      (item: typeof permission) => item.id !== permission.id
    )
  ) {
    page.permissions.push(permission)
  }
  const userInfo: UserInfo = isDev
    ? { permissions: { all: true, widgets: [] } }
    : sdk.userInfo

  const { all, widgets } = userInfo.permissions
  permissionCodes.value = all
    ? permission.subs.map((item: Permission) => item.id)
    : widgets

  onUnmounted(() => {
    if (node.value) {
      const index = page.permissions.findIndex(
        (f: any) => f.id === node.value?.id
      )
      if (index !== -1) {
        page.permissions.splice(index, 1)
      }
    }
  })

  return {
    isPermission,
  }
}
