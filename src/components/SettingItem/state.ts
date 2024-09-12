import { reactive } from 'vue'

type State = {
  init: boolean
  /**
   * 配置栏当前选中项，选中项展开，未选中项折叠
   * */
  SettingItemModel: string | string[]
  // 手风琴效果
  accordion: boolean
}
export const state = reactive<State>({
  init: true,
  SettingItemModel: '',
  accordion: false,
})
