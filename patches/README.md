# 自用 UI 美化补丁（仅供参考）

个人自用的 DSH 界面定制，随桌宠仓库开源**仅供参考**，不是桌宠插件的组成部分。针对 DSH rc.6 的特定构建产物编写。

## 包含什么

1. **暖色纸感主题**（类 Claude 风格）
   - 灰阶 → 暖纸色阶：底色里米白 `#F7F2E6`、侧边栏 `#F3EEDF`、文字暖墨 `#2E2A24`
   - DeepSeek 蓝 → 陶土强调色（`#A3502C` 一档），blue 色系整体降饱和
   - 亮色 hover/边框从冷蓝 `rgba(38,49,72)` 暖化为暖墨 `rgba(46,42,36)`
   - markdown 正文行高 28 → 30px；新增 `--dsw-alias-text-accent` token
   - 亮/暗两套，正文对比度全部 ≥4.5（WCAG AA）
   - 改 3 个文件：dist CSS（浏览器实际加载）+ 两个主题包源文件（镜像）

2. **鲸鱼发送 / 取消键**
   - 发送键：白色上箭头 → DeepSeek 官方鲸鱼（蓝色，走 `--dsw-static-deepseek-500` 跟随主题）
   - 取消键（2 处）：方块 → 黑色鲸鱼（与 favicon 一致）
   - 按钮 34 → 48px，图标 16 → 25px；浅米底 + 主题陶土色

## 用法

```sh
node apply-patches.cjs <dsh 安装根目录>
```

- 幂等：已打过自动跳过
- 自动备份：应用前备份为 `<文件>.dspatch.bak`
- 锚点失败不写回文件，报错提示后继续其余补丁

## 注意

- 改的是 `node_modules` 下的文件，**DSH 升级（npm install）后会丢失**，重跑一次脚本即可恢复
- DSH 版本升级后锚点可能失效，需人工核对更新替换对
- 生效方式：dist CSS 改动硬刷新（Ctrl+F5）；conversation 按钮改动需要重启 dsh web
