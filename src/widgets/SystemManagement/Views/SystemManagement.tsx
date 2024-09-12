import { DefineComponent, defineComponent, onMounted, ref } from 'vue'
import styles from './SystemManagement.module.scss'
import BaseContent from '@/components/BaseContent/BaseContent'
import { useProvideModels } from '@/libs/Provider/app'
import { useSystem } from '../Controllers/Configure'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { useEditionFeature } from '@/libs/Permission/Permission'
import { _t } from '../app'
import Menu from './Components/Menu/Menu'
import Content from './Components/Content/Content'
interface PluginType {
  name: string
  id: string
  widget: any
  sort: number
  initConfig?: () => any
}
export default defineComponent({
  name: '系统管理',
  directives: {
    permission: vPermission,
  },
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    usePermission(props, permissionCodes)
    const { onUpdate } = useSystem(props, ctx)
    const plugins = import.meta.glob('./Pages/Plugins/**/index.ts', {
      eager: true,
    })
    const active = ref('base')
    const menus = ref<PluginType[]>([])
    const menuMap: Record<string, PluginType> = {}
    /**
     * 会进行form校验,只有菜单切换成功才会触发
     * @param id
     */
    const onAction = (id: string) => {
      active.value = id
    }

    const init = () => {
      const tempArray: any = []
      Object.entries(plugins).forEach(([key, value]: any[]) => {
        const plugin = value.default
        if (plugin.name) {
          tempArray.push(plugin)
          menuMap[plugin.id] = plugin
        }
      })
      menus.value = tempArray.sort((a: PluginType, b: PluginType) => {
        return a.sort - b.sort
      })
    }

    init()

    return () => {
      const menu = menuMap[active.value]
      const Widget: DefineComponent = menu.widget
      return (
        <BaseContent
          customClass={styles.baseContent}
          v-slots={{
            footer: () => {
              return (
                <span class={styles.btnStyle}>
                  <el-button
                    v-permission="system-management-update"
                    onClick={() => onUpdate(menu)}
                    class={styles.primaryBtn}
                    type="primary"
                  >
                    {_t('更新配置')}
                  </el-button>
                </span>
              )
            },
          }}
          title={_t('通用设置')}
          icon="sys"
        >
          <Menu menus={menus.value} onActive={onAction} />
          <Content menuMap={menuMap} active={active.value}>
            <Widget />
          </Content>
        </BaseContent>
      )
    }
  },
})
