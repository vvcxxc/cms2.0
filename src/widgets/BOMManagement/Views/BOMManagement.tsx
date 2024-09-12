import { defineComponent } from 'vue'
import styles from './BOMManagement.module.scss'
import BOMDetails from './Components/BOMDetails/BOMDetails'
import BOMList from './Components/BOMList/BOMList'
import { useProvideModels } from '@/libs/Provider/app'
import { createProvider } from '../store/BillofStore'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import Content from '@/components/Content/Content'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: 'BOM管理',
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
    createProvider(props, ctx)
    return () => {
      return (
        <Content title="BOM管理">
          <div class={styles.content}>
            <div class={styles.BOMList}>
              <BOMList />
            </div>
            <div class={styles.BOMDetails}>
              <BOMDetails />
            </div>
          </div>
        </Content>
      )
    }
  },
})
