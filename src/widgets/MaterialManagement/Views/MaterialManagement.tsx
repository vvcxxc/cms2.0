import { defineComponent } from 'vue'
import styles from './MaterialManagement.module.scss'
import { useMaterial } from '../Controllers/Material'
import BaseTable from '@/components/Table/Table'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import MaterialFormDialog from './Pages/Dialog/MaterialFormDialog/MaterialFormDialog'
import { useProvideModels } from '@/libs/Provider/app'
import Search from '@/components/Search/Search'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { createProvider } from '../store/MaterialStore'
import Content from '@/components/Content/Content'
import Material from './Components/Material/Material'
import MaterialCode from './Components/MaterialCode/MaterialCode'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '物料管理',
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
    createProvider(props, ctx)
    return () => {
      return (
        <Content title="物料管理">
          <div class={styles.content}>
            <div class={styles.list}>
              <Material />
            </div>
            <div class={styles.details}>
              <MaterialCode />
            </div>
          </div>
        </Content>
      )
    }
  },
})
