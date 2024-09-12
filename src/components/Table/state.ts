import { ref, provide, inject } from 'vue'

export const createProvide = (key: string, methods: Record<string, any>) => {
  provide(key, methods)
}

export const useInject = (key: string) => {
  return inject(key)
}
