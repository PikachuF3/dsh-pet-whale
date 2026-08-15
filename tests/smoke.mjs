// 冒烟测试：在 jsdom 里加载构建产物 lib/client.js，
// 模拟官方通道挂载 apply(ctx)，喂假会话快照验证状态机与交互 DOM。
// 用法：node tests/smoke.mjs
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const code = readFileSync(join(root, 'lib', 'client.js'), 'utf8')

let failures = 0
const check = (name, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`)
  if (!ok) failures++
}

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>', {
  url: 'http://127.0.0.1:3080/',
  pretendToBeVisual: true,
})
const { window } = dom
window.innerWidth = 1440
window.innerHeight = 900
// jsdom 不实现 matchMedia，而 readTheme 会用它探测系统深色偏好。
// 桩返回 matches:false，等价于"系统浅色"，让主题判定落到默认分支。
window.matchMedia = (query) => ({
  media: query,
  matches: false,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})
// 让默认语言固定为中文，测试文案断言才稳定。
Object.defineProperty(window.navigator, 'language', { value: 'zh-CN', configurable: true })
Object.defineProperty(window.navigator, 'languages', { value: ['zh-CN'], configurable: true })

// 官方通道契约：window.__ModuleLoader__.load 注册 factory
let handoff = null
window.__ModuleLoader__ = { load: (h) => { handoff = h } }
vm.createContext(window)
vm.runInContext(code, window)
check('bundle 注册 __ModuleLoader__', handoff !== null && handoff.id === 'pet-whale')

const exports_ = handoff.factory(() => {
  throw new Error('bundle 不应有运行时 require')
})
check('导出 apply', typeof exports_.apply === 'function')
check('导出 inject=[sessions]', Array.isArray(exports_.inject) && exports_.inject[0] === 'sessions')

// 可观察会话桩：current 会话 + 会话快照
let currentId = 's1'
const snap = {
  running: false,
  partial: null,
  runningCalls: [],
  lastAgentError: null,
  openError: null,
  turnEnds: new Map(),
  pending: [],
  queue: [],
  blank: false,
  removed: false,
  openState: 'open',
  composerPhase: 'active',
}
const makeObservable = (get) => {
  const subs = new Set()
  return {
    getSnapshot: get,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn) },
    notify: () => { for (const fn of [...subs]) fn() },
  }
}
const sessionObservable = makeObservable(() => snap)
const ctx = {
  sessions: {
    list: makeObservable(() => ({ current: currentId, phase: 'ready', sessions: [] })),
    currentProvideInfo: makeObservable(() => undefined),
    binding: (id) => (id === currentId ? { sessionId: id, session: sessionObservable } : undefined),
    open() {},
    clear() {},
    searchResultLimit: 20,
    scope() { return undefined },
    scopeOf() { return undefined },
    sessionOf() { return undefined },
    openSubagent() {},
    subagentAddress() { return undefined },
    setSubagentCatalogOpen() {},
    refreshSubagents() { return Promise.resolve() },
    noteAgentPreset() {},
    search() { return Promise.resolve({ ok: true, value: { items: [], hasMore: false } }) },
    fork() { return Promise.reject(new Error('not used')) },
    provide() { return () => {} },
  },
}

// apply：挂载
const dispose = exports_.apply(ctx)
check('apply 返回 disposer', typeof dispose === 'function')
const rootEl = window.document.querySelector('[data-dsh-whale]')
check('挂载 data-dsh-whale 容器', rootEl !== null)
check('注入样式', window.document.getElementById('pet-whale-style') !== null)
const pet = rootEl?.querySelector('.pet-official')
check('鲸鱼本体存在', pet !== null)
check('初始 idle 类', pet?.classList.contains('idle') === true)
check('SVG 有官方路径', (rootEl?.innerHTML.match(/M22\.9168/g) ?? []).length > 0)
const shadow = rootEl?.querySelector(':scope > .dsh-whale-shadow')
check('影子是容器兄弟元素（不随鲸鱼旋转）', shadow !== null)
check('影子不在鲸鱼内部', pet?.querySelector('.dsh-whale-shadow') === null)

const classesOf = () => [...(pet?.classList ?? [])].filter((c) => ['idle', 'think', 'working', 'celebrate', 'error', 'wait'].includes(c)).join(',')

// 状态机：think（文本流，先于 working 测，避免粘滞窗口干扰）
snap.running = true
snap.partial = { turn: 1, step: 1, blocks: [] }
sessionObservable.notify()
check('文本流 → think', classesOf() === 'think')

// 状态机：回合中无文字流无工具 → think（不回 idle）
snap.partial = null
sessionObservable.notify()
check('回合中空档 → think', classesOf() === 'think')

// 状态机：working（工具调用）
snap.runningCalls = [{ id: 't1' }]
sessionObservable.notify()
check('工具调用 → working', classesOf() === 'working')

// 状态机：有 pending 等待用户处理 → wait
snap.runningCalls = []
snap.pending = [{ kind: 'approval' }]
sessionObservable.notify()
check('有 pending → wait', classesOf() === 'wait')
snap.pending = []
sessionObservable.notify()
check('pending 清空回到底态', classesOf() === 'think' || classesOf() === 'working')

// 状态机：回合正常结束 → celebrate（瞬态）
snap.running = false
snap.runningCalls = []
snap.turnEnds = new Map([[1, 5]])
sessionObservable.notify()
check('回合完成 → celebrate', classesOf() === 'celebrate')

// 状态机：error 边沿（新错误出现）
snap.lastAgentError = 'boom'
sessionObservable.notify()
check('新错误 → error', classesOf() === 'error')

// 会话切走 → idle
currentId = undefined
ctx.sessions.list.notify()
check('无会话 → idle', classesOf() === 'idle')

// 交互：单击戳戳（加权触发 squish/rolling/dizzy）
pet.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
check('单击触发加权互动类', pet.classList.contains('squish') || pet.classList.contains('rolling') || pet.classList.contains('dizzy'))

// 右键菜单：快捷菜单精简，更多设置进入分类子菜单
pet.dispatchEvent(new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 200, clientY: 200 }))
const menu = rootEl.querySelector('.dsh-whale-menu')
check('右键打开菜单', menu?.classList.contains('open') === true)
const quickButtons = [...(menu?.querySelectorAll('button') ?? [])]
check('快捷菜单不超过 6 项', quickButtons.length <= 6)
const soundBtn = quickButtons.find((b) => b.textContent.includes('音效'))
check('快捷菜单有音效开关', soundBtn !== undefined)
const pretendBtn = quickButtons.find((b) => b.textContent.includes('假装工作'))
check('快捷菜单有假装工作', pretendBtn !== undefined)
soundBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
// 音效切换会关闭并重建快捷菜单，重新打开验证文案变化
pet.dispatchEvent(new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 200, clientY: 200 }))
const soundBtn2 = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('音效'))
check('音效开关切换文案', soundBtn2 !== undefined && soundBtn2.textContent !== soundBtn?.textContent)

// 换颜色：默认主题蓝 → 更多设置 → 外观 → 夜黑（眼睛应反白）
check('默认皮肤变量（主题蓝）', rootEl?.style.getPropertyValue('--pw-body') === '#4D6BFE')
check('默认眼睛变量（暖墨）', rootEl?.style.getPropertyValue('--pw-eye') === '#2E2A24')
pet.dispatchEvent(new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 200, clientY: 200 }))
const moreBtn = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('更多设置'))
check('快捷菜单有更多设置', moreBtn !== undefined)
moreBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
check('更多菜单保持打开', menu?.classList.contains('open') === true)
const appearanceBtn = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('外观'))
check('更多菜单有外观分类', appearanceBtn !== undefined)
const statsBtn = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('陪伴记录'))
check('更多菜单有陪伴记录分类', statsBtn !== undefined)

// 验证陪伴记录子菜单
statsBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
const statsItems = [...(menu?.querySelectorAll('.pw-stats-item') ?? [])]
check('陪伴记录展示项存在', statsItems.length >= 4)

// 返回更多菜单并进外观
const backBtn = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('返回'))
backBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
const appearanceBtn2 = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('外观'))
appearanceBtn2?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
check('外观菜单保持打开', menu?.classList.contains('open') === true)
const nightBtn = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('夜黑'))
check('外观菜单列出夜黑', nightBtn !== undefined)
nightBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
check('切夜黑后身体变量', rootEl?.style.getPropertyValue('--pw-body') === '#262626')
check('切夜黑后眼睛反白', rootEl?.style.getPropertyValue('--pw-eye') === '#F7F2E6')
check('皮肤持久化', window.localStorage.getItem('pet-whale:palette') === 'night')

// 行为子菜单：不应再出现“假装工作”，应包含“游泳”
pet.dispatchEvent(new window.MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 200, clientY: 200 }))
const moreBtn2 = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('更多设置'))
moreBtn2?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
const behaviorBtn = [...(menu?.querySelectorAll('button') ?? [])].find((b) => b.textContent.includes('行为'))
check('更多菜单有行为分类', behaviorBtn !== undefined)
behaviorBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
const behaviorButtons = [...(menu?.querySelectorAll('button') ?? [])]
check('行为菜单不含假装工作', behaviorButtons.every((b) => !b.textContent.includes('假装工作')))
check('行为菜单含游泳', behaviorButtons.some((b) => b.textContent.includes('游泳')))

// dispose
dispose()
check('dispose 移除容器', window.document.querySelector('[data-dsh-whale]') === null)
check('dispose 移除样式', window.document.getElementById('pet-whale-style') === null)

console.log(failures === 0 ? '\n全部通过' : `\n${failures} 项失败`)
process.exit(failures === 0 ? 0 : 1)
