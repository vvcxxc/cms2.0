import { defineComponent, ref } from 'vue'
import styles from './ConsoleManagement.module.scss'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { useEditionFeature } from '@/libs/Permission/Permission'
import { _t } from '../app'
import { Language } from '@/libs/Language/Language'
import Console from './Pages/Console/Console'
import ConsoleRecord from './Pages/ConsoleRecord/ConsoleRecord'

export default defineComponent({
  name: '控制台',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    const { isPermission } = usePermission(props, permissionCodes)

    const rf = ref<{
      [key: string]: any
    }>({})
    const onTabChange = (v: string) => {
      rf.value?.[v]?.onSearch?.()
    }
    const tabData = ref<any[]>([])
    const setTabData = () => {
      tabData.value = [
        {
          label: _t('控制页面'),
          name: 'console',
          lazy: true,
          component: () => (
            <Console
              node={props.node}
              ref={(r: any) => (rf.value['console'] = r)}
            />
          ),
        },
        {
          label: _t('控制记录'),
          name: 'consoleRecord',
          lazy: true,
          component: () => (
            <ConsoleRecord ref={(r: any) => (rf.value['consoleRecord'] = r)} />
          ),
        },
      ]
    }
    setTabData()
    Language.useChange(async (lang: typeof Language) => {
      setTabData()
    })

    return () => {
      return (
        <div class={styles.ConsoleManagement}>
          <Tab data={tabData.value} type="list" onTab={onTabChange} />
        </div>
      )
    }
  },
})
