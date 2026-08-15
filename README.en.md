# pet-whale 🐳

A desktop pet plugin for the DeepSeek Harness (DSH) Web UI. A small whale floats in the bottom-right corner and reacts to your agent's state in real time.

It uses the official DeepSeek whale outline, pure DOM animations, zero runtime third-party dependencies, and WebAudio-synthesized sound effects (no audio files).

## Live Preview

Open the standalone preview page to try every state and interaction:

👉 **<https://nzl153.github.io/pet-whale/preview.html>**

The repository's [preview.html](preview.html) is the same page and can be opened locally.

## Features

| Capability | Description |
|---|---|
| State machine | idle / think (diving) / working (swimming + typing + code particles) / celebrate (leaping + bubbles) / error (shaking + black lines); priority: error > celebrate > think > working > idle |
| Turn semantics | Never idle while a turn is running: with tools = working, without tools (text or internal reasoning) = think diving; keyboard animation sticks for 2.5s during tool-heavy phases |
| Interactions | Click to poke, double-click 360° flip, drag with >_< eyes, right-click quick menu, mouse-follow eyes, 20s idle sleep |
| Quick menu & settings | Right-click opens a compact 5-item quick menu; "More settings" opens a grouped panel (appearance / behavior / rest) that scales as features grow |
| Pretend work | "Pretend to work" mode keeps the typing animation on; preference is persisted |
| Think ticker | While thinking, the latest reasoning text scrolls above the whale (can be toggled) |
| Smart avoidance | In idle, the whale moves aside when the cursor lingers nearby; grabbing/right-click cancels and cools down for 8s |
| Theme sync | Follows DSH light/dark theme for bubbles, dialogs, and shadows |
| Background power saving | Animations, sounds, and the think ticker pause when the page is hidden |
| Idle micro-movements | Random swimming, looking around, and bubble blowing |
| Error care | Click the whale during error state to copy the error text |
| Skins | 7 built-in palettes (default Theme Blue), extensible by adding one line in `src/client/palettes.ts` |
| Hide/recall | Hide to a small 🐳 button; state persists across refresh |
| Scheduled hide | Hide after 1 hour or every day at 22:00 |
| Sound | WebAudio-synthesized sounds, can be muted |
| Accessibility | Respects `prefers-reduced-motion` |

## i18n

- Chinese and English UI strings.
- In DSH, it follows the DSH language setting automatically.
- In the standalone preview, it follows the browser language and can be switched manually.

## Install

Requires DSH `>=0.1.0-rc.6` (web profile).

```sh
# Local directory install (the repo already contains built lib/, no build needed)
dsh plugin --profile web add link:/path/to/pet-whale

# Or install directly from Git
dsh plugin --profile web add "github:nzl153/pet-whale#main"
```

After installation, restart `dsh web` (the host half is composed at startup). Client-side changes only need a hard refresh (Ctrl+F5).

## Build & Test

```sh
pnpm install
pnpm typecheck   # TypeScript type check
pnpm build       # tsdown → lib/index.mjs + lib/client.js
pnpm test        # jsdom smoke test (state machine / interactions / skins / cleanup)
```

## Development

- `src/client/palettes.ts` — palette extension point. Add one line for a new skin.
- `scripts/extract-whale.mjs` — sync the V2 SVG from `preview.html` into `src/client/whale.ts`.
- `scripts/verify-live.mjs` — one-click live verification after restart.
- State source: `ctx.sessions` session snapshots (`running` / `runningCalls` / `partial` / `lastAgentError` / `turnEnds`).

## License

[MIT](LICENSE)
