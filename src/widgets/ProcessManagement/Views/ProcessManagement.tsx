import { defineComponent, Ref, ref } from 'vue'
import styles from './ProcessManagement.module.scss'
import Process from './Pages/Process/Process'
import Station from './Pages/Station/Station'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { useEditionFeature } from '@/libs/Permission/Permission'
import { _t } from '../app'
import { Language } from '@/libs/Language/Language'

export default defineComponent({
  name: '工序管理',
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
      rf.value?.[v]?.reloadList()
    }
    const tabData = ref<any[]>([])
    const setTabData = () => {
      tabData.value = [
        {
          label: _t('工序列表'),
          name: 'process',
          hidden: !isPermission('workSection-list'),
          lazy: true,
          component: () => (
            <Process ref={(r: any) => (rf.value['process'] = r)} />
          ),
        },
        {
          label: _t('工位列表'),
          name: 'station',
          lazy: true,
          hidden: !isPermission('workStation-list'),
          component: () => (
            <Station ref={(r: any) => (rf.value['station'] = r)} />
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
        <div class={styles.ProcessManagement}>
          <Tab data={tabData.value} type="list" onTab={onTabChange} />
        </div>
      )
    }
  },
})
