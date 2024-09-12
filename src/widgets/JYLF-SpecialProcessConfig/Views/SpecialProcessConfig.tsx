import { defineComponent, Ref, ref } from 'vue'
import styles from './SpecialProcessConfig.module.scss'
import SpecialProcess from './Pages/SpecialProcess/SpecialProcess'
import SpecialStation from './Pages/SpecialStation/SpecialStation'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
export default defineComponent({
  name: '特殊工艺配置管理',
  setup(props, ctx) {
    useProvideModels()
    const { isPermission } = usePermission(props, permissionCodes)

    const rf = ref<{
      [key: string]: any
    }>({})
    const onTabChange = (v: string) => {
      rf.value?.[v]?.reloadList()
    }
    const tabData = [
      {
        label: '工序列表',
        name: 'specialWorkSection',
        hidden: !isPermission('specialWorkSection-list'),
        lazy: true,
        component: () => (
          <SpecialProcess
            ref={(r: any) => (rf.value['specialWorkSection'] = r)}
          />
        ),
      },
      {
        label: '工位列表',
        name: 'specialWorkStation',
        hidden: !isPermission('specialWorkStation-list'),
        lazy: true,
        component: () => (
          <SpecialStation
            ref={(r: any) => (rf.value['specialWorkStation'] = r)}
          />
        ),
      },
    ]

    return () => {
      return (
        <div class={styles.SpecialProcessConfig}>
          <Tab data={tabData} type="list" onTab={onTabChange} />
        </div>
      )
    }
  },
})
