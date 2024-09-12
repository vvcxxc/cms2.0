import { computed, defineComponent, Fragment, ref } from 'vue'
import styles from './Menu.module.scss'
import { ElMessage } from 'element-plus'
import {
  checkUnique,
  formRef,
  productTableRef,
} from '../../../Controllers/State'
import { _t } from '../../../app'

export default defineComponent({
  name: 'Menu',
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
    active: {
      type: String,
      default: '',
    },
  },
  emits: ['active'],
  setup(props, { emit }) {
    const active = ref(props.active)
    const onSelect = (key: string, keyPath: string) => {
      formRef.value.validate().then(async (valid: boolean, err: Error) => {
        active.value = key
        emit('active', key)
        if (valid) {
          if (productTableRef.value) {
            const data = productTableRef.value?.getData()

            if (!data) return
            if (checkUnique(data)) {
              return ElMessage.error(_t('产线段不可重复，请检查'))
            }
          }
        } else {
          console.log(err)
        }
      })
    }
    const groupMenu = computed(() => {
      return props.menus.filter((item: any) => {
        if (item.type === 'group') return item
      })
    })
    return () => {
      const menus = props.menus || []
      return (
        <div class={styles.menuContent}>
          <el-menu
            default-active={active.value}
            class={styles.menu}
            onSelect={onSelect}
          >
            {menus.map((item: any, index) => {
              if (item.type === 'group') return
              if (index === 2) {
                return (
                  <Fragment>
                    <el-sub-menu
                      index="1"
                      class={styles.groupMenu}
                      v-slots={{
                        title: () => (
                          <span>
                            <span>{_t('功能设置')}</span>
                          </span>
                        ),
                      }}
                    >
                      <el-menu-item-group class={styles.itemGroupMenu}>
                        {groupMenu.value.map((item: any) => {
                          return (
                            <el-menu-item class={styles.item} index={item.id}>
                              {_t(item.name)}
                            </el-menu-item>
                          )
                        })}
                      </el-menu-item-group>
                    </el-sub-menu>
                    <el-menu-item
                      key={item.id}
                      index={item.id}
                      class={styles.itemMenu}
                    >
                      <span>{_t(item.name)}</span>
                    </el-menu-item>
                  </Fragment>
                )
              }
              return (
                <el-menu-item
                  key={item.id}
                  index={item.id}
                  class={styles.itemMenu}
                >
                  <span>{_t(item.name)}</span>
                </el-menu-item>
              )
            })}
          </el-menu>
        </div>
      )
    }
  },
})
