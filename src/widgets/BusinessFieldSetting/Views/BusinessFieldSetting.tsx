import { defineComponent } from 'vue'
import styles from './BusinessFieldSetting.module.scss'
import Content from '@/components/Content/Content'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import FieldList from './Pages/FieldList/FieldList'
import { useEditionFeature } from '@/libs/Permission/Permission'

export default defineComponent({
  name: '业务字段设置',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    return () => {
      return (
        <Content title="业务字段设置">
          <FieldList />
        </Content>
      )
    }
  },
})
