// 构建产物守卫：确认两个 half 都产出了。
// 第一个 entry 带 clean:true 会先清空 lib/，第二个 entry 编译失败时 lib/ 会只剩 index.mjs，
// 而 lib/ 是要提交进仓库的（没有 prepare 脚本，git 装插件时不会自己构建），
// 缺了 client.js 就等于发了个装上去没反应的空壳。
// 用法：node scripts/verify-build.mjs（已挂在 npm run build 后面）
import fs from 'node:fs'

const EXPECTED = [
  { file: 'lib/index.mjs', min: 40 },
  { file: 'lib/client.js', min: 20000 },
]

let failures = 0
for (const { file, min } of EXPECTED) {
  const exists = fs.existsSync(file)
  const size = exists ? fs.statSync(file).size : 0
  const ok = exists && size >= min
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${file}  ${exists ? size + ' B' : '不存在'}${ok ? '' : `  — 期望至少 ${min} B`}`)
  if (!ok) failures++
}

// client bundle 必须带上 __ModuleLoader__ 契约的头尾，否则 DSH 装上去不会注册
if (fs.existsSync('lib/client.js')) {
  const text = fs.readFileSync('lib/client.js', 'utf8')
  // 尾部会被格式化（缩进、换行都可能变），只认关键结构，别锁死具体写法
  const tail = text.trimEnd()
  const ok = text.includes('window.__ModuleLoader__.load(')
    && text.includes('return module.exports;')
    && tail.endsWith('});')
  console.log(`${ok ? 'PASS' : 'FAIL'}  client.js 保留 __ModuleLoader__ 头尾`)
  if (!ok) failures++
}

if (failures > 0) {
  console.error(`\n构建产物不完整（${failures} 项不通过）。不要提交 lib/，先修构建。`)
  process.exit(1)
}
console.log('\n构建产物完整。')
