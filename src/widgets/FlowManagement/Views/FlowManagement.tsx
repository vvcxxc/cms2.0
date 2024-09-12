import { defineComponent, provide } from 'vue'
import styles from './FlowManagement.module.scss'
import Content from '@/components/Content/Content'
import Tab from '@/components/Tab/Tab'
import { useProvideModels } from '@/libs/Provider/app'
import Flow from './Pages/Flow/Flow'
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { useEditionFeature } from '@/libs/Permission/Permission'
import { _t, LanguageScopeKey } from '../app'

export default defineComponent({
  name: '流程管理',
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
    provide('LanguageScopeKey', LanguageScopeKey)
    return () => {
      return (
        <Content title={_t('流程管理')}>
          <Flow />
        </Content>
      )
    }
  },
})
