// WebAudio 合成音效：从 preview.html 原样移植，加静音记忆与浏览器自动播放策略解锁。

export type SoundType = 'bubble' | 'work' | 'celebrate' | 'error' | 'snack' | 'trick'

const MUTE_KEY = 'pet-whale:muted'

export class WhaleSounds {
  private ctx: AudioContext | null = null
  private muted: boolean

  constructor() {
    let muted = false
    try {
      muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      // localStorage 不可用（隐私模式等），静音状态仅本次会话生效
    }
    this.muted = muted
  }

  get isMuted(): boolean {
    return this.muted
  }

  setMuted(muted: boolean): void {
    this.muted = muted
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      // 忽略存储失败
    }
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
    if (this.muted) return
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
        gain.gain.setValueAtTime(0.3, now)
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
        gain.gain.setValueAtTime(0.18, now)
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
          gain.gain.setValueAtTime(0.2, now + i * 0.08)
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
        gain.gain.setValueAtTime(0.15, now)
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
        gain.gain.setValueAtTime(0.25, now)
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
        gain.gain.setValueAtTime(0.28, now)
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
