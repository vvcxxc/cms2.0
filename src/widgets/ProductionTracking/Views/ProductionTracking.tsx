import { defineComponent, inject, Ref, ref, watch } from 'vue'
import styles from './ProductionTracking.module.scss'
import Trace from './Pages/Trace/Trace'
import { useProvideModels } from '@/libs/Provider/app'
import { usePermission, vPermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'
import { useEditionFeature } from '@/libs/Permission/Permission'
import { _t } from '../app'

export default defineComponent({
  name: '生产跟踪',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
    isFilter: {
      type: Boolean,
      default: true,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    num: {
      type: Number,
      default: 3,
    },
    productId: {
      type: String,
      default: '',
    },
    workSectionId: {
      type: String,
      default: '',
    },
    productModel: {
      type: String,
      default: '',
    },
    dataConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  directives: {
    permission: vPermission,
  },
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    const { isPermission } = usePermission(props, permissionCodes)
    const isApp = inject('isApp')

    return () => {
      return (
        <div
          class={styles.RealTime}
          style={!isApp ? { width: '100%', height: '100%' } : {}}
        >
          <Trace {...props} />
        </div>
      )
    }
  },
})
