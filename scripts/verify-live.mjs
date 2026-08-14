// 重启后的线上验证：检查 boot 清单含 pet-whale、client bundle 可下载、注册格式正确。
// 用法：node scripts/verify-live.mjs
const BASE = 'http://127.0.0.1:3080'

let failures = 0
const check = (name, ok, extra = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
  if (!ok) failures++
}

const res = await fetch(BASE)
const html = await res.text()
check('主页 HTTP 200', res.status === 200)

const entryMatch = html.match(/\{"id":"pet-whale"[^}]*\}/)
check('boot 清单含 pet-whale 条目', entryMatch !== null)
if (entryMatch !== null) {
  const entry = JSON.parse(entryMatch[0])
  check('条目 url 存在', typeof entry.url === 'string' && entry.url.length > 0, entry.url)
  check('条目 rev 存在', typeof entry.rev === 'string' && entry.rev.length > 0)
  const inject = entry.inject ?? []
  check('inject 含 client-runtime', inject.includes('@deepseek-ai/dsh-client-runtime'), JSON.stringify(inject))

  const url = new URL(entry.url, BASE)
  const jsRes = await fetch(url)
  const js = await jsRes.text()
  check('client bundle 可下载', jsRes.status === 200, `${url.pathname} (${js.length} 字节)`)
  check('bundle 是 __ModuleLoader__ 注册格式', js.includes('window.__ModuleLoader__.load'), '')
  check('bundle 注册 id 为 pet-whale', js.includes('"pet-whale"'))
  check('bundle 导出 inject', js.includes('exports.inject'))
  check('bundle 导出 apply', js.includes('exports.apply'))
}

console.log(failures === 0 ? '\n线上验证全部通过' : `\n${failures} 项失败`)
process.exit(failures === 0 ? 0 : 1)
