import { createModels } from '@/libs/Provider/Provider'
type ModuleType = Record<string, Function>

const Models: ModuleType = import.meta.glob('./Models/*.{js,ts}', {
  eager: true,
})

export const useProvideModels = () => createModels({ Models })
