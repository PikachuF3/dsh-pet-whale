// WebAudio 合成音效：从 preview.html 原样移植，加静音记忆、五档音量与浏览器自动播放策略解锁。

export type SoundType = 'bubble' | 'work' | 'celebrate' | 'error' | 'snack' | 'trick'

const MUTE_KEY = 'pet-whale:muted'
const VOLUME_KEY = 'pet-whale:volume'
/** 音量档位：点击音效按钮循环切换 0 → 25 → 50 → 75 → 100 → 0 */
export const VOLUME_STEPS = [0, 25, 50, 75, 100]

export class WhaleSounds {
  private ctx: AudioContext | null = null
  private muted: boolean
  private volume: number

  constructor() {
    let muted = false
    try {
      muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      // localStorage 不可用（隐私模式等），静音状态仅本次会话生效
    }
    this.muted = muted
    let volume = 100
    try {
      const raw = Number(localStorage.getItem(VOLUME_KEY))
      if (Number.isFinite(raw) && raw >= 0 && raw <= 100) volume = Math.round(raw)
    } catch {
      // 忽略读取失败，默认满音量
    }
    this.volume = volume
  }

  get isMuted(): boolean {
    return this.muted || this.volume === 0
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      // 忽略存储失败
    }
  }

  /** 当前音量（0-100）。 */
  getVolume(): number {
    return this.volume
  }

  /** 设置音量（0-100），0 视为静音。 */
  setVolume(volume: number): void {
    const v = Math.max(0, Math.min(100, Math.round(volume)))
    this.volume = v
    this.muted = v === 0
    try {
      localStorage.setItem(VOLUME_KEY, String(v))
      localStorage.setItem(MUTE_KEY, v === 0 ? '1' : '0')
    } catch {
      // 忽略存储失败
    }
  }

  /** 点击音效按钮时循环切换五档：0 → 25 → 50 → 75 → 100 → 0，返回新档位。 */
  cycleVolume(): number {
    const idx = VOLUME_STEPS.indexOf(this.volume)
    const next = VOLUME_STEPS[(idx === -1 ? VOLUME_STEPS.indexOf(0) : idx) + 1] ?? VOLUME_STEPS[0]
    this.setVolume(next)
    return next
  }

  /** 音量系数 0..1，用于缩放每个音效的增益。 */
  private volumeFactor(): number {
    return this.isMuted ? 0 : this.volume / 100
  }

  /** 浏览器自动播放策略：AudioContext 需在用户手势后 resume，挂一次全局 pointerdown 解锁。 */
  installGestureUnlock(): void {
    const unlock = () => {
      const ctx = this.acquire()
      if (ctx !== null && ctx.state === 'suspended') void ctx.resume()
    }
    document.addEventListener('pointerdown', unlock, { capture: true, passive: true })
  }

  private acquire(): AudioContext | null {
    if (this.ctx === null) {
      const Ctor: typeof AudioContext | undefined =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctor === undefined) return null
      this.ctx = new Ctor()
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  play(type: SoundType): void {
    const vol = this.volumeFactor()
    if (this.isMuted || vol <= 0) return
    try {
      const ctx = this.acquire()
      if (ctx === null) return
      const now = ctx.currentTime
      if (type === 'bubble') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(420, now)
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.12)
        gain.gain.setValueAtTime(0.3 * vol, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.15)
      } else if (type === 'work') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(720, now)
        gain.gain.setValueAtTime(0.18 * vol, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.07)
      } else if (type === 'celebrate') {
        ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.08)
          gain.gain.setValueAtTime(0.2 * vol, now + i * 0.08)
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.22)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(now + i * 0.08)
          osc.stop(now + i * 0.08 + 0.23)
        })
      } else if (type === 'error') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(320, now)
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.25)
        gain.gain.setValueAtTime(0.15 * vol, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.27)
      } else if (type === 'snack') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.1)
        gain.gain.setValueAtTime(0.25 * vol, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.13)
      } else if (type === 'trick') {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(350, now)
        osc.frequency.exponentialRampToValueAtTime(1050, now + 0.35)
        gain.gain.setValueAtTime(0.28 * vol, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.42)
      }
    } catch {
      // 音效失败不影响任何功能
    }
  }
}
