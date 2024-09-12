import { get, isNil } from 'lodash'
import { defineEmits, PropType, computed } from 'vue'

export const useHook = (props: any, emit: any) => {
  /**
   * 创建计算属性，监听cms组件的props变化
   * @param key 属性Key
   * @returns
   */
  const createComputed = (key: string, defaultValue?: any) => {
    return computed({
      get() {
        const v = isNil(props[key]) ? defaultValue : props[key]
        return v
      },
      set(v) {
        emit('update', { [key]: v })
      },
    })
  }
  /**
   * 获取计算属性，监听cms组件的props变化
   * @param key 属性Key
   * @returns
   */
  const getComputedProp = (key: string, defaultValue?: any) => {
    return computed(() => {
      return get(
        props,
        `node.props.${key}`,
        !isNil(defaultValue) ? defaultValue : ''
      )
    })
  }
  return {
    createComputed,
    getComputedProp,
  }
}
