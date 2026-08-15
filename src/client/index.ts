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
/** 隐藏状态：'1' 表示隐藏到右下角小按钮 */
const HIDDEN_KEY = 'pet-whale:hidden'
const PRETEND_KEY = 'pet-whale:pretend'
const THINK_TICKER_KEY = 'pet-whale:think-ticker'
const MINI_POS_KEY = 'pet-whale:mini-pos'
const AUTO_HIDE_KEY = 'pet-whale:auto-hide'
const AUTO_HIDE_CHECK_MS = 30000
/** 智能避让：只有 idle 且光标在身侧停留这么久才让开 */
const AVOID_DWELL_MS = 900
const AVOID_MARGIN = 48
const AVOID_STEP = 120
/** 抓取/右键后 8 秒内不再避让，保证“想抓就能抓住” */
const AVOID_COOLDOWN_MS = 8000
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

  // ===== 主题联动：跟随 DSH 亮/暗主题 =====
  const readTheme = (): 'light' | 'dark' => {
    const scheme = document.documentElement.style.colorScheme
    if (scheme === 'dark' || scheme === 'light') return scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  const applyTheme = () => {
    root.dataset.theme = readTheme()
  }
  const themeObserver = new MutationObserver(applyTheme)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
  applyTheme()

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
    // 隐藏时不说话，避免“看不见的鲸鱼还在自言自语”
    if (root.classList.contains('hidden')) return
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
    // 隐藏时静音；页面不可见时也静音
    if (root.classList.contains('hidden') || document.hidden) return
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
  // 假装工作模式：开启后无论真实状态如何，都表演 working（敲代码）
  let pretendOn = false
  try {
    pretendOn = localStorage.getItem(PRETEND_KEY) === '1'
  } catch {
    // 忽略存储失败
  }
  // 思考链滚动条：默认开启，可右键关闭
  let tickerOn = true
  try {
    tickerOn = localStorage.getItem(THINK_TICKER_KEY) !== '0'
  } catch {
    // 忽略存储失败
  }
  // 最近一次错误文本：error 状态下点击鲸鱼可复制
  let lastErrorText = ''
  const setState = (next: WhaleState, changed: boolean) => {
    const effective: WhaleState = pretendOn ? 'working' : next
    if (effective !== 'idle') wake()
    for (const s of STATES) pet.classList.toggle(s, s === effective)
    visualState = effective
    syncMiniState(effective)
    if (effective === 'idle') scheduleIdleMicro()
    else clearIdleMicro()
    if (changed) {
      showDialog(pick(statusDialogs[effective]))
      autoSound(effective)
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

  // ===== 隐藏 / 小按钮 / 状态指示 / 拖拽 / 定时 / 关闭 =====
  const HIDDEN_CLASS = 'hidden'
  const MINI_SIZE = 46
  let mini: HTMLButtonElement | null = null
  let quitWhale: () => void = () => {}

  const syncMiniState = (state: WhaleState) => {
    if (mini === null) return
    mini.dataset.state = state
    mini.title = `桌宠小鲸鱼（${state}）· 点我召回，可拖拽移动`
  }

  // ===== 小按钮位置（右下角偏移，localStorage 记忆） =====
  const miniClamp = (right: number, bottom: number) => {
    const maxRight = Math.max(0, window.innerWidth - MINI_SIZE)
    const maxBottom = Math.max(0, window.innerHeight - MINI_SIZE)
    return {
      right: Math.min(Math.max(0, right), maxRight),
      bottom: Math.min(Math.max(0, bottom), maxBottom),
    }
  }
  const loadMiniPos = () => {
    try {
      const raw = localStorage.getItem(MINI_POS_KEY)
      if (raw !== null) {
        const parsed = JSON.parse(raw) as { right: number; bottom: number }
        if (typeof parsed.right === 'number' && typeof parsed.bottom === 'number') return miniClamp(parsed.right, parsed.bottom)
      }
    } catch {
      // 解析失败回默认
    }
    return { right: 14, bottom: 14 }
  }
  const saveMiniPos = () => {
    if (mini === null) return
    try {
      localStorage.setItem(MINI_POS_KEY, JSON.stringify({
        right: parseFloat(mini.style.right) || 0,
        bottom: parseFloat(mini.style.bottom) || 0,
      }))
    } catch {
      // 忽略存储失败
    }
  }

  // ===== 小按钮拖拽 =====
  let miniDrag: { x: number; y: number; right: number; bottom: number } | null = null
  let miniDragging = false
  let miniSuppressClick = false
  const onMiniPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || mini === null) return
    miniDrag = {
      x: e.clientX,
      y: e.clientY,
      right: parseFloat(mini.style.right) || 0,
      bottom: parseFloat(mini.style.bottom) || 0,
    }
    mini.setPointerCapture(e.pointerId)
  }
  const onMiniPointerMove = (e: PointerEvent) => {
    if (miniDrag === null || mini === null) return
    const dx = e.clientX - miniDrag.x
    const dy = e.clientY - miniDrag.y
    if (!miniDragging && Math.abs(dx) + Math.abs(dy) > 4) {
      miniDragging = true
      miniSuppressClick = true
      mini.classList.add('dragging')
    }
    if (miniDragging) {
      const p = miniClamp(miniDrag.right - dx, miniDrag.bottom - dy)
      mini.style.right = `${p.right}px`
      mini.style.bottom = `${p.bottom}px`
    }
  }
  const onMiniDragEnd = () => {
    if (miniDrag === null) return
    miniDrag = null
    if (miniDragging) {
      miniDragging = false
      mini.classList.remove('dragging')
      saveMiniPos()
    }
    window.setTimeout(() => { miniSuppressClick = false }, 0)
  }

  const removeMini = () => {
    mini?.remove()
    mini = null
  }
  const createMini = () => {
    if (mini !== null) return
    mini = document.createElement('button')
    mini.type = 'button'
    mini.setAttribute('data-dsh-whale-mini', '')
    mini.setAttribute('aria-label', '显示桌宠小鲸鱼')
    mini.textContent = '🐳'
    const pos = loadMiniPos()
    mini.style.right = `${pos.right}px`
    mini.style.bottom = `${pos.bottom}px`
    syncMiniState(visualState)
    mini.addEventListener('click', () => {
      if (miniSuppressClick) return
      showWhale()
    })
    mini.addEventListener('pointerdown', onMiniPointerDown)
    mini.addEventListener('pointermove', onMiniPointerMove)
    mini.addEventListener('pointerup', onMiniDragEnd)
    mini.addEventListener('pointercancel', onMiniDragEnd)
    document.body.appendChild(mini)
  }

  const showWhale = () => {
    removeMini()
    root.classList.remove(HIDDEN_CLASS)
    try {
      localStorage.removeItem(HIDDEN_KEY)
    } catch {
      // 忽略存储失败
    }
    place()
    triggerSquish()
    showDialog('回来啦！想我了没~ 🐳')
  }
  const hideWhale = () => {
    root.classList.add(HIDDEN_CLASS)
    try {
      localStorage.setItem(HIDDEN_KEY, '1')
    } catch {
      // 忽略存储失败
    }
    createMini()
  }

  // ===== 定时隐藏 =====
  type AutoHidePlan = { at: number; daily: boolean; hh: number; mm: number }
  const readAutoHide = (): AutoHidePlan | null => {
    try {
      const raw = localStorage.getItem(AUTO_HIDE_KEY)
      if (raw === null) return null
      const parsed = JSON.parse(raw) as Partial<AutoHidePlan>
      if (typeof parsed.at === 'number' && typeof parsed.daily === 'boolean') return parsed as AutoHidePlan
    } catch {
      // 解析失败视为无计划
    }
    return null
  }
  const saveAutoHide = (plan: AutoHidePlan) => {
    try {
      localStorage.setItem(AUTO_HIDE_KEY, JSON.stringify(plan))
    } catch {
      // 忽略存储失败
    }
  }
  const clearAutoHide = () => {
    try {
      localStorage.removeItem(AUTO_HIDE_KEY)
    } catch {
      // 忽略存储失败
    }
  }
  const nextDailyAt = (hh: number, mm: number) => {
    const d = new Date()
    d.setHours(hh, mm, 0, 0)
    if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1)
    return d.getTime()
  }
  const scheduleOnce = (ms: number) => {
    saveAutoHide({ at: Date.now() + ms, daily: false, hh: 0, mm: 0 })
  }
  const scheduleDaily = (hh: number, mm: number) => {
    saveAutoHide({ at: nextDailyAt(hh, mm), daily: true, hh, mm })
  }
  const checkAutoHide = () => {
    const plan = readAutoHide()
    if (plan === null) return
    if (Date.now() < plan.at) return
    if (plan.daily) scheduleDaily(plan.hh, plan.mm)
    else clearAutoHide()
    if (!root.classList.contains(HIDDEN_CLASS)) hideWhale()
  }
  let autoHideTimer: number | undefined
  const startAutoHide = () => {
    checkAutoHide()
    autoHideTimer = window.setInterval(checkAutoHide, AUTO_HIDE_CHECK_MS)
  }

  // ===== 思考内容滚动条 =====
  // 真实状态为 think 时，把模型最近生成的文字截取一段放在桌宠正上方缓慢滚动；
  // 内容只保留最近 200 字（可读、不冗长），鲸鱼同时保持深潜思考动画。
  const THINK_TICKER_MAX = 200
  const THINK_TICKER_WIDTH = 360
  const ticker = document.createElement('div')
  ticker.setAttribute('data-dsh-whale-think', '')
  ticker.innerHTML = '<span class="dsh-whale-think-label">🧠</span><div class="dsh-whale-think-scroll"><span class="dsh-whale-think-text"></span></div>'
  root.appendChild(ticker)
  const tickerText = ticker.querySelector<HTMLElement>('.dsh-whale-think-text')!
  let tickerOffset = 0
  let tickerRaf = 0
  const hideTicker = () => {
    ticker.classList.remove('show')
    if (tickerRaf !== 0) {
      window.cancelAnimationFrame(tickerRaf)
      tickerRaf = 0
    }
  }
  const tickerTick = () => {
    const max = Math.max(0, tickerText.scrollWidth - ticker.clientWidth)
    tickerOffset += 0.5
    if (tickerOffset > max + 40) tickerOffset = 0
    tickerText.style.transform = `translateX(-${tickerOffset}px)`
    if (ticker.classList.contains('show')) tickerRaf = window.requestAnimationFrame(tickerTick)
    else tickerRaf = 0
  }
  const positionTicker = () => {
    // 水平对齐鲸鱼中心，并夹在视口内；垂直方向悬在鲸鱼头顶上方
    const rect = root.getBoundingClientRect()
    const width = Math.min(THINK_TICKER_WIDTH, window.innerWidth - 24)
    const centerX = rect.left + rect.width / 2
    const left = Math.min(Math.max(centerX, width / 2 + 12), window.innerWidth - width / 2 - 12)
    ticker.style.width = `${width}px`
    ticker.style.left = `${left}px`
    ticker.style.top = `${rect.top - 40}px`
  }
  const updateTicker = (text: string) => {
    if (text.trim() === '') {
      hideTicker()
      return
    }
    tickerText.textContent = text.slice(-THINK_TICKER_MAX)
    tickerOffset = 0
    positionTicker()
    ticker.classList.add('show')
    if (tickerRaf === 0) tickerRaf = window.requestAnimationFrame(tickerTick)
  }
  const partialTextOf = (partial: unknown): string => {
    if (partial === null || typeof partial !== 'object') return ''
    const blocks = (partial as { blocks?: readonly unknown[] }).blocks
    if (!Array.isArray(blocks)) return ''
    const parts: string[] = []
    for (const block of blocks) {
      if (block === null || typeof block !== 'object') continue
      const b = block as { kind?: string; text?: unknown }
      if ((b.kind === 'text' || b.kind === 'reasoning') && typeof b.text === 'string') parts.push(b.text)
    }
    return parts.join(' ')
  }

  // ===== 后台省电：页面不可见时暂停动画/音效/思考流 =====
  let pageVisible = true
  const onVisibility = () => {
    pageVisible = !document.hidden
    root.classList.toggle('paused', document.hidden)
    mini?.classList.toggle('paused', document.hidden)
    if (document.hidden) hideTicker()
  }
  document.addEventListener('visibilitychange', onVisibility)
  onVisibility()

  // ===== 右键菜单 =====
  const buildMenu = (mode: 'main' | 'palette' | 'schedule' = 'main') => {
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
    if (mode === 'schedule') {
      const scheduleItems: [string, () => void][] = [
        [
          '🕐 1 小时后隐藏',
          () => {
            scheduleOnce(3600000)
            showDialog('好~ 1 小时后我会自己藏到右下角 🐳')
          },
        ],
        [
          '🌙 每晚 22:00 隐藏',
          () => {
            scheduleDaily(22, 0)
            showDialog('记下啦：每天 22:00 自动藏到右下角 🌙')
          },
        ],
        [
          '🚫 取消定时隐藏',
          () => {
            clearAutoHide()
            showDialog('定时隐藏已取消~')
          },
        ],
      ]
      for (const [label, action] of scheduleItems) {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.textContent = label
        btn.addEventListener('click', () => {
          closeMenu()
          action()
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
        pretendOn ? '💼 假装工作: 开' : '💼 假装工作: 关',
        () => {
          pretendOn = !pretendOn
          try {
            localStorage.setItem(PRETEND_KEY, pretendOn ? '1' : '0')
          } catch {
            // 忽略存储失败
          }
          updateTicker('')
          setState(pretendOn ? 'working' : 'idle', true)
          showDialog(pretendOn ? '进入假装工作模式，开始表演敲代码 ⌨️💼' : '下班！恢复真实状态~')
        },
      ],
      [
        tickerOn ? '🧠 思考链: 开' : '🧠 思考链: 关',
        () => {
          tickerOn = !tickerOn
          try {
            localStorage.setItem(THINK_TICKER_KEY, tickerOn ? '1' : '0')
          } catch {
            // 忽略存储失败
          }
          updateTicker('')
          showDialog(tickerOn ? '思考链已开启：思考时会在我头顶滚动 🧠' : '思考链已关闭~')
        },
      ],
      [
        '🙈 隐藏到右下角',
        () => {
          hideWhale()
        },
      ],
      [
        '🕐 定时隐藏 ▸',
        () => {
          buildMenu('schedule')
          menu.classList.add('open')
          positionMenu(lastMenuPos.x, lastMenuPos.y)
        },
      ],
      [
        '⏹ 关闭桌宠',
        () => {
          quitWhale()
        },
      ],
      ...(lastErrorText !== ''
        ? [['📋 复制错误信息', () => {
            try {
              void navigator.clipboard?.writeText(lastErrorText)
            } catch {
              // 忽略剪贴板失败
            }
            showDialog('错误信息已复制到剪贴板 📋')
          }] as [string, () => void]]
        : []),
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
    const x = Math.min(Math.max(0, clientX - rect.left), Math.max(0, rect.width - menuW))
    // 下方空间不足时往上开，避免菜单项变多后超出视口底部
    const preferUp = clientY + menuH + 8 > window.innerHeight
    const y = preferUp ? clientY - rect.top - menuH - 10 : clientY - rect.top + 12
    const minY = -rect.top + 8
    const maxY = Math.max(minY, window.innerHeight - rect.top - menuH - 8)
    menu.style.left = `${x}px`
    menu.style.top = `${Math.min(Math.max(minY, y), maxY)}px`
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

  // ===== 智能避让（不干扰抓取/拖拽/右键） =====
  // 只有 idle、光标在鲸鱼身外 48px 内停留 0.9s 才让开；
  // 光标进入身体、按下抓取或右键都会立即取消，并进入 8s 冷却。
  let avoidCooldownUntil = 0
  let avoidTimer: number | undefined
  const cancelAvoid = () => {
    window.clearTimeout(avoidTimer)
    avoidTimer = undefined
    root.style.transition = ''
  }
  const maybeAvoid = (e: MouseEvent) => {
    if (root.classList.contains('hidden') || dragging || menu.classList.contains('open') || visualState !== 'idle') return
    if (performance.now() < avoidCooldownUntil) return
    const rect = pet.getBoundingClientRect()
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
    if (inside) {
      cancelAvoid()
      return
    }
    const near = e.clientX >= rect.left - AVOID_MARGIN && e.clientX <= rect.right + AVOID_MARGIN
      && e.clientY >= rect.top - AVOID_MARGIN && e.clientY <= rect.bottom + AVOID_MARGIN
    if (!near) {
      cancelAvoid()
      return
    }
    if (avoidTimer !== undefined) return
    avoidTimer = window.setTimeout(() => {
      avoidTimer = undefined
      if (root.classList.contains('hidden') || dragging || menu.classList.contains('open') || visualState !== 'idle') return
      if (performance.now() < avoidCooldownUntil) return
      const r = pet.getBoundingClientRect()
      const insideNow = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
      if (insideNow) return
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const len = Math.hypot(dx, dy) || 1
      const next = clampPos(cx - (dx / len) * AVOID_STEP - PET_W / 2, cy - (dy / len) * AVOID_STEP - PET_H / 2)
      root.style.transition = 'left .35s ease, top .35s ease'
      root.style.left = `${next.x}px`
      root.style.top = `${next.y}px`
      window.setTimeout(() => {
        root.style.transition = ''
        savePos()
      }, 380)
      showDialog('让一让~ 这里交给你啦 ✨')
    }, AVOID_DWELL_MS)
  }

  // ===== idle 随机小动作 =====
  let idleMicroTimer: number | undefined
  const clearIdleMicro = () => {
    window.clearTimeout(idleMicroTimer)
    idleMicroTimer = undefined
  }
  const microLook = () => {
    if (pupil === null) return
    const dx = Math.random() * 0.4 - 0.2
    const dy = Math.random() * 0.3 - 0.15
    pupil.style.transition = 'transform .45s ease'
    pupil.style.transform = `translate(${dx}px, ${dy}px)`
    window.setTimeout(() => {
      pupil.style.transition = ''
      pupil.style.transform = ''
    }, 1500)
  }
  const microBubbles = () => {
    popBubble()
    window.setTimeout(popBubble, 260)
  }
  const microSwim = () => {
    const ox = parseFloat(root.style.left) || 0
    const oy = parseFloat(root.style.top) || 0
    const target = clampPos(ox + (Math.random() * 200 - 100), oy + (Math.random() * 140 - 70))
    root.style.transition = 'left 1.4s ease-in-out, top 1.4s ease-in-out'
    root.style.left = `${target.x}px`
    root.style.top = `${target.y}px`
    window.setTimeout(() => {
      root.style.transition = ''
      savePos()
    }, 1450)
    if (Math.random() < 0.35) showDialog(pick(['游一游，活动一下~ 🐳', '换个角度看主人 ✨', '咕噜噜... 巡视领地中']))
  }
  const scheduleIdleMicro = () => {
    clearIdleMicro()
    idleMicroTimer = window.setTimeout(() => {
      if (visualState !== 'idle' || root.classList.contains('hidden') || dragging || document.hidden || menu.classList.contains('open')) {
        scheduleIdleMicro()
        return
      }
      const roll = Math.random()
      if (roll < 0.35) microSwim()
      else if (roll < 0.7) microLook()
      else microBubbles()
      scheduleIdleMicro()
    }, 9000 + Math.random() * 8000)
  }

  let dragStart: { x: number; y: number; ox: number; oy: number } | null = null
  const onPetPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return
    // 抓住/开始拖拽：立即停下避让动作，并冷却一段时间，想抓就能抓住
    cancelAvoid()
    avoidCooldownUntil = performance.now() + AVOID_COOLDOWN_MS
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
    // 隐藏时不再追光，也不因鼠标移动唤醒台词
    if (root.classList.contains('hidden')) return
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
  maybeAvoid(e)
}

  // ===== 事件绑定 =====
  pet.addEventListener('click', () => {
    if (suppressClick) return
    // 错误状态下点击：复制错误信息
    if (visualState === 'error' && lastErrorText !== '') {
      try {
        void navigator.clipboard?.writeText(lastErrorText)
      } catch {
        // 忽略剪贴板失败
      }
      showDialog('错误信息已复制到剪贴板，快去找主人帮忙 📋')
    }
    triggerSquish()
  })
  pet.addEventListener('dblclick', triggerRoll)
  pet.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    // 右键也不许避让抢跑
    cancelAvoid()
    avoidCooldownUntil = performance.now() + AVOID_COOLDOWN_MS
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
      lastErrorText = ''
      setState('idle', visualState !== 'idle')
      updateTicker('')
      return
    }
    const snapObj = snap as WhaleSnapshot
    lastErrorText = snapObj.lastAgentError ?? (snapObj.openError !== null ? 'open-error' : '')
    const step = driver.step(snapObj, performance.now())
    setState(step.state, step.changed)
    // 只有开关打开且真实状态是 think 时展示思考流；假装工作模式不展示
    updateTicker(tickerOn && step.state === 'think' ? partialTextOf((snap as { partial?: unknown }).partial) : '')
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

  // ===== 恢复隐藏状态（跨刷新记忆） =====
  try {
    if (localStorage.getItem(HIDDEN_KEY) === '1') {
      root.classList.add('hidden')
      createMini()
    }
  } catch {
    // 忽略存储失败
  }

  // ===== 启动定时隐藏检查 =====
  startAutoHide()

  // ===== 清理 =====
  const dispose = () => {
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
    document.removeEventListener('visibilitychange', onVisibility)
    themeObserver.disconnect()
    clearIdleMicro()
    cancelAvoid()
    if (autoHideTimer !== undefined) window.clearInterval(autoHideTimer)
    hideTicker()
    ticker.remove()
    removeMini()
    root.remove()
    style.remove()
  }
  quitWhale = dispose
  return dispose
}
