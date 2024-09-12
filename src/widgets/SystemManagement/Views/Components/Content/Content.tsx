import { defineComponent, Fragment } from 'vue'
import styles from './Content.module.scss'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'

export default defineComponent({
  name: 'Content',
  props: ['active', 'menuMap'],
  setup(props, ctx) {
    const slots = ctx.slots
    const { formData, formRef } = useConfigure(props, ctx)

    return () => (
      <Fragment>
        <div class={styles.rightContainer}>
          <div class={styles.header}>{props?.menuMap[props?.active]?.name}</div>
          <div class={styles.content}>
            <div class={styles.configure}>
              <el-form
                ref={formRef}
                class={styles.formStyleContent}
                label-width="145px"
                model={formData}
                label-position="left"
              >
                {slots.default && slots.default()}
              </el-form>
            </div>
          </div>
        </div>
      </Fragment>
    )
  },
})
