import { computed, defineComponent, onMounted, ref } from 'vue'
import styles from './BaseDrawer.module.scss'
import Icon from '../Icon/Icon'
import { _t } from '@/libs/Language/Language'

//@ts-ignore
export default defineComponent<{
  [key: string]: any
}>({
  // @ts-ignore
  name: 'BaseDrawer',
  props: {
    // 遮罩是否可点击
    clickable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    submitDisabled: {
      type: Boolean,
      default: false,
    },
    // modelValue: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  emits: ['close', 'confirm', 'update:modelValue', 'open', 'beforeClose'],
  setup(props: any, { emit, slots, attrs }: any) {
    // const size = computed(() => {
    //   if (attrs.size.includes('px')) {
    //     return attrs.size
    //   }
    // })

    // const model = computed(() => {
    //   if (attrs.model.includes('')) {
    //     return attrs.model
    //   }
    // })

    return () => {
      return (
        <div
          class={styles.drawContent}
          //@ts-ignore
          // style={props.clickable ? { '--drawer-width': size.value } : {}}
        >
          <el-drawer
            // modal-class={props.clickable ? styles.modal : ''}
            class={{
              [styles.informationDrawer]: true,
              // [styles.informationDrawerPosition]: props.clickable,
            }}
            onOpen={() => emit('open')}
            onClose={() => emit('close')}
            v-slots={{
              footer() {
                return (
                  <div class={styles.csDialogFooter}>
                    <el-button
                      onClick={() => emit('close')}
                      type="info"
                      plain
                      class={{
                        [styles.dialogBtn]: true,
                        [styles.csBaseBtn]: true,
                      }}
                    >
                      {_t('取消')}
                    </el-button>
                    <el-button
                      onClick={() => emit('confirm')}
                      type="primary"
                      disabled={props.submitDisabled}
                      class={{
                        [styles.csBaseBtn]: true,
                      }}
                    >
                      {_t('确认')}
                    </el-button>
                  </div>
                )
              },
            }}
            append-to-body={true}
            {...attrs}
            title={props.title}
            size={props.width || attrs.size}
          >
            <Icon
              width={167}
              height={54}
              class={styles.iconPosition}
              icon="drawer_bg"
            />
            {slots.default?.()}
          </el-drawer>
        </div>
      )
    }
  },
})
