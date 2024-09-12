import { defineComponent } from 'vue'
import styles from './SearchInput.module.scss'
import {
  Search,
  ArrowLeft,
  ArrowRight,
  CloseBold,
} from '@element-plus/icons-vue'

export default defineComponent({
  name: '输入',
  setup(props, { attrs, slots, emit }) {
    return () => {
      return (
        <div class={styles.inputContent}>
          <el-input
            {...attrs}
            size="small"
            prefix-icon={
              <el-icon>
                <Search />
              </el-icon>
            }
            suffix-icon={
              <div class={styles.searchInputIcon}>
                <el-icon class={styles.searchIcon}>
                  <ArrowLeft />
                </el-icon>
                <span class={styles.boxNum}>
                  <span>3</span>
                  /7
                </span>
                <el-icon class={styles.searchIcon}>
                  <ArrowRight />
                </el-icon>
              </div>
            }
            placeholder="请选择输入"
          ></el-input>
          <el-icon class={styles.closeIcon}>
            <CloseBold />
          </el-icon>
        </div>
      )
    }
  },
})
