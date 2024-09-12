/// <reference types="vue/macros-global" />
/// <reference types="vite/client" />

declare module '*.vue' {
  import { Component, ComponentOptions } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  // const ComponentOptions: ComponentOptions
  // const component: DefineComponent<{}, {}, any>
  export default Component
}
