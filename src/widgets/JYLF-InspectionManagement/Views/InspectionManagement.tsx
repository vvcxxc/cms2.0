import { defineComponent, Ref, ref } from 'vue'
import styles from './InspectionManagement.module.scss'
import Task from './Pages/Task'
import Record from './Pages/Record'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { Language } from '@/libs/Language/Language'

export default defineComponent({
  name: '点检管理',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
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
          label: '点检任务',
          name: 'task',
          hidden: !isPermission('task-list'),
          lazy: true,
          component: () => <Task ref={(r: any) => (rf.value['task'] = r)} />,
        },
        {
          label: '点检记录',
          name: 'record',
          lazy: true,
          hidden: !isPermission('record-list'),
          component: () => (
            <Record ref={(r: any) => (rf.value['record'] = r)} />
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
        <div class={styles.InspectionManagement}>
          <Tab data={tabData.value} type="list" onTab={onTabChange} />
        </div>
      )
    }
  },
})
