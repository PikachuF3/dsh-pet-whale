// 状态机：会话快照 → 鲸鱼状态。
// 持续状态（think/working/idle）直接由快照推导；瞬态（error/celebrate）由边沿事件触发，
// 到时间后回落到推导状态。优先级：error > celebrate > drag > think > working > idle。
//
// 回合语义（2026-08-14 定版调整）：
// - running 期间永不 idle：有工具 = working，无工具（文字流或模型内部推理）= think 深潜
// - working 粘滞 WORK_STICKY_MS：最后一次工具活动后再保持一小段"敲代码"，覆盖工具之间的推理空档

export type WhaleState = 'idle' | 'think' | 'working' | 'celebrate' | 'error'

/** 鲸鱼需要的会话快照最小面（真实快照是其超集）。 */
export interface WhaleSnapshot {
  running: boolean
  /** 有文本流 = 思考中 */
  partial: unknown | null
  /** 工具调用中 */
  runningCalls: readonly unknown[]
  lastAgentError: string | null
  openError: unknown | null
  /** 已完成回合数 → 结束事件 seq */
  turnEnds: ReadonlyMap<number, number>
}

export const ERROR_MS = 4000
export const CELEBRATE_MS = 2500
/** working 粘滞时长：工具调用结束后继续保持"敲代码"的时间 */
export const WORK_STICKY_MS = 2500

/** 快照 → 持续状态。 */
export function deriveContinuous(snap: WhaleSnapshot, stickyUntil: number | null, now: number): WhaleState {
  if (!snap.running) return 'idle'
  if (snap.runningCalls.length > 0) return 'working'
  if (stickyUntil !== null && now < stickyUntil) return 'working'
  // 回合进行中但无工具：文字流或模型内部推理，都表现为深潜思考
  return 'think'
}

export interface WhaleStep {
  state: WhaleState
  /** 状态是新变化（刚进入）还是沿用 */
  changed: boolean
}

/** 状态驱动：吃快照序列，吐状态序列。 */
export class WhaleDriver {
  private prevRunning: boolean | null = null
  private prevTurnEnds = 0
  private prevError: string | null = null
  private transient: { state: 'celebrate' | 'error'; until: number } | null = null
  private stickyUntil: number | null = null
  private current: WhaleState = 'idle'

  /** 首帧初始化基线（不触发任何瞬态）。 */
  prime(snap: WhaleSnapshot): void {
    this.prevRunning = snap.running
    this.prevTurnEnds = snap.turnEnds.size
    this.prevError = errorKey(snap)
    this.stickyUntil = null
    this.current = deriveContinuous(snap, this.stickyUntil, 0)
  }

  step(snap: WhaleSnapshot, now: number): WhaleStep {
    if (this.prevRunning === null) {
      this.prime(snap)
      return { state: this.current, changed: false }
    }

    const err = errorKey(snap)
    // error 边沿：新错误出现（含从上一次错误恢复后再次出错）
    if (err !== null && err !== this.prevError) {
      this.transient = { state: 'error', until: now + ERROR_MS }
    }
    this.prevError = err

    // celebrate 边沿：running 真→假 且回合数增长 且当前无错误
    if (this.prevRunning === true && snap.running === false) {
      const turns = snap.turnEnds.size
      if (turns > this.prevTurnEnds && err === null) {
        this.transient = { state: 'celebrate', until: now + CELEBRATE_MS }
      }
      this.prevTurnEnds = turns
    }
    this.prevRunning = snap.running

    // working 粘滞：见到工具活动就刷新窗口；回合结束清掉
    if (snap.running && snap.runningCalls.length > 0) this.stickyUntil = now + WORK_STICKY_MS
    if (!snap.running) this.stickyUntil = null

    let next: WhaleState
    if (this.transient !== null) {
      if (now < this.transient.until) {
        next = this.transient.state
      } else {
        this.transient = null
        next = deriveContinuous(snap, this.stickyUntil, now)
      }
    } else {
      next = deriveContinuous(snap, this.stickyUntil, now)
    }
    const changed = next !== this.current
    this.current = next
    return { state: next, changed }
  }

  get state(): WhaleState {
    return this.current
  }
}

function errorKey(snap: WhaleSnapshot): string | null {
  if (snap.lastAgentError !== null) return snap.lastAgentError
  if (snap.openError !== null) return 'open-error'
  return null
}
