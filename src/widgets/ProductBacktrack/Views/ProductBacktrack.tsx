import { defineComponent } from 'vue'
import Content from '@/components/Content/Content'
import { useProvideModels } from '@/libs/Provider/app'
import Backtrack from './Pages/Backtrack/Backtrack'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'

export default defineComponent({
  name: '一码回溯',
  setup(props, ctx) {
    useProvideModels()
    usePermission(props, permissionCodes)

    return () => {
      return (
        <Content title="一码回溯">
          <Backtrack />
        </Content>
      )
    }
  },
})
