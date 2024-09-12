import { defineComponent } from 'vue'
import Content from '@/components/Content/Content'
import { useProvideModels } from '@/libs/Provider/app'
import Home from './Pages/Home/Home'

export default defineComponent({
  setup(props, ctx) {
    useProvideModels()
    return () => {
      return (
        <Content title="角色工位权限">
          <Home />
        </Content>
      )
    }
  },
})
