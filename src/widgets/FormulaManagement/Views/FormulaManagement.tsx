import { defineComponent } from 'vue'
import styles from './FormulaManagement.module.scss'
import Management from './Pages/Management/Management'
import Apply from './Pages/Apply/Apply'
import Log from './Pages/Log/Log'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '配方管理',
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
    const tabData = [
      {
        label: '配方管理',
        name: 'management',
        hidden: false,
        lazy: true,
        component: Management,
      },
      {
        label: '配方应用',
        name: 'apply',
        lazy: true,
        hidden: false,
        component: Apply,
      },
      {
        label: '配方日志',
        name: 'log',
        lazy: true,
        hidden: false,
        component: Log,
      },
    ]
    return () => {
      return (
        <div class={styles.FormulaManagement}>
          <Tab data={tabData} type="list" />
        </div>
      )
    }
  },
})
