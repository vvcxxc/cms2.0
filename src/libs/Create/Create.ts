/**
 * 创建一个对象
 */
export class Create<T> {
  constructor(args: T) {
    this.init(args)
  }

  [key: string]: any

  /**
   * 初始化对象，要求结构[[key, value]] 或 { key: value }
   *
   * new Create([1,2]) or new Create({ 1: 2 })
   * @param args
   */
  private init(args: T) {
    if (Array.isArray(args)) {
      args.forEach(([key, value = '']) => {
        this[key] = value
      })
    } else if (args instanceof Object) {
      Object.entries(args).forEach(([key, value = '']) => {
        this[key] = value
      })
    }
  }

  /**
   * 设置值
   * @param key
   * @param value
   * @returns void
   */
  set(key: string, value: any) {
    return (this[key] = value)
  }
  /**
   * 获取值
   * @param key
   * @returns any
   */
  get(key: string) {
    return this[key]
  }

  /**
   * 删除值
   * @param key
   */
  remove(key: string) {
    delete this[key]
  }
  /**
   * 添加值
   * @param key
   * @param value
   * @returns
   */
  insert(key: string, value: any) {
    return (this[key] = value)
  }

  /**
   * 更新数据
   * @param o
   * @returns
   */
  update(o: T) {
    this.init(o)
  }
  /**
   * 重置对象
   */
  reset() {
    Object.entries(this).forEach(([key, value]: string[]) => {
      if (typeof this[key] !== 'function') {
        this.remove(key)
      }
    })
  }
}
