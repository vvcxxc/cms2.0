import { defineComponent } from 'vue'
import Content from '@/components/Content/Content'
import { useProvideModels } from '@/libs/Provider/app'
import Backtrack from './Pages/Backtrack/Backtrack'
import { permissionCodes } from '../enum'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
export default defineComponent({
  name: '产品码回溯',
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
    useProvideModels()
    usePermission(props, permissionCodes)
    return () => {
      return (
        <Content title="产品码回溯">
          <Backtrack />
        </Content>
      )
    }
  },
})
