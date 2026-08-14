// 从 preview.html 抽取 V2（官方轮廓版）鲸鱼 DOM，生成 src/client/whale.ts。
// 用法：node scripts/extract-whale.mjs
// 修改预览模板后重跑一次即可同步插件。
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(join(root, 'src', 'client'), { recursive: true })
const html = readFileSync(join(root, 'preview.html'), 'utf8')

const startMark = '<div class="pet-official idle" id="pet2">'
const start = html.indexOf(startMark)
if (start === -1) throw new Error('preview.html 里找不到 V2 容器 pet2')
const innerStart = start + startMark.length
const end = html.indexOf('</div>', innerStart)
if (end === -1) throw new Error('V2 容器没有闭合 </div>')
let inner = html.slice(innerStart, end).trim()

// 身体色换成 CSS 变量（配合 src/client/palettes.ts 换肤）。
// SVG 展示属性（fill/stop-color）不支持 var()，改成 style 属性。
// 只动身体渐变三档 + 腮红 + 键盘/代码粒子里的身体色，肚皮/眼睛/星星不动。
const colorVars = [
  ['#BC6238', '--pw-body-light'],
  ['#A3502C', '--pw-body'],
  ['#88431F', '--pw-body-dark'],
  ['#D98E6A', '--pw-blush'],
]
for (const [hex, varName] of colorVars) {
  inner = inner.replace(
    new RegExp(`(stop-color|fill)="${hex}"`, 'g'),
    `style="$1:var(${varName},${hex})"`,
  )
}

// 眼睛：用半径精确锚定（避免误伤键盘/黑线等处的同色），深色皮肤可反白
inner = inner.replace('r="1.25" fill="#2E2A24"', 'r="1.25" style="fill:var(--pw-eye,#2E2A24)"')
inner = inner.replace('r="0.42" fill="#FBF8F0"', 'r="0.42" style="fill:var(--pw-pupil,#FBF8F0)"')

// 模板字符串安全：内容里不允许有反引号或 ${（当前 SVG 都没有，出现就报错停下）
if (inner.includes('`') || inner.includes('${')) {
  throw new Error('抽取内容含模板字符串冲突字符，需要转义')
}

writeFileSync(
  join(root, 'src', 'client', 'whale.ts'),
  `// 由 scripts/extract-whale.mjs 从 preview.html 自动生成，勿手改。\n` +
    `// 改预览模板后重跑：node scripts/extract-whale.mjs\n` +
    `export const WHALE_HTML = \`${inner}\`\n`,
  'utf8',
)
console.log(`whale.ts 生成完成：${inner.length} 字符`)
