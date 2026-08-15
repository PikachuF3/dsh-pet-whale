# pet-whale · 桌宠小鲸鱼 🐳

DeepSeek Harness（DSH）Web 界面的桌宠插件：右下角一只**官方轮廓版小鲸鱼**，随 agent 状态实时切换动画。纯 DOM 实现、零 React 依赖、零运行时第三方依赖，WebAudio 合成音效无音频文件。

## 在线预览

无需安装，点开即玩（全部状态与交互，官方轮廓版）：

👉 **<https://nzl153.github.io/pet-whale/preview.html>**

仓库内的 [preview.html](preview.html) 即预览页源码，本地直接打开同样可以体验。

## 特性

| 能力 | 说明 |
|---|---|
| 状态机 | idle / think（深潜）/ working（游动 + 敲键盘 + 代码粒子）/ celebrate（跃起冒泡）/ error（发抖 + 尴尬黑线）；优先级 error > celebrate > think > working > idle |
| 回合语义 | 回合进行中永不发呆：有工具 = working，无工具（文字流或内部推理）= think 深潜；工具密集期键盘动画粘滞 2.5s |
| 交互 | 单击戳戳、双击 360° 翻滚、右键菜单（投喂 / 摸摸头 / 换颜色 / 音效开关）、鼠标追光、20s 无操作打瞌睡、拖拽移动并记忆位置 |
| 换肤 | 7 套预设色板（默认**主题蓝**）：主题蓝 / 陶土 / 深海蓝 / 抹茶绿 / 樱粉 / 墨灰 / 夜黑；夜黑为深色皮肤示例（眼睛自动反白）。扩展只需在 `src/client/palettes.ts` 加一行 |
| 音效 | WebAudio 合成六种音效，右键可关，偏好持久化 |
| 无障碍 | `prefers-reduced-motion` 下自动降级为静态显示 |

## 安装

要求 DSH `>=0.1.0-rc.6`（web profile）。

```sh
# 本地目录安装（仓库已包含构建产物 lib/，无需先构建）
dsh plugin --profile web add link:/path/to/pet-whale

# 或 git 直装
dsh plugin --profile web add "github:<user>/pet-whale#main"
```

装完**重启 dsh web**（host 半在启动时合成）。之后 client 半的改动只需硬刷新（Ctrl+F5），无需重启。

## 构建与测试

```sh
pnpm install
pnpm typecheck   # tsc 类型检查
pnpm build       # tsdown → lib/index.mjs + lib/client.js
pnpm test        # jsdom 冒烟测试（状态机 / 交互 / 换肤 / 清理）
```

## 开发

- `src/client/palettes.ts` — 色板扩展点。加一行就是一个新皮肤；`eye`/`pupil` 字段用于深色皮肤的"眼睛反白"
- `scripts/extract-whale.mjs` — 从 `preview.html` 同步 V2 SVG（含 CSS 变量替换），改完模板重跑 `pnpm extract`
- `scripts/verify-live.mjs` — 重启后的一键线上验证（boot 清单 / bundle 下载 / 注册格式）
- 状态来源：`ctx.sessions` 服务的会话快照（`running` / `runningCalls` / `partial` / `lastAgentError` / `turnEnds`），详见 `src/client/state.ts`

## 附：自用 UI 美化补丁（仅供参考）

[patches/](patches/) 目录包含个人自用的 DSH 界面定制补丁，随仓库开源供参考，**不是本插件的组成部分**：

- **暖色纸感主题**：类 Claude 风格暖调配色（陶土 `#A3502C` + 米白 `#F7F2E6` + 暖墨 `#2E2A24`），亮暗两套，正文对比度 ≥4.5（WCAG AA）
- **鲸鱼发送 / 取消键**：发送键 = 蓝色小鲸鱼，取消键 = 黑色小鲸鱼（与 favicon 一致），按钮 48px
- 针对 DSH rc.6 的特定构建产物编写，升级 DSH 后若锚点失效需人工核对更新

```sh
node patches/apply-patches.cjs <dsh 安装根目录>
```

## 声明

- 鲸鱼轮廓使用 DeepSeek 官方 FishLogo 路径（品牌素材，使用请注明出处）
- 交互设计思路参考 [whale-girl](https://github.com/vlln/whale-girl)（MIT）
- 主题配色灵感来自 Anthropic Claude 的暖色纸感风格

## License

[MIT](LICENSE)
