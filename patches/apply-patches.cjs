/*
 * DSH 自用 UI 美化补丁：暖色纸感主题（类 Claude）+ 鲸鱼发送/取消键
 *
 * 用法：node apply-patches.cjs [dsh 安装根目录]   （默认当前目录）
 * 适用：DSH rc.6（dist 产物 index-CSGf6Qzd.css；升级后锚点可能失效，请人工核对）
 *
 * 设计：
 *  - 幂等：每处补丁先查锚点，已打过直接跳过
 *  - 备份：应用前若 <文件>.dspatch.bak 不存在则备份原文件
 *  - 容错：锚点/替换串找不到时打印清晰错误（可能是 DSH 版本变了），
 *    继续处理其余补丁，最后汇总报告
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 控制台中文输出（Windows 终端切 UTF-8 代码页，失败也无所谓）
try {
  require('child_process').execSync('chcp 65001 >NUL', { stdio: 'ignore' });
} catch (e) { /* ignore */ }

const ROOT = process.argv[2] || process.cwd();

/* ============================================================
 * ① 发送/停止按钮鲸鱼化（dsh-client-ui-conversation/lib/client.js）
 * 改了什么：
 *  - 发送按钮图标：白色上箭头 SVG path → DeepSeek 官方鲸鱼 path
 *    （发送=蓝色鲸鱼，颜色走 --dsw-static-deepseek-500，跟随主题）
 *  - 停止按钮图标（2 处：主按钮运行态 + 独立中断按钮）：方块 rect → 黑色鲸鱼
 *    （fill #000，与 favicon 一致）
 *  - 按钮尺寸 34px → 48px，鲸鱼图标 16 → 25px
 *  - 按钮底色/文字：深蓝底白字 → 浅米底 + 主题陶土色
 * ============================================================ */
const WHALE_PATH = 'M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z';

const CONV_FILE = path.join(ROOT, 'node_modules/@deepseek-ai/dsh-client-ui-conversation/lib/client.js');
const CONV_MARK = 'width: "25", height: "18.4"'; // 幂等锚点：鲸鱼图标尺寸（打过补丁才存在）

function applyConversation(src) {
  // 1) 发送按钮：上箭头 path → 鲸鱼 path
  const arrowRe = /d: "M8\.3125 0\.980183.*?0\.980183Z"/;
  if (!arrowRe.test(src)) throw new Error('发送上箭头 path 未找到');
  src = src.replace(arrowRe, 'd: "' + WHALE_PATH + '"');

  // 2) 发送按钮 svg 外层：viewBox/尺寸 16 → 鲸鱼比例 23.16×17.04 / 25×18.4
  const sendSvgRe =
    /(\}\) : \(0, react_jsx_runtime\.jsx\)\("svg", \{\s*)viewBox: "0 0 16 16",\s*width: "16",\s*height: "16",(\s*"aria-hidden": true,\s*children: \(0, react_jsx_runtime\.jsx\)\("path", \{\s*d: "M22\.9168)/;
  if (!sendSvgRe.test(src)) throw new Error('发送按钮 svg 外层未找到');
  src = src.replace(
    sendSvgRe,
    '$1viewBox: "0 0 23.16 17.04", width: "25", height: "18.4",$2'
  );

  // 3) 停止按钮（2 处）：方块 rect svg → 黑色鲸鱼 svg
  const stopSvgRe =
    /\(0, react_jsx_runtime\.jsx\)\("svg", \{\s*viewBox: "0 0 16 16",\s*width: "16",\s*height: "16",\s*"aria-hidden": true,\s*children: \(0, react_jsx_runtime\.jsx\)\("rect", \{\s*x: "3",\s*y: "3",\s*width: "10",\s*height: "10",\s*rx: "3",\s*fill: "currentColor"\s*\}\)\s*\}\)/g;
  const stopHits = (src.match(stopSvgRe) || []).length;
  if (stopHits !== 2) throw new Error('停止按钮方块 svg 应找到 2 处，实际 ' + stopHits + ' 处');
  const stopRepl =
    '(0, react_jsx_runtime.jsx)("svg", {viewBox: "0 0 23.16 17.04", width: "25", height: "18.4", "aria-hidden": true, children: (0, react_jsx_runtime.jsx)("path", {d: "' +
    WHALE_PATH +
    '", fill: "#000"})})';
  src = src.replace(stopSvgRe, stopRepl);

  // 4) 按钮尺寸 34px → 48px
  const sizeRe = /place-items:center;width:34px;height:34px;transition/;
  if (!sizeRe.test(src)) throw new Error('按钮 34px 样式未找到');
  src = src.replace(sizeRe, 'place-items:center;width:48px;height:48px;transition');

  // 5) 按钮底色/文字：蓝底白字 → 浅米底 + 主题色
  const bgRe = /\.uV2eYG_primary\{background:var\(--dsw-alias-button-info-fill\);color:#fff;/;
  if (!bgRe.test(src)) throw new Error('按钮底色样式未找到');
  src = src.replace(
    bgRe,
    '.uV2eYG_primary{background:var(--dsw-static-deepseek-50);color:var(--dsw-static-deepseek-500);'
  );

  // 6) 按钮 hover：蓝色 hover → 浅米色 hover
  const hoverRe = /\.uV2eYG_primary:hover:not\(:disabled\)\{background:var\(--dsw-alias-button-info-hover\)\}/;
  if (!hoverRe.test(src)) throw new Error('按钮 hover 样式未找到');
  src = src.replace(hoverRe, '.uV2eYG_primary:hover:not(:disabled){background:var(--dsw-static-deepseek-100)}');

  return src;
}

/* ============================================================
 * ②③④ 暖调纸感主题（Claude 风格）
 * 改了什么（token 层，全部是 --dsw-static / --dsw-alias / 渐变 / 行高）：
 *  - neutral-bluish / neutral 灰阶 → 暖纸色阶（底色生成里米白 #F7F2E6、
 *    侧边栏 #F3EEDF、文字暖墨 #2E2A24）
 *  - deepseek 蓝 → 陶土强调色（#A3502C 等一档）
 *  - blue 色系降饱和为钝色
 *  - 亮色 hover/边框从冷蓝 rgba(38,49,72) 改为暖墨 rgba(46,42,36)
 *  - brand-primary-new-color 硬编码蓝 → 引用陶土静态色
 *  - think 渐隐渐变收尾色同步纸色；markdown 正文行高 28px → 30px
 *  - 新增 --dsw-alias-text-accent（亮 #857B6C / 暗 #BFB6A2），
 *    供 dsh-navbar 等第三方插件覆盖默认蓝色激活点
 * 涉及文件：
 *  - ② dist：dsh-web-frontend/dist/assets/index-CSGf6Qzd.css（浏览器实际加载的）
 *  - ③ 镜像：dsh-client-ui-theme/lib/styles/design-platform.css
 *  - ④ 镜像：dsh-client-ui-theme/lib/styles/gradient-shadow-text.css
 * ============================================================ */
// 第一轮：静态色阶 + 别名（改前 → 改后，必须按序执行）
const THEME_PAIRS = [
['--dsw-static-neutral-bluish-00: rgb(255, 255, 255)','--dsw-static-neutral-bluish-00: rgb(250, 247, 240)'],
['--dsw-static-neutral-bluish-50: rgb(249, 250, 251)','--dsw-static-neutral-bluish-50: rgb(244, 240, 231)'],
['--dsw-static-neutral-bluish-60: rgb(245, 246, 247)','--dsw-static-neutral-bluish-60: rgb(241, 237, 227)'],
['--dsw-static-neutral-bluish-75: rgb(241, 243, 245)','--dsw-static-neutral-bluish-75: rgb(236, 231, 219)'],
['--dsw-static-neutral-bluish-100: rgb(235, 238, 242)','--dsw-static-neutral-bluish-100: rgb(228, 222, 208)'],
['--dsw-static-neutral-bluish-150: rgb(233, 236, 242)','--dsw-static-neutral-bluish-150: rgb(222, 215, 199)'],
['--dsw-static-neutral-bluish-200: rgb(225, 229, 238)','--dsw-static-neutral-bluish-200: rgb(213, 204, 185)'],
['--dsw-static-neutral-bluish-300: rgb(207, 211, 214)','--dsw-static-neutral-bluish-300: rgb(191, 182, 162)'],
['--dsw-static-neutral-bluish-400: rgb(173, 178, 184)','--dsw-static-neutral-bluish-400: rgb(154, 144, 128)'],
['--dsw-static-neutral-bluish-500: rgb(151, 157, 166)','--dsw-static-neutral-bluish-500: rgb(133, 123, 108)'],
['--dsw-static-neutral-bluish-600: rgb(129, 133, 140)','--dsw-static-neutral-bluish-600: rgb(110, 101, 89)'],
['--dsw-static-neutral-bluish-700: rgb(97, 102, 107)','--dsw-static-neutral-bluish-700: rgb(85, 78, 68)'],
['--dsw-static-neutral-bluish-750: rgb(67, 69, 74)','--dsw-static-neutral-bluish-750: rgb(72, 65, 57)'],
['--dsw-static-neutral-bluish-800: rgb(53, 54, 56)','--dsw-static-neutral-bluish-800: rgb(62, 56, 48)'],
['--dsw-static-neutral-bluish-850: rgb(44, 44, 46)','--dsw-static-neutral-bluish-850: rgb(52, 48, 40)'],
['--dsw-static-neutral-bluish-875: rgb(35, 35, 36)','--dsw-static-neutral-bluish-875: rgb(43, 39, 32)'],
['--dsw-static-neutral-bluish-900: rgb(27, 27, 28)','--dsw-static-neutral-bluish-900: rgb(36, 32, 25)'],
['--dsw-static-neutral-bluish-950: rgb(21, 21, 23)','--dsw-static-neutral-bluish-950: rgb(29, 25, 20)'],
['--dsw-static-neutral-bluish-1000: rgb(15, 17, 21)','--dsw-static-neutral-bluish-1000: rgb(46, 42, 36)'],
['--dsw-static-neutral-00: rgb(255, 255, 255)','--dsw-static-neutral-00: rgb(250, 247, 240)'],
['--dsw-static-neutral-1000: rgb(0, 0, 0)','--dsw-static-neutral-1000: rgb(46, 42, 36)'],
['--dsw-static-neutral-50: rgb(250, 250, 250)','--dsw-static-neutral-50: rgb(250, 247, 240)'],
['--dsw-static-neutral-100: rgb(245, 245, 245)','--dsw-static-neutral-100: rgb(244, 240, 231)'],
['--dsw-static-neutral-150: rgb(237, 237, 237)','--dsw-static-neutral-150: rgb(236, 231, 219)'],
['--dsw-static-neutral-200: rgb(229, 229, 229)','--dsw-static-neutral-200: rgb(228, 222, 208)'],
['--dsw-static-neutral-250: rgb(220, 220, 220)','--dsw-static-neutral-250: rgb(220, 213, 198)'],
['--dsw-static-neutral-300: rgb(212, 212, 212)','--dsw-static-neutral-300: rgb(213, 204, 185)'],
['--dsw-static-neutral-400: rgb(162, 164, 166)','--dsw-static-neutral-400: rgb(154, 144, 128)'],
['--dsw-static-neutral-500: rgb(127, 130, 135)','--dsw-static-neutral-500: rgb(133, 123, 108)'],
['--dsw-static-neutral-550: rgb(101, 103, 107)','--dsw-static-neutral-550: rgb(110, 101, 89)'],
['--dsw-static-neutral-600: rgb(84, 85, 87)','--dsw-static-neutral-600: rgb(85, 78, 68)'],
['--dsw-static-neutral-700: rgb(60, 60, 61)','--dsw-static-neutral-700: rgb(72, 65, 57)'],
['--dsw-static-neutral-800: rgb(41, 41, 41)','--dsw-static-neutral-800: rgb(52, 48, 40)'],
['--dsw-static-neutral-850: rgb(33, 33, 35)','--dsw-static-neutral-850: rgb(43, 39, 32)'],
['--dsw-static-neutral-900: rgb(15, 15, 15)','--dsw-static-neutral-900: rgb(29, 25, 20)'],
['--dsw-static-deepseek-50: rgb(237, 243, 254)','--dsw-static-deepseek-50: rgb(247, 234, 225)'],
['--dsw-static-deepseek-100: rgb(228, 237, 253)','--dsw-static-deepseek-100: rgb(240, 220, 205)'],
['--dsw-static-deepseek-200: rgb(211, 226, 255)','--dsw-static-deepseek-200: rgb(230, 200, 178)'],
['--dsw-static-deepseek-300: rgb(183, 200, 254)','--dsw-static-deepseek-300: rgb(213, 168, 140)'],
['--dsw-static-deepseek-400: rgb(103, 158, 254)','--dsw-static-deepseek-400: rgb(198, 126, 86)'],
['--dsw-static-deepseek-450: rgb(86, 134, 254)','--dsw-static-deepseek-450: rgb(187, 110, 71)'],
['--dsw-static-deepseek-500: rgb(65, 118, 230)','--dsw-static-deepseek-500: rgb(163, 80, 44)'],
['--dsw-static-deepseek-600: rgb(72, 104, 178)','--dsw-static-deepseek-600: rgb(143, 68, 39)'],
['--dsw-static-deepseek-700-delete: rgb(47, 76, 143)','--dsw-static-deepseek-700-delete: rgb(124, 58, 34)'],
['--dsw-static-deepseek-800: rgb(52, 65, 91)','--dsw-static-deepseek-800: rgb(92, 66, 51)'],
['--dsw-static-deepseek-900: rgb(40, 49, 66)','--dsw-static-deepseek-900: rgb(74, 55, 43)'],
['--dsw-static-blue-50: rgb(239, 246, 255)','--dsw-static-blue-50: rgb(240, 242, 244)'],
['--dsw-static-blue-50p: rgb(234, 243, 255)','--dsw-static-blue-50p: rgb(235, 238, 242)'],
['--dsw-static-blue-75: rgb(229, 240, 255)','--dsw-static-blue-75: rgb(230, 234, 240)'],
['--dsw-static-blue-100: rgb(219, 234, 254)','--dsw-static-blue-100: rgb(226, 232, 240)'],
['--dsw-static-blue-300: rgb(147, 197, 253)','--dsw-static-blue-300: rgb(168, 184, 205)'],
['--dsw-static-blue-400: rgb(96, 165, 250)','--dsw-static-blue-400: rgb(122, 142, 172)'],
['--dsw-static-blue-450: rgb(77, 147, 248)','--dsw-static-blue-450: rgb(110, 130, 162)'],
['--dsw-static-blue-500: rgb(59, 130, 246)','--dsw-static-blue-500: rgb(96, 118, 150)'],
['--dsw-static-blue-600: rgb(37, 99, 235)','--dsw-static-blue-600: rgb(74, 92, 124)'],
['--dsw-static-blue-800: rgb(30, 64, 175)','--dsw-static-blue-800: rgb(55, 65, 95)'],
['--dsw-static-blue-900: rgb(14, 48, 116)','--dsw-static-blue-900: rgb(60, 66, 86)'],
['--dsw-static-blue-950: rgb(23, 37, 84)','--dsw-static-blue-950: rgb(40, 46, 62)'],
['--dsw-alias-label-primary-bluish: var(--dsw-static-blue-900)','--dsw-alias-label-primary-bluish: var(--dsw-static-deepseek-600)'],
['--dsw-alias-label-primary-bluish: var(--dsw-static-neutral-bluish-50)','--dsw-alias-label-primary-bluish: var(--dsw-static-deepseek-400)'],
['--dsw-alias-interactive-bg-hover: rgba(38, 49, 72, 0.06)','--dsw-alias-interactive-bg-hover: rgba(46, 42, 36, 0.06)'],
['--dsw-alias-interactive-bg-active: rgba(38, 49, 72, 0.1)','--dsw-alias-interactive-bg-active: rgba(46, 42, 36, 0.1)'],
['--dsw-alias-interactive-bg-hover-accent: rgba(38, 49, 72, 0.14)','--dsw-alias-interactive-bg-hover-accent: rgba(163, 80, 44, 0.12)'],
['--dsw-alias-border-l1: rgba(0, 0, 0, 0.04)','--dsw-alias-border-l1: rgba(46, 42, 36, 0.05)'],
['--dsw-alias-border-l2: rgba(0, 0, 0, 0.1)','--dsw-alias-border-l2: rgba(46, 42, 36, 0.1)'],
['--dsw-alias-border-l2-darkmode-thin: rgba(0, 0, 0, 0.1)','--dsw-alias-border-l2-darkmode-thin: rgba(46, 42, 36, 0.1)'],
['--dsw-alias-border-l3: rgba(0, 0, 0, 0.12)','--dsw-alias-border-l3: rgba(46, 42, 36, 0.12)'],
['--dsw-alias-border-l4: rgba(0, 0, 0, 0.16)','--dsw-alias-border-l4: rgba(46, 42, 36, 0.16)'],
['#fff 20.19%','#faf7f0 20.19%'],
['#f5f6f7 20.19%','#f1ede3 20.19%'],
['#151517 20.19%','#1d1914 20.19%'],
['#232325 20.19%','#242019 20.19%'],
['--dsw-font-markdown-base-line-height: 28px','--dsw-font-markdown-base-line-height: 30px'],
['--dsw-font-markdown-base: 16px/28px','--dsw-font-markdown-base: 16px/30px'],
];
// dist 专用：压缩后的 rgba 格式（.06 无前导零），亮色 hover/边框暖化
const THEME_PAIRS_DIST = [
['--dsw-alias-interactive-bg-hover: rgba(38, 49, 72, .06)','--dsw-alias-interactive-bg-hover: rgba(46, 42, 36, .06)'],
['--dsw-alias-interactive-bg-active: rgba(38, 49, 72, .1)','--dsw-alias-interactive-bg-active: rgba(46, 42, 36, .1)'],
['--dsw-alias-interactive-bg-hover-accent: rgba(38, 49, 72, .14)','--dsw-alias-interactive-bg-hover-accent: rgba(163, 80, 44, .12)'],
['--dsw-alias-border-l1: rgba(0, 0, 0, .04)','--dsw-alias-border-l1: rgba(46, 42, 36, .05)'],
['--dsw-alias-border-l2: rgba(0, 0, 0, .1)','--dsw-alias-border-l2: rgba(46, 42, 36, .1)'],
['--dsw-alias-border-l2-darkmode-thin: rgba(0, 0, 0, .1)','--dsw-alias-border-l2-darkmode-thin: rgba(46, 42, 36, .1)'],
['--dsw-alias-border-l3: rgba(0, 0, 0, .12)','--dsw-alias-border-l3: rgba(46, 42, 36, .12)'],
['--dsw-alias-border-l4: rgba(0, 0, 0, .16)','--dsw-alias-border-l4: rgba(46, 42, 36, .16)'],
];
// 硬编码的 DeepSeek 蓝（别名层直接写死 rgb，不引用静态色）→ 陶土
const BRAND_BLUE_PAIR = ['brand-primary-new-colorprimary-new-color: rgb(65, 118, 230)', 'brand-primary-new-colorprimary-new-color: var(--dsw-static-deepseek-500)'];
// 微调：主区底色回调 + 侧边栏配对（改前值来自第一轮结果，顺序执行自动衔接）
const THEME_TWEAK = [
['--dsw-static-neutral-bluish-00: rgb(250, 247, 240)','--dsw-static-neutral-bluish-00: rgb(247, 242, 230)'],
['--dsw-static-neutral-00: rgb(250, 247, 240)','--dsw-static-neutral-00: rgb(247, 242, 230)'],
['--dsw-static-neutral-bluish-50: rgb(244, 240, 231)','--dsw-static-neutral-bluish-50: rgb(243, 238, 223)'],
['#faf7f0 20.19%','#f7f0e0 20.19%'],
['#f7f0e0 20.19%','#f7f2e6 20.19%'],
];
// text-accent 新增 token（供 dsh-navbar 等第三方插件覆盖默认蓝色激活点）
const TEXT_ACCENT_PAIRS = [
['--dsw-alias-tooltip-bg: var(--dsw-static-neutral-bluish-850);', '--dsw-alias-tooltip-bg: var(--dsw-static-neutral-bluish-850);--dsw-alias-text-accent: var(--dsw-static-neutral-bluish-500);'],
['--dsw-alias-tooltip-bg: var(--dsw-static-neutral-bluish-750);', '--dsw-alias-tooltip-bg: var(--dsw-static-neutral-bluish-750);--dsw-alias-text-accent: var(--dsw-static-neutral-bluish-300);'],
];

const DIST_CSS = path.join(ROOT, 'node_modules/@deepseek-ai/dsh-web-frontend/dist/assets/index-CSGf6Qzd.css');
const DP_CSS = path.join(ROOT, 'node_modules/@deepseek-ai/dsh-client-ui-theme/lib/styles/design-platform.css');
const GSS_CSS = path.join(ROOT, 'node_modules/@deepseek-ai/dsh-client-ui-theme/lib/styles/gradient-shadow-text.css');
const THEME_MARK = '--dsw-static-deepseek-500: rgb(163, 80, 44)'; // 幂等锚点：陶土主色
const GSS_MARK = '#f7f2e6 20.19%'; // 幂等锚点：think 渐变最终收尾色

// 顺序执行替换对；有任一 old 找不到时返回 null（不写回）
function applyPairs(src, pairs) {
  const missing = [];
  for (const [oldS, newS] of pairs) {
    if (!src.includes(oldS)) {
      missing.push(oldS.slice(0, 60));
    } else {
      src = src.split(oldS).join(newS);
    }
  }
  if (missing.length > 0) {
    const err = new Error('以下 ' + missing.length + ' 个锚点未找到：\n  ' + missing.join('\n  '));
    err.missing = missing;
    throw err;
  }
  return src;
}

/* ============================================================
 * 补丁执行框架
 * ============================================================ */
const patches = [
  {
    name: '发送/停止按钮：鲸鱼图标 + 48px + 浅底样式',
    file: CONV_FILE,
    mark: CONV_MARK,
    apply: applyConversation,
  },
  {
    name: '暖纸感主题（dist CSS，浏览器实际加载）',
    file: DIST_CSS,
    mark: THEME_MARK,
    apply: (src) =>
      applyPairs(src, [
        ...THEME_PAIRS,
        ...THEME_PAIRS_DIST,
        BRAND_BLUE_PAIR,
        ...THEME_TWEAK,
        ...TEXT_ACCENT_PAIRS,
      ]),
  },
  {
    name: '主题镜像（design-platform.css）',
    file: DP_CSS,
    mark: THEME_MARK,
    // design-platform.css 只含 token，不含渐变/行高（那些在 gradient-shadow-text.css），
    // 所以过滤掉以 # 开头（渐变）和 --dsw-font- 开头（行高）的替换对。
    apply: (src) =>
      applyPairs(src, [
        ...THEME_PAIRS.filter(([o]) => !o.startsWith('#') && !o.startsWith('--dsw-font-')),
        BRAND_BLUE_PAIR,
        ...THEME_TWEAK.filter(([o]) => !o.startsWith('#')),
        ...TEXT_ACCENT_PAIRS,
      ]),
  },
  {
    name: '主题镜像（gradient-shadow-text.css：渐变 + 行高）',
    file: GSS_CSS,
    mark: GSS_MARK,
    apply: (src) =>
      applyPairs(src, [
        ['#fff 20.19%', '#faf7f0 20.19%'],
        ['#faf7f0 20.19%', '#f7f0e0 20.19%'],
        ['#f7f0e0 20.19%', '#f7f2e6 20.19%'],
        ['#f5f6f7 20.19%', '#f1ede3 20.19%'],
        ['#151517 20.19%', '#1d1914 20.19%'],
        ['#232325 20.19%', '#242019 20.19%'],
        ['--dsw-font-markdown-base-line-height: 28px', '--dsw-font-markdown-base-line-height: 30px'],
        ['--dsw-font-markdown-base: 16px/28px', '--dsw-font-markdown-base: 16px/30px'],
      ]),
  },
];

let ok = 0;
let skipped = 0;
let failed = 0;
const failDetails = [];

console.log('===== DSH 自用 UI 美化补丁 =====');
console.log('补丁数量：' + patches.length + ' 处\n');

for (const p of patches) {
  if (!fs.existsSync(p.file)) {
    failed++;
    failDetails.push(p.name + '：目标文件不存在 ' + p.file);
    console.log('[失败　] ' + p.name + ' → 目标文件不存在（dsh 装的位置对吗？）');
    continue;
  }
  let src;
  try {
    src = fs.readFileSync(p.file, 'utf8');
  } catch (e) {
    failed++;
    failDetails.push(p.name + '：读取失败 ' + e.message);
    console.log('[失败　] ' + p.name + ' → 读取失败：' + e.message);
    continue;
  }

  if (src.includes(p.mark)) {
    skipped++;
    console.log('[已打过] ' + p.name + ' → 补丁已存在，跳过');
    continue;
  }

  // 备份（仅当备份不存在时）
  const backup = p.file + '.dspatch.bak';
  if (!fs.existsSync(backup)) {
    try {
      fs.writeFileSync(backup, src);
    } catch (e) {
      failed++;
      failDetails.push(p.name + '：备份失败 ' + e.message);
      console.log('[失败　] ' + p.name + ' → 备份失败：' + e.message);
      continue;
    }
  }

  // 应用
  try {
    const out = p.apply(src);
    fs.writeFileSync(p.file, out);
    ok++;
    console.log('[已应用] ' + p.name + ' → 成功（备份：' + path.basename(backup) + '）');
  } catch (e) {
    failed++;
    const detail = p.name + '：' + e.message;
    failDetails.push(detail);
    console.log('[失败　] ' + p.name + ' → ' + e.message);
    console.log('          ↑ 可能是 dsh 版本变了（代码结构改动），请人工核对后更新本脚本。文件未被修改。');
  }
}

console.log('\n===== 汇总 =====');
console.log('成功应用：' + ok + ' 处，已打过跳过：' + skipped + ' 处，失败：' + failed + ' 处');
if (failed > 0) {
  console.log('\n失败明细：');
  for (const d of failDetails) console.log('  - ' + d);
  console.log('\n提示：失败处未修改文件，重跑脚本前先修复锚点（或等 dsh 版本核对）。');
  process.exit(1);
}
console.log('全部完成。重启 dsh 或刷新浏览器即可看到改动。');
