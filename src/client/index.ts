// pet-whale client bundle：纯 DOM 桌宠。
// apply(ctx) 由官方 client 通道调用；状态来自 ctx.sessions（会话快照可观察对象）。
import type { Context } from '@deepseek-ai/cordis'
import type { ISessions, SessionFace } from '@deepseek-ai/dsh-client-runtime/client'
import { WHALE_HTML } from './whale'
import { WHALE_CSS } from './styles'
import { WhaleSounds } from './sounds'
import { WhaleDriver, type WhaleSnapshot, type WhaleState } from './state'
import { PALETTES, applyPalette, loadPaletteId, paletteOf, savePaletteId } from './palettes'

// 官方 client 通道的服务闸：等 sessions 服务就绪后再 apply
export const inject = ['sessions']

const STATES: readonly WhaleState[] = ['idle', 'think', 'working', 'celebrate', 'error']
const POS_KEY = 'pet-whale:pos'
const SLEEP_MS = 20000
const DIALOG_MS = 2600
/** 自动音效最小间隔（防 think/working 抖动连响） */
const SOUND_GAP_MS = 1200

const statusDialogs: Record<WhaleState, string[]> = {
  idle: [
    '小鲸鱼待命中~ 点击我可以戳戳哦 🐳',
    '今天有什么新的代码任务呢？✨',
    '摇摇尾巴，随时准备出发！',
  ],
  think: ['正在深潜检索知识库... 🌊', '认真思考架构逻辑中...', '咕噜噜... 正在探索深海答案'],
  working: ['认真敲代码中！⚡', '噼里啪啦码字中，很快就好~ ⌨️', '正在调用 Agent 工具执行任务！'],
  celebrate: ['太棒啦！任务圆满搞定~ 🎉', '代码测试全绿，完美交付！✨', '冒泡庆祝中，请主人查收~'],
  error: ['哎呀出错了，正在发抖求救 🥺', '捕获到一个异常，正在尝试自愈...', '呜呜呜，遇到阻碍了 >_<'],
}

const pokeDialogs = [
  '咕噜咕噜~ 戳到软软的肚皮啦！',
  '好痒呀~ 哈哈哈 (≧▽≦)',
  '鲸鱼活力 +10！继续加油~',
  '小尾巴拍拍水，心情超棒 ✨',
]

const pick = (list: string[]): string => list[Math.floor(Math.random() * list.length)]

export function apply(ctx: Context): () => void {
  if (typeof document === 'undefined') return () => {}

  // 双挂载防护：先清掉旧实例
  document.querySelectorAll('[data-dsh-whale]').forEach((el) => el.remove())
  document.getElementById('pet-whale-style')?.remove()

  // ===== 样式 =====
  const style = document.createElement('style')
  style.id = 'pet-whale-style'
  style.textContent = WHALE_CSS
  document.head.appendChild(style)

  // ===== DOM =====
  const root = document.createElement('div')
  root.setAttribute('data-dsh-whale', '')
  root.innerHTML = `
    <span class="dsh-whale-shadow"></span>
    <div class="dsh-whale-dialog"></div>
    <span class="dsh-whale-snack">🐟</span>
    <span class="dsh-whale-zzz">Zzz...</span>
    <div class="pet-official idle" role="img" aria-label="桌宠小鲸鱼">${WHALE_HTML}</div>
    <div class="dsh-whale-menu" role="menu"></div>
  `
  const dialog = root.querySelector<HTMLElement>('.dsh-whale-dialog')!
  const snack = root.querySelector<HTMLElement>('.dsh-whale-snack')!
  const pet = root.querySelector<HTMLElement>('.pet-official')!
  const menu = root.querySelector<HTMLElement>('.dsh-whale-menu')!
  const pupil = pet.querySelector<SVGCircleElement>('.pupil-highlight')

  // ===== 位置（localStorage 记忆 + 视口钳制） =====
  const PET_W = 137
  const PET_H = 101
  const clampPos = (x: number, y: number) => {
    const maxX = Math.max(0, window.innerWidth - PET_W)
    const maxY = Math.max(0, window.innerHeight - PET_H)
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) }
  }
  const loadPos = () => {
    try {
      const raw = localStorage.getItem(POS_KEY)
      if (raw !== null) {
        const parsed = JSON.parse(raw) as { x: number; y: number }
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') return clampPos(parsed.x, parsed.y)
      }
    } catch {
      // 解析失败回默认
    }
    return clampPos(window.innerWidth - PET_W - 16, window.innerHeight - PET_H - 96)
  }
  const place = () => {
    const { x, y } = clampPos(parseFloat(root.style.left) || 0, parseFloat(root.style.top) || 0)
    root.style.left = `${x}px`
    root.style.top = `${y}px`
    return { x, y }
  }
  const pos = loadPos()
  root.style.left = `${pos.x}px`
  root.style.top = `${pos.y}px`
  document.body.appendChild(root)
  // 初始皮肤（默认陶土；用户换过后从 localStorage 恢复）
  applyPalette(root, paletteOf(loadPaletteId()))
  const savePos = () => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(place()))
    } catch {
      // 忽略存储失败
    }
  }
  const onResize = () => place()

  // ===== 台词 =====
  let dialogTimer: number | undefined
  const showDialog = (text: string) => {
    dialog.textContent = text
    dialog.classList.add('show')
    window.clearTimeout(dialogTimer)
    dialogTimer = window.setTimeout(() => dialog.classList.remove('show'), DIALOG_MS)
  }

  // ===== 音效 =====
  const sounds = new WhaleSounds()
  sounds.installGestureUnlock()
  let lastAutoSound = 0
  const autoSound = (state: WhaleState) => {
    const now = performance.now()
    if (now - lastAutoSound < SOUND_GAP_MS) return
    lastAutoSound = now
    if (state === 'think') sounds.play('bubble')
    else if (state === 'working') sounds.play('work')
    else if (state === 'celebrate') sounds.play('celebrate')
    else if (state === 'error') sounds.play('error')
  }

  // ===== 状态应用 =====
  let visualState: WhaleState = 'idle'
  const setState = (next: WhaleState, changed: boolean) => {
    if (next !== 'idle') wake()
    for (const s of STATES) pet.classList.toggle(s, s === next)
    visualState = next
    if (changed) {
      showDialog(pick(statusDialogs[next]))
      autoSound(next)
    }
  }

  // ===== 泡泡 =====
  const popBubble = () => {
    const bubbles = pet.querySelectorAll<HTMLElement>('.bubble')
    if (bubbles.length === 0) return
    const b = bubbles[Math.floor(Math.random() * bubbles.length)]
    b.classList.remove('show')
    void b.offsetWidth
    b.classList.add('show')
    window.setTimeout(() => b.classList.remove('show'), 950)
  }

  // ===== 戳戳 / 翻滚 =====
  const triggerSquish = () => {
    markActive()
    popBubble()
    sounds.play('bubble')
    pet.classList.remove('squish')
    void pet.offsetWidth
    pet.classList.add('squish')
    window.setTimeout(() => pet.classList.remove('squish'), 450)
    showDialog(pick(pokeDialogs))
  }
  const triggerRoll = () => {
    markActive()
    sounds.play('trick')
    showDialog('翻个 360° 跟头给你看！(≧∇≦)ﾉ ✨')
    pet.classList.remove('rolling')
    void pet.offsetWidth
    pet.classList.add('rolling')
    popBubble()
    window.setTimeout(() => popBubble(), 200)
    window.setTimeout(() => pet.classList.remove('rolling'), 700)
  }

  // ===== 右键菜单 =====
  const buildMenu = (mode: 'main' | 'palette' = 'main') => {
    menu.textContent = ''
    if (mode === 'palette') {
      for (const p of PALETTES) {
        const btn = document.createElement('button')
        btn.type = 'button'
        const dot = document.createElement('span')
        dot.className = 'pw-swatch'
        dot.style.background = `linear-gradient(135deg, ${p.light}, ${p.main}, ${p.dark})`
        btn.appendChild(dot)
        btn.appendChild(document.createTextNode(p.name))
        btn.addEventListener('click', () => {
          closeMenu()
          applyPalette(root, p)
          savePaletteId(p.id)
          showDialog(`换上新皮肤「${p.name}」~ 🎨`)
          sounds.play('bubble')
        })
        menu.appendChild(btn)
      }
      const back = document.createElement('button')
      back.type = 'button'
      back.textContent = '← 返回'
      back.addEventListener('click', () => {
        buildMenu('main')
        positionMenu(lastMenuPos.x, lastMenuPos.y)
      })
      menu.appendChild(back)
      return
    }
    const items: [string, () => void][] = [
      [
        '🐟 投喂小鱼干',
        () => {
          snack.classList.remove('drop')
          void snack.offsetWidth
          snack.classList.add('drop')
          sounds.play('snack')
          showDialog('嚼嚼嚼... 获得小鱼干能量！美味~ 🐟')
          window.setTimeout(() => {
            triggerSquish()
            sounds.play('celebrate')
          }, 600)
        },
      ],
      [
        '✨ 摸摸头',
        () => {
          triggerSquish()
          showDialog('被摸摸头啦~ 暖洋洋的超开心 🥰')
        },
      ],
      [
        '🎨 换颜色 ▸',
        () => {
          buildMenu('palette')
          menu.classList.add('open')
          positionMenu(lastMenuPos.x, lastMenuPos.y)
        },
      ],
      [
        sounds.isMuted ? '🔇 音效: 关' : '🔊 音效: 开',
        () => {
          const next = !sounds.isMuted
          sounds.setMuted(next)
          buildMenu()
          if (next) sounds.play('bubble')
        },
      ],
    ]
    for (const [label, action] of items) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.addEventListener('click', () => {
        closeMenu()
        action()
      })
      menu.appendChild(btn)
    }
  }
  let lastMenuPos = { x: 0, y: 0 }
  const positionMenu = (clientX: number, clientY: number) => {
    const rect = root.getBoundingClientRect()
    const menuW = menu.offsetWidth || 140
    const menuH = menu.offsetHeight || 130
    let x = clientX - rect.left
    let y = clientY - rect.top
    x = Math.min(Math.max(0, x), Math.max(0, rect.width - menuW))
    const maxY = Math.min(rect.height - menuH, window.innerHeight - rect.top - menuH - 8)
    y = Math.min(Math.max(0, y), Math.max(0, maxY))
    menu.style.left = `${x}px`
    menu.style.top = `${y}px`
  }
  const openMenu = (clientX: number, clientY: number) => {
    lastMenuPos = { x: clientX, y: clientY }
    buildMenu()
    menu.classList.add('open')
    positionMenu(clientX, clientY)
  }
  const closeMenu = () => menu.classList.remove('open')
  const onDocPointerDown = (e: PointerEvent) => {
    if (!menu.contains(e.target as Node)) closeMenu()
  }

  // ===== 拖拽 =====
  let dragging = false
  let suppressClick = false
  let dragStart: { x: number; y: number; ox: number; oy: number } | null = null
  const onPetPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    markActive()
    dragStart = {
      x: e.clientX,
      y: e.clientY,
      ox: parseFloat(root.style.left) || 0,
      oy: parseFloat(root.style.top) || 0,
    }
    pet.setPointerCapture(e.pointerId)
  }
  const onPetPointerMove = (e: PointerEvent) => {
    if (dragStart === null) return
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    if (!dragging && Math.abs(dx) + Math.abs(dy) > 4) {
      dragging = true
      suppressClick = true
      root.classList.add('dragging')
    }
    if (dragging) {
      const p = clampPos(dragStart.ox + dx, dragStart.oy + dy)
      root.style.left = `${p.x}px`
      root.style.top = `${p.y}px`
    }
  }
  const endDrag = () => {
    if (dragStart === null) return
    dragStart = null
    if (dragging) {
      dragging = false
      root.classList.remove('dragging')
      savePos()
    }
    window.setTimeout(() => {
      suppressClick = false
    }, 0)
  }

  // ===== 打瞌睡 =====
  let sleepTimer: number | undefined
  let sleeping = false
  const markActive = () => {
    window.clearTimeout(sleepTimer)
    if (sleeping) {
      sleeping = false
      root.classList.remove('sleeping')
      showDialog('醒啦！随时准备开工~ ✨')
      sounds.play('bubble')
    }
    sleepTimer = window.setTimeout(() => {
      if (visualState !== 'idle' || dragging) {
        markActive()
        return
      }
      sleeping = true
      root.classList.add('sleeping')
      showDialog('呼噜噜... 正在做深海美梦 (Zzz) 💤')
    }, SLEEP_MS)
  }
  const wake = () => {
    if (sleeping) {
      sleeping = false
      root.classList.remove('sleeping')
    }
  }

  // ===== 追光（rAF 节流） =====
  let eyeRaf = 0
  const onMouseMove = (e: MouseEvent) => {
    markActive()
    if (pupil === null || eyeRaf !== 0) return
    eyeRaf = window.requestAnimationFrame(() => {
      eyeRaf = 0
      const rect = pet.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(-0.18, Math.min(0.18, (e.clientX - cx) / 500))
      const dy = Math.max(-0.15, Math.min(0.15, (e.clientY - cy) / 450))
      pupil.style.transform = `translate(${dx}px, ${dy}px)`
    })
  }

  // ===== 事件绑定 =====
  pet.addEventListener('click', () => {
    if (suppressClick) return
    triggerSquish()
  })
  pet.addEventListener('dblclick', triggerRoll)
  pet.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    openMenu(e.clientX, e.clientY)
  })
  pet.addEventListener('pointerdown', onPetPointerDown)
  pet.addEventListener('pointermove', onPetPointerMove)
  pet.addEventListener('pointerup', endDrag)
  pet.addEventListener('pointercancel', endDrag)
  document.addEventListener('pointerdown', onDocPointerDown)
  document.addEventListener('keydown', markActive)
  document.addEventListener('wheel', markActive, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('resize', onResize)

  // ===== 会话状态订阅 =====
  const driver = new WhaleDriver()
  const sessions: ISessions | undefined = ctx.sessions
  let unsubList: (() => void) | undefined
  let unsubSession: (() => void) | undefined
  let face: SessionFace | undefined

  const onSnapshot = () => {
    const snap = face?.getSnapshot()
    if (snap === undefined) {
      setState('idle', visualState !== 'idle')
      return
    }
    const step = driver.step(snap as WhaleSnapshot, performance.now())
    setState(step.state, step.changed)
  }
  const syncSession = () => {
    unsubSession?.()
    unsubSession = undefined
    face = undefined
    const list = sessions.list.getSnapshot()
    const id = list.current
    if (id === undefined) {
      onSnapshot()
      return
    }
    const binding = sessions.binding(id)
    if (binding === undefined) {
      onSnapshot()
      return
    }
    face = binding.session
    unsubSession = face.subscribe(onSnapshot)
    onSnapshot()
  }

  if (sessions !== undefined) {
    unsubList = sessions.list.subscribe(syncSession)
    syncSession()
  }

  markActive()

  // ===== 清理 =====
  return () => {
    window.clearTimeout(sleepTimer)
    window.clearTimeout(dialogTimer)
    if (eyeRaf !== 0) window.cancelAnimationFrame(eyeRaf)
    unsubList?.()
    unsubSession?.()
    document.removeEventListener('pointerdown', onDocPointerDown)
    document.removeEventListener('keydown', markActive)
    document.removeEventListener('wheel', markActive)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    root.remove()
    style.remove()
  }
}
