import { TipTypeEnum } from './Types/index.d'

/** 初始化状态或动作的常量 */
export const Init = 'Init'

/** 更新状态或动作的常量 */
export const Update = 'Update'

/** 销毁状态或动作的常量 */
export const Destroy = 'Destroy'

/** 订阅状态或动作的常量 */
export const Subscribe = 'Subscribe'
/**
 * 帧率
 */
export const FPS = 30
/** 特定速度时间值的常量 */
export const SpeedTime = Number((1000 / FPS).toFixed(0))

/** 堆叠差值的常量 */
export const Diff = 10
/**
 * visible事件
 */
export const Visibilitychange = 'visibilitychange'
/**
 * 销毁时前进移动速率
 */
export const DestroyMoveSpeed = 1

export const TipType: TipTypeEnum = TipTypeEnum.tip
