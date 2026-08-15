window.__ModuleLoader__.load({
	id: "pet-whale",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/whale.ts
		const WHALE_HTML = `<svg viewBox="-2 -1 26 19" aria-hidden="true">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style="stop-color:var(--pw-body-light,#8FB5FF)"/>
              <stop offset="0.55" style="stop-color:var(--pw-body,#4D6BFE)"/>
              <stop offset="1" style="stop-color:var(--pw-body-dark,#3550C9)"/>
            </linearGradient>
            <clipPath id="whaleClip">
              <path d="M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z"/>
            </clipPath>
          </defs>

          <g class="body">
            <!-- 官方完整单一路经身体 -->
            <path d="M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z" fill="url(#bodyGrad)" stroke="#3550C9" stroke-width="0.3" stroke-linejoin="round"/>

            <!-- 肚皮 -->
            <ellipse cx="11.2" cy="12.6" rx="8" ry="3.3" fill="#F7F2E6" clip-path="url(#whaleClip)"/>
            <!-- 背部高光 -->
            <ellipse cx="9.6" cy="3.5" rx="6.8" ry="1.55" fill="#FBF8F0" opacity=".3" clip-path="url(#whaleClip)" transform="rotate(-8 9.6 3.5)"/>

            <!-- 纯正官方经典大眼：整组协调眨眼与闭眼，眼白绝不分离残留 -->
            <g class="eye-group">
              <circle class="eye" cx="5.55" cy="5.7" r="1.25" style="fill:var(--pw-eye,#2E2A24)"/>
              <circle class="pupil-highlight" cx="5.92" cy="5.35" r="0.42" style="fill:var(--pw-pupil,#FBF8F0)"/>
              <!-- 被抓/拖拽时的动漫勾勾眼（>_<） -->
              <g class="caught-eyes" style="display:none" fill="none" stroke="var(--pw-eye,#2E2A24)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.7 4.2 L5.7 5.7 L4.7 7.2"/>
                <path d="M7.9 4.2 L6.9 5.7 L7.9 7.2"/>
              </g>
            </g>

            <!-- 软萌自然腮红 -->
            <ellipse cx="6.6" cy="7.2" rx="0.75" ry="0.48" style="fill:var(--pw-blush,#F0A0A0)" opacity="0.5"/>

            <!-- 覆盖官方路径中的内部孔洞，避免出现第二只眼睛 -->
            <circle cx="12.44" cy="8.26" r="0.45" fill="url(#bodyGrad)"/>

            <!-- 尴尬黑线 -->
            <g class="angry" style="display:none" stroke="#2E2A24" stroke-width="0.3" stroke-linecap="round">
              <line x1="5.7" y1="2.6" x2="5.15" y2="1.0"/>
              <line x1="7.0" y1="2.9" x2="7.0" y2="0.9"/>
              <line x1="8.3" y1="2.6" x2="8.85" y2="1.0"/>
            </g>
            <!-- 星星 -->
            <g class="stars" style="display:none">
              <path class="starL" d="M2.9 2.1 L 3.25 2.85 L 4.05 2.95 L 3.5 3.5 L 3.62 4.3 L 2.9 3.92 L 2.18 4.3 L 2.3 3.5 L 1.75 2.95 L 2.55 2.85 Z" fill="#E8C56B" style="transform-origin: 2.9px 3.2px"/>
              <path class="starR" d="M9.9 1.4 L 10.25 2.15 L 11.05 2.25 L 10.5 2.8 L 10.62 3.6 L 9.9 3.22 L 9.18 3.6 L 9.3 2.8 L 8.75 2.25 L 9.55 2.15 Z" fill="#E8C56B" style="transform-origin: 9.9px 2.5px"/>
            </g>
          </g>

          <!-- ⌨️ 代码粒子 -->
          <g class="code-particle" style="display:none">
            <text x="0.8" y="13.0" font-size="1.6" style="fill:var(--pw-body,#4D6BFE)" font-weight="bold" font-family="monospace" class="code-fx1">&lt;/&gt;</text>
            <text x="3.2" y="12.4" font-size="1.4" fill="#4D88FF" font-weight="bold" font-family="monospace" class="code-fx2">{;}</text>
          </g>

          <!-- ⌨️ 机械小键盘 -->
          <g class="keyboard-unit" style="display:none">
            <ellipse cx="3.8" cy="16.7" rx="4.8" ry="1.2" fill="rgba(46,42,36,0.18)"/>
            <path d="M-0.6 14.6 L7.4 13.8 L8.8 16.4 L0.2 17.0 Z" fill="#2E2A24" stroke="#5F2E15" stroke-width="0.22" stroke-linejoin="round"/>
            <path d="M-0.4 14.5 L7.2 13.7 L8.5 16.1 L0.4 16.7 Z" fill="#484139"/>
            <g class="tap-k1">
              <rect x="0.2" y="14.2" width="0.95" height="0.65" rx="0.15" fill="#F7F2E6"/>
              <rect x="1.4" y="14.1" width="0.95" height="0.65" rx="0.15" fill="#F7F2E6"/>
              <rect x="2.6" y="14.0" width="0.95" height="0.65" rx="0.15" fill="#F7F2E6"/>
              <rect x="3.8" y="13.9" width="0.95" height="0.65" rx="0.15" fill="#F7F2E6"/>
              <rect x="5.0" y="13.8" width="0.95" height="0.65" rx="0.15" fill="#F7F2E6"/>
              <rect x="6.2" y="13.7" width="1.1" height="0.65" rx="0.15" style="fill:var(--pw-body-light,#8FB5FF)"/>
            </g>
            <g class="tap-k2">
              <rect x="0.5" y="15.0" width="1.0" height="0.7" rx="0.15" fill="#F7F2E6"/>
              <rect x="1.75" y="14.9" width="1.0" height="0.7" rx="0.15" fill="#E8D9BC"/>
              <rect x="3.0" y="14.8" width="1.0" height="0.7" rx="0.15" fill="#F7F2E6"/>
              <rect x="4.25" y="14.7" width="1.0" height="0.7" rx="0.15" fill="#F7F2E6"/>
              <rect x="5.5" y="14.6" width="1.0" height="0.7" rx="0.15" fill="#E8D9BC"/>
              <rect x="6.75" y="14.5" width="1.2" height="0.7" rx="0.15" style="fill:var(--pw-blush,#F0A0A0)"/>
            </g>
            <g class="tap-k1">
              <rect x="0.8" y="15.85" width="1.4" height="0.75" rx="0.18" style="fill:var(--pw-body-light,#8FB5FF)"/>
              <rect x="2.5" y="15.75" width="3.4" height="0.75" rx="0.18" fill="#FBF8F0"/>
              <rect x="6.2" y="15.6" width="1.8" height="0.75" rx="0.18" style="fill:var(--pw-body,#4D6BFE)"/>
            </g>
          </g>
        </svg>
        <span class="bubble"></span>
        <span class="bubble b2"></span>
        <span class="bubble b3"></span>
        <span class="bubble-blue"></span>
        <span class="bubble-blue bb2"></span>
        <span class="bubble-blue bb3"></span>`;
		//#endregion
		//#region src/client/styles.ts
		const WHALE_CSS = `
[data-dsh-whale] {
  --pw-ink: #2E2A24;
  --pw-body-light: #8FB5FF;
  --pw-body: #4D6BFE;
  --pw-body-dark: #3550C9;
  --pw-blush: #F0A0A0;
  --pw-eye: #2E2A24;
  --pw-pupil: #FBF8F0;
  position: fixed;
  z-index: 900;
  width: 137px;
  height: 101px;
  pointer-events: none;
  user-select: none;
  font-family: -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 隐藏模式：整只收起来，只留右下角小按钮 */
[data-dsh-whale].hidden { display: none !important; }

/* 右下角召回小按钮（挂在 body 上，独立于鲸鱼本体） */
[data-dsh-whale-mini] {
  position: fixed;
  right: 14px;
  bottom: 14px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.22);
  background: linear-gradient(160deg, #4D6BFE, #2E3F9E);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0,0,0,.28);
  z-index: 901;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition: transform .18s ease, box-shadow .18s ease;
}
[data-dsh-whale-mini]:hover {
  transform: translateY(-2px) scale(1.07);
  box-shadow: 0 10px 24px rgba(0,0,0,.36);
}
[data-dsh-whale-mini]:active { transform: scale(.94); }

/* 小按钮随 agent 状态变色呼吸：idle 蓝 / think 深蓝 / working 橙 / celebrate 绿 / error 红 */
[data-dsh-whale-mini] { animation: pw-mini-breathe 3.2s ease-in-out infinite; }
[data-dsh-whale-mini][data-state="think"] { background: linear-gradient(160deg, #6E8BFF, #3D55D6); animation: pw-mini-think 1.6s ease-in-out infinite; }
[data-dsh-whale-mini][data-state="working"] { background: linear-gradient(160deg, #F5A623, #C97B0B); animation: pw-mini-work 0.8s ease-in-out infinite; }
[data-dsh-whale-mini][data-state="celebrate"] { background: linear-gradient(160deg, #3BC46D, #1E8A4A); animation: pw-mini-celebrate 0.9s ease-in-out infinite; }
[data-dsh-whale-mini][data-state="error"] { background: linear-gradient(160deg, #E5484D, #A61B20); animation: pw-mini-error 0.5s ease-in-out infinite; }
[data-dsh-whale-mini].dragging { cursor: move; animation: none !important; transition: none; }

/* 思考内容滚动条：think 时悬在桌宠正上方，内容向左缓慢滚动 */
[data-dsh-whale-think] {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%, -100%);
  display: none;
  align-items: center;
  gap: 8px;
  width: auto;
  max-width: 360px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(30, 34, 46, .82);
  color: #CFE0FF;
  font: 12px/1.4 ui-monospace, Consolas, "Courier New", monospace;
  border: 1px solid rgba(139,160,255,.25);
  box-shadow: 0 6px 20px rgba(0,0,0,.25);
  pointer-events: none;
  z-index: 899;
  white-space: nowrap;
  overflow: hidden;
}
[data-dsh-whale-think].show { display: flex; }
[data-dsh-whale-think] .dsh-whale-think-label { flex: none; opacity: .85; }
[data-dsh-whale-think] .dsh-whale-think-scroll { flex: 1; overflow: hidden; }
[data-dsh-whale-think] .dsh-whale-think-text {
  display: inline-block;
  will-change: transform;
  max-width: none;
}

[data-dsh-whale] .pet-official {
  width: 137px;
  height: 101px;
  position: relative;
  cursor: grab;
  pointer-events: auto;
}
[data-dsh-whale] .pet-official:active { cursor: grabbing; }
[data-dsh-whale] .pet-official svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
  transform-origin: 50% 85%;
}

/* 地面阴影：独立兄弟元素，钉在地面，鲸鱼的任何动画（翻滚/跃起/深潜）都不带动它 */
[data-dsh-whale] .dsh-whale-shadow {
  position: absolute;
  left: 50%;
  bottom: -12px;
  width: 79px;
  height: 12px;
  margin-left: -40px;
  background: radial-gradient(ellipse, rgba(46,42,36,.24), transparent 65%);
  border-radius: 50%;
  animation: pw-shadowBob 3.2s ease-in-out infinite;
  pointer-events: none;
}

/* 泡泡（庆祝 + 点击） */
[data-dsh-whale] .bubble {
  position: absolute;
  left: 50%;
  bottom: 5px;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  border-radius: 50%;
  background: rgba(232,217,188,.9);
  border: 1px solid rgba(46,42,36,.15);
  opacity: 0;
  pointer-events: none;
}
[data-dsh-whale] .bubble::after {
  content: "";
  position: absolute;
  left: 1.4px;
  top: 1.4px;
  width: 2.2px;
  height: 2.2px;
  border-radius: 50%;
  background: rgba(255,255,255,.85);
}
[data-dsh-whale] .bubble.show { animation: pw-rise 0.9s ease-out forwards; }

/* 深潜蓝泡 */
[data-dsh-whale] .bubble-blue {
  position: absolute;
  left: 50%;
  bottom: 4.5px;
  width: 6px;
  height: 6px;
  margin-left: -3.2px;
  border-radius: 50%;
  background: rgba(168,200,232,.78);
  border: 1px solid rgba(96,138,190,.4);
  opacity: 0;
  pointer-events: none;
}
[data-dsh-whale] .bubble-blue::after {
  content: "";
  position: absolute;
  left: 1.4px;
  top: 1.4px;
  width: 1.8px;
  height: 1.8px;
  border-radius: 50%;
  background: rgba(255,255,255,.85);
}

/* ===== 状态动画 ===== */
[data-dsh-whale] .pet-official .body { animation: pw-qbob 3.2s ease-in-out infinite; }
[data-dsh-whale] .pet-official .eye-group { animation: pw-blink 4.5s ease-in-out infinite; transform-origin: 5.55px 5.7px; }

[data-dsh-whale] .pet-official.think { animation: pw-dive2 3.2s ease-in-out infinite; }
[data-dsh-whale] .pet-official.think .bubble-blue { animation: pw-riseBlue 3.2s ease-out infinite; }
[data-dsh-whale] .pet-official.think .bubble-blue.bb2 { animation-delay: 0.9s; }
[data-dsh-whale] .pet-official.think .bubble-blue.bb3 { animation-delay: 1.8s; }

[data-dsh-whale] .pet-official.working { animation: pw-swim 1.1s ease-in-out infinite; }
[data-dsh-whale] .pet-official.working .body { animation: none; }
[data-dsh-whale] .pet-official.working .keyboard-unit { display: block !important; }
[data-dsh-whale] .pet-official.working .code-particle { display: block !important; }

[data-dsh-whale] .pet-official.error { animation: pw-shake 0.5s ease-in-out infinite; }
[data-dsh-whale] .pet-official.error .angry { display: block; animation: pw-angryJitter 0.5s ease-in-out infinite; }

[data-dsh-whale] .pet-official.celebrate { animation: pw-leap2 1.4s ease-in-out infinite; }
[data-dsh-whale] .pet-official.celebrate .stars { display: block; }
[data-dsh-whale] .pet-official.celebrate .starL { animation: pw-starSpin 1.2s ease-in-out infinite; }
[data-dsh-whale] .pet-official.celebrate .starR { animation: pw-starSpin 1.2s ease-in-out 0.3s infinite; }
[data-dsh-whale] .pet-official.celebrate .bubble { animation: pw-rise 1.2s ease-out 0.3s infinite; }
[data-dsh-whale] .pet-official.celebrate .bubble.b2 { animation-delay: 0.7s; }
[data-dsh-whale] .pet-official.celebrate .bubble.b3 { animation-delay: 1.05s; }

/* 双击翻滚特技 */
[data-dsh-whale] .pet-official.rolling { animation: pw-rollTrick 0.65s cubic-bezier(0.34, 1.4, 0.64, 1) !important; }

/* 点击挤压回弹：作用在 SVG 上，不干扰位置 */
[data-dsh-whale] .pet-official.squish svg { animation: pw-squish 0.42s cubic-bezier(0.25, 1.4, 0.5, 1); }

/* 拖拽中：暂停状态动画 + 斜拉变形 */
[data-dsh-whale].dragging .pet-official {
  animation: none !important;
  transform: rotate(-5deg) scale(1.04, 0.96);
}
[data-dsh-whale].dragging .pet-official .body { animation: none !important; }

/* 被抓/拖拽：动漫勾勾眼（>_<），替换正常眼睛 */
[data-dsh-whale].dragging .eye-group .eye,
[data-dsh-whale].dragging .eye-group .pupil-highlight { opacity: 0; }
[data-dsh-whale].dragging .eye-group .caught-eyes { display: block !important; }

/* ===== 台词气泡 ===== */
[data-dsh-whale] .dsh-whale-dialog {
  position: absolute;
  top: -34px;
  left: 50%;
  transform: translateX(-50%);
  background: #FFFFFF;
  color: var(--pw-ink);
  border: 1px solid rgba(46,42,36,.15);
  border-radius: 12px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 4px 14px rgba(46,42,36,.08);
  pointer-events: none;
  opacity: 0;
  transform-origin: 50% 100%;
  transition: opacity .25s ease, transform .25s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 20;
}
[data-dsh-whale] .dsh-whale-dialog.show { opacity: 1; transform: translateX(-50%) scale(1); }
[data-dsh-whale] .dsh-whale-dialog::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  margin-left: -5px;
  border-width: 5px 5px 0;
  border-style: solid;
  border-color: #FFFFFF transparent transparent;
}

/* ===== 投喂小鱼干 ===== */
[data-dsh-whale] .dsh-whale-snack {
  position: absolute;
  top: -7px;
  left: 14px;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  z-index: 15;
}
[data-dsh-whale] .dsh-whale-snack.drop { animation: pw-dropSnack 0.7s ease-in forwards; }

/* ===== 打瞌睡 ===== */
[data-dsh-whale] .dsh-whale-zzz {
  position: absolute;
  left: 58%;
  top: 19px;
  font-size: 10px;
  font-weight: bold;
  color: #8F4427;
  opacity: 0;
  pointer-events: none;
}
[data-dsh-whale].sleeping .dsh-whale-zzz { animation: pw-zzzFloat 2.8s ease-in-out infinite; }
[data-dsh-whale].sleeping .pet-official .body { animation: pw-sleepBob 4s ease-in-out infinite !important; }
[data-dsh-whale].sleeping .pet-official .eye-group { transform: scaleY(0.08) !important; }
[data-dsh-whale].sleeping .pet-official .pupil-highlight { opacity: 0 !important; }

/* ===== 右键菜单 ===== */
[data-dsh-whale] .dsh-whale-menu {
  position: absolute;
  min-width: 132px;
  padding: 4px;
  border-radius: 10px;
  background: var(--dsw-hovercard-bg, #2C2C2E);
  color: var(--dsw-alias-text-1, #eee);
  box-shadow: var(--dsw-shadow-lv3, 0 8px 24px rgba(0,0,0,.25));
  pointer-events: auto;
  z-index: 30;
  display: none;
  font-size: 13px;
}
[data-dsh-whale] .dsh-whale-menu.open { display: block; }
[data-dsh-whale] .dsh-whale-menu button {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: inherit;
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 13px;
}
[data-dsh-whale] .dsh-whale-menu button:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.1)); }
[data-dsh-whale] .dsh-whale-menu .pw-swatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: -2px;
  border: 1px solid rgba(255,255,255,.35);
}

/* 悬停腮红加深 */
[data-dsh-whale] .pet-official:hover .eye-group {
  filter: drop-shadow(0 0 1px rgba(217, 142, 106, 0.8));
}

/* ===== keyframes（pw- 前缀） ===== */
@keyframes pw-qbob {
  0%,100% { transform: translateY(0) scale(1, 1); }
  22%     { transform: translateY(-7px) scale(.985, 1.035); }
  50%     { transform: translateY(2px) scale(1.02, .965); }
  72%     { transform: translateY(-3px) scale(.995, 1.012); }
}
@keyframes pw-dive2 {
  0%, 10%  { transform: translateY(0) rotate(0) scale(1, 1); opacity: 1; }
  24%      { transform: translateY(9px) rotate(-7deg) scale(1.03, .95); opacity: .78; }
  38%, 70% { transform: translateY(33px) rotate(3deg) scale(.95, 1.05); opacity: .42; }
  84%      { transform: translateY(6px) rotate(-5deg) scale(1.03, .96); opacity: .85; }
  94%,100% { transform: translateY(0) rotate(0) scale(1, 1); opacity: 1; }
}
@keyframes pw-leap2 {
  0%, 100%  { transform: translateY(0) rotate(0) scale(1, 1); }
  14%       { transform: translateY(-27px) rotate(-10deg) scale(.97, 1.06); }
  36%       { transform: translateY(2px) rotate(5deg) scale(1.09, .88); }
  52%       { transform: translateY(-13px) rotate(-4deg) scale(.98, 1.04); }
  72%       { transform: translateY(-3px) rotate(2deg) scale(1.03, .94); }
}
@keyframes pw-shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-3.5px); }
  50%      { transform: translateX(2.5px); }
  75%      { transform: translateX(-2px); }
}
@keyframes pw-swim {
  0%,100% { transform: translateX(-3.5px) translateY(0) rotate(-1.5deg); }
  50%     { transform: translateX(3.5px) translateY(-2px) rotate(1.5deg); }
}
@keyframes pw-blink {
  0%, 91%, 100% { transform: scaleY(1); }
  94%           { transform: scaleY(0.08); }
  97%           { transform: scaleY(1); }
}
@keyframes pw-rise {
  0%   { transform: translateY(0) scale(.6); opacity: 0; }
  20%  { opacity: .9; }
  100% { transform: translateY(-50px) scale(1.1); opacity: 0; }
}
@keyframes pw-riseBlue {
  0%   { transform: translate(5px, 22px) scale(.5); opacity: 0; }
  25%  { opacity: .85; }
  100% { transform: translate(-7px, -33px) scale(1.15); opacity: 0; }
}
@keyframes pw-squish {
  0%   { transform: scale(1, 1); }
  25%  { transform: scale(1.15, 0.82); }
  55%  { transform: scale(0.93, 1.09); }
  78%  { transform: scale(1.03, 0.98); }
  100% { transform: scale(1, 1); }
}
@keyframes pw-rollTrick {
  0%   { transform: translateY(0) rotate(0deg) scale(1, 1); }
  30%  { transform: translateY(-22px) rotate(-120deg) scale(1.08, 0.92); }
  70%  { transform: translateY(-14px) rotate(-260deg) scale(0.95, 1.05); }
  100% { transform: translateY(0) rotate(-360deg) scale(1, 1); }
}
@keyframes pw-shadowBob {
  0%,100% { transform: scale(1); opacity: .9; }
  50%     { transform: scale(.78); opacity: .5; }
}
@keyframes pw-keyTap1 {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(0.4px); }
}
@keyframes pw-keyTap2 {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(0.4px); }
}
[data-dsh-whale] .tap-k1 { animation: pw-keyTap1 0.16s ease-in-out infinite alternate; }
[data-dsh-whale] .tap-k2 { animation: pw-keyTap2 0.18s ease-in-out 0.08s infinite alternate; }
@keyframes pw-codeFloat1 {
  0%   { transform: translateY(0) scale(0.5); opacity: 0; }
  30%  { opacity: 0.95; }
  100% { transform: translateY(-16px) translateX(-5px) scale(1); opacity: 0; }
}
@keyframes pw-codeFloat2 {
  0%   { transform: translateY(0) scale(0.5); opacity: 0; }
  30%  { opacity: 0.95; }
  100% { transform: translateY(-17px) translateX(4px) scale(1.05); opacity: 0; }
}
[data-dsh-whale] .code-fx1 { animation: pw-codeFloat1 1.2s ease-out infinite; }
[data-dsh-whale] .code-fx2 { animation: pw-codeFloat2 1.2s ease-out 0.6s infinite; }
@keyframes pw-starSpin {
  0%,100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50%     { transform: scale(1.3) rotate(22deg); opacity: .65; }
}
@keyframes pw-angryJitter {
  0%,100% { transform: translateX(0); }
  50%     { transform: translateX(-1.2px); }
}
@keyframes pw-sleepBob {
  0%,100% { transform: translateY(0) scale(1, 1); }
  50%     { transform: translateY(3px) scale(1.02, 0.97); }
}
@keyframes pw-zzzFloat {
  0%   { transform: translate(0, 0) scale(0.6); opacity: 0; }
  30%  { opacity: 0.9; }
  100% { transform: translate(10px, -17px) scale(1.15); opacity: 0; }
}
@keyframes pw-dropSnack {
  0%   { transform: translateY(0) rotate(0); opacity: 1; }
  80%  { transform: translateY(79px) rotate(45deg); opacity: 1; }
  100% { transform: translateY(90px) scale(0.5); opacity: 0; }
}

@keyframes pw-mini-breathe {
  0%,100% { box-shadow: 0 8px 20px rgba(0,0,0,.28); }
  50%     { box-shadow: 0 8px 24px rgba(77,107,254,.55); }
}
@keyframes pw-mini-think {
  0%,100% { box-shadow: 0 8px 20px rgba(61,85,214,.35); }
  50%     { box-shadow: 0 8px 26px rgba(110,139,255,.75); }
}
@keyframes pw-mini-work {
  0%,100% { opacity: 1; }
  50%     { opacity: .62; }
}
@keyframes pw-mini-celebrate {
  0%,100% { box-shadow: 0 8px 20px rgba(27,138,74,.35); }
  50%     { box-shadow: 0 10px 28px rgba(59,196,109,.85); }
}
@keyframes pw-mini-error {
  0%,100% { box-shadow: 0 8px 20px rgba(166,27,32,.35); }
  50%     { box-shadow: 0 8px 26px rgba(229,72,77,.85); }
}

/* 后台省电：页面不可见时暂停一切动画 */
[data-dsh-whale].paused,
[data-dsh-whale].paused * { animation-play-state: paused !important; transition: none !important; }
[data-dsh-whale-mini].paused { animation: none !important; }

/* 主题联动：DSH 暗色主题下的 UI 皮肤 */
[data-dsh-whale][data-theme="dark"] .dsh-whale-dialog {
  background: #2C2C2E;
  color: #F2F2F0;
  border-color: rgba(255,255,255,.12);
}
[data-dsh-whale][data-theme="dark"] .dsh-whale-dialog::after {
  border-color: #2C2C2E transparent transparent;
}
[data-dsh-whale][data-theme="dark"] .dsh-whale-shadow {
  background: radial-gradient(ellipse, rgba(0,0,0,.5), transparent 65%);
}

/* 减少动态效果：全关动画 */
@media (prefers-reduced-motion: reduce) {
  [data-dsh-whale] *,
  [data-dsh-whale] { animation: none !important; transition: none !important; }
}
`;
		//#endregion
		//#region src/client/sounds.ts
		const MUTE_KEY = "pet-whale:muted";
		var WhaleSounds = class {
			ctx = null;
			muted;
			constructor() {
				let muted = false;
				try {
					muted = localStorage.getItem(MUTE_KEY) === "1";
				} catch {}
				this.muted = muted;
			}
			get isMuted() {
				return this.muted;
			}
			setMuted(muted) {
				this.muted = muted;
				try {
					localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
				} catch {}
			}
			/** 浏览器自动播放策略：AudioContext 需在用户手势后 resume，挂一次全局 pointerdown 解锁。 */
			installGestureUnlock() {
				const unlock = () => {
					const ctx = this.acquire();
					if (ctx !== null && ctx.state === "suspended") ctx.resume();
				};
				document.addEventListener("pointerdown", unlock, {
					capture: true,
					passive: true
				});
			}
			acquire() {
				if (this.ctx === null) {
					const Ctor = window.AudioContext ?? window.webkitAudioContext;
					if (Ctor === void 0) return null;
					this.ctx = new Ctor();
				}
				if (this.ctx.state === "suspended") this.ctx.resume();
				return this.ctx;
			}
			play(type) {
				if (this.muted) return;
				try {
					const ctx = this.acquire();
					if (ctx === null) return;
					const now = ctx.currentTime;
					if (type === "bubble") {
						const osc = ctx.createOscillator();
						const gain = ctx.createGain();
						osc.type = "sine";
						osc.frequency.setValueAtTime(420, now);
						osc.frequency.exponentialRampToValueAtTime(840, now + .12);
						gain.gain.setValueAtTime(.3, now);
						gain.gain.exponentialRampToValueAtTime(.01, now + .14);
						osc.connect(gain);
						gain.connect(ctx.destination);
						osc.start(now);
						osc.stop(now + .15);
					} else if (type === "work") {
						const osc = ctx.createOscillator();
						const gain = ctx.createGain();
						osc.type = "triangle";
						osc.frequency.setValueAtTime(720, now);
						gain.gain.setValueAtTime(.18, now);
						gain.gain.exponentialRampToValueAtTime(.01, now + .06);
						osc.connect(gain);
						gain.connect(ctx.destination);
						osc.start(now);
						osc.stop(now + .07);
					} else if (type === "celebrate") [
						523.25,
						659.25,
						783.99,
						1046.5
					].forEach((freq, i) => {
						const osc = ctx.createOscillator();
						const gain = ctx.createGain();
						osc.type = "sine";
						osc.frequency.setValueAtTime(freq, now + i * .08);
						gain.gain.setValueAtTime(.2, now + i * .08);
						gain.gain.exponentialRampToValueAtTime(.01, now + i * .08 + .22);
						osc.connect(gain);
						gain.connect(ctx.destination);
						osc.start(now + i * .08);
						osc.stop(now + i * .08 + .23);
					});
					else if (type === "error") {
						const osc = ctx.createOscillator();
						const gain = ctx.createGain();
						osc.type = "sawtooth";
						osc.frequency.setValueAtTime(320, now);
						osc.frequency.exponentialRampToValueAtTime(140, now + .25);
						gain.gain.setValueAtTime(.15, now);
						gain.gain.exponentialRampToValueAtTime(.01, now + .26);
						osc.connect(gain);
						gain.connect(ctx.destination);
						osc.start(now);
						osc.stop(now + .27);
					} else if (type === "snack") {
						const osc = ctx.createOscillator();
						const gain = ctx.createGain();
						osc.type = "sine";
						osc.frequency.setValueAtTime(880, now);
						osc.frequency.exponentialRampToValueAtTime(580, now + .1);
						gain.gain.setValueAtTime(.25, now);
						gain.gain.exponentialRampToValueAtTime(.01, now + .12);
						osc.connect(gain);
						gain.connect(ctx.destination);
						osc.start(now);
						osc.stop(now + .13);
					} else if (type === "trick") {
						const osc = ctx.createOscillator();
						const gain = ctx.createGain();
						osc.type = "sine";
						osc.frequency.setValueAtTime(350, now);
						osc.frequency.exponentialRampToValueAtTime(1050, now + .35);
						gain.gain.setValueAtTime(.28, now);
						gain.gain.exponentialRampToValueAtTime(.01, now + .4);
						osc.connect(gain);
						gain.connect(ctx.destination);
						osc.start(now);
						osc.stop(now + .42);
					}
				} catch {}
			}
		};
		//#endregion
		//#region src/client/state.ts
		const ERROR_MS = 4e3;
		const CELEBRATE_MS = 2500;
		/** working 粘滞时长：工具调用结束后继续保持"敲代码"的时间 */
		const WORK_STICKY_MS = 2500;
		/** 快照 → 持续状态。 */
		function deriveContinuous(snap, stickyUntil, now) {
			if (!snap.running) return "idle";
			if (snap.runningCalls.length > 0) return "working";
			if (stickyUntil !== null && now < stickyUntil) return "working";
			return "think";
		}
		/** 状态驱动：吃快照序列，吐状态序列。 */
		var WhaleDriver = class {
			prevRunning = null;
			prevTurnEnds = 0;
			prevError = null;
			transient = null;
			stickyUntil = null;
			current = "idle";
			/** 首帧初始化基线（不触发任何瞬态）。 */
			prime(snap) {
				this.prevRunning = snap.running;
				this.prevTurnEnds = snap.turnEnds.size;
				this.prevError = errorKey(snap);
				this.stickyUntil = null;
				this.current = deriveContinuous(snap, this.stickyUntil, 0);
			}
			step(snap, now) {
				if (this.prevRunning === null) {
					this.prime(snap);
					return {
						state: this.current,
						changed: false
					};
				}
				const err = errorKey(snap);
				if (err !== null && err !== this.prevError) this.transient = {
					state: "error",
					until: now + ERROR_MS
				};
				this.prevError = err;
				if (this.prevRunning === true && snap.running === false) {
					const turns = snap.turnEnds.size;
					if (turns > this.prevTurnEnds && err === null) this.transient = {
						state: "celebrate",
						until: now + CELEBRATE_MS
					};
					this.prevTurnEnds = turns;
				}
				this.prevRunning = snap.running;
				if (snap.running && snap.runningCalls.length > 0) this.stickyUntil = now + WORK_STICKY_MS;
				if (!snap.running) this.stickyUntil = null;
				let next;
				if (this.transient !== null) if (now < this.transient.until) next = this.transient.state;
				else {
					this.transient = null;
					next = deriveContinuous(snap, this.stickyUntil, now);
				}
				else next = deriveContinuous(snap, this.stickyUntil, now);
				const changed = next !== this.current;
				this.current = next;
				return {
					state: next,
					changed
				};
			}
			get state() {
				return this.current;
			}
		};
		function errorKey(snap) {
			if (snap.lastAgentError !== null) return snap.lastAgentError;
			if (snap.openError !== null) return "open-error";
			return null;
		}
		//#endregion
		//#region src/client/palettes.ts
		const PALETTES = [
			{
				id: "terracotta",
				name: "陶土",
				light: "#BC6238",
				main: "#A3502C",
				dark: "#88431F",
				blush: "#D98E6A"
			},
			{
				id: "ocean",
				name: "深海蓝",
				light: "#7FA8DC",
				main: "#4A7FBE",
				dark: "#2E5A8C",
				blush: "#E8A2B0"
			},
			{
				id: "matcha",
				name: "抹茶绿",
				light: "#A8CC8F",
				main: "#6F9E5E",
				dark: "#43683A",
				blush: "#E8B08A"
			},
			{
				id: "sakura",
				name: "樱粉",
				light: "#F2A7C0",
				main: "#E0779B",
				dark: "#B04E72",
				blush: "#F5B9CD"
			},
			{
				id: "ink",
				name: "墨灰",
				light: "#B8B8B8",
				main: "#787878",
				dark: "#4C4C4C",
				blush: "#C89B9B"
			},
			{
				id: "night",
				name: "夜黑",
				light: "#4A4A4A",
				main: "#262626",
				dark: "#121212",
				blush: "#7A5C5C",
				eye: "#F7F2E6",
				pupil: "#2E2A24"
			},
			{
				id: "theme-blue",
				name: "主题蓝",
				light: "#8FB5FF",
				main: "#4D6BFE",
				dark: "#3550C9",
				blush: "#F0A0A0"
			}
		];
		const DEFAULT_PALETTE = PALETTES.find((p) => p.id === "theme-blue") ?? PALETTES[0];
		const PALETTE_KEY = "pet-whale:palette";
		function loadPaletteId() {
			try {
				const raw = localStorage.getItem(PALETTE_KEY);
				if (raw !== null && PALETTES.some((p) => p.id === raw)) return raw;
			} catch {}
			return DEFAULT_PALETTE.id;
		}
		function savePaletteId(id) {
			try {
				localStorage.setItem(PALETTE_KEY, id);
			} catch {}
		}
		function paletteOf(id) {
			return PALETTES.find((p) => p.id === id) ?? DEFAULT_PALETTE;
		}
		/** 把色板写到根元素 CSS 变量上（SVG 里的 fill/stop-color 引这些变量）。 */
		function applyPalette(root, palette) {
			root.style.setProperty("--pw-body-light", palette.light);
			root.style.setProperty("--pw-body", palette.main);
			root.style.setProperty("--pw-body-dark", palette.dark);
			root.style.setProperty("--pw-blush", palette.blush);
			root.style.setProperty("--pw-eye", palette.eye ?? "#2E2A24");
			root.style.setProperty("--pw-pupil", palette.pupil ?? "#FBF8F0");
		}
		//#endregion
		//#region src/client/index.ts
		const inject = ["sessions"];
		const STATES = [
			"idle",
			"think",
			"working",
			"celebrate",
			"error"
		];
		const POS_KEY = "pet-whale:pos";
		/** 隐藏状态：'1' 表示隐藏到右下角小按钮 */
		const HIDDEN_KEY = "pet-whale:hidden";
		const PRETEND_KEY = "pet-whale:pretend";
		const THINK_TICKER_KEY = "pet-whale:think-ticker";
		const MINI_POS_KEY = "pet-whale:mini-pos";
		const AUTO_HIDE_KEY = "pet-whale:auto-hide";
		const AUTO_HIDE_CHECK_MS = 3e4;
		/** 智能避让：只有 idle 且光标在身侧停留这么久才让开 */
		const AVOID_DWELL_MS = 900;
		const AVOID_MARGIN = 48;
		const AVOID_STEP = 120;
		/** 抓取/右键后 8 秒内不再避让，保证“想抓就能抓住” */
		const AVOID_COOLDOWN_MS = 8e3;
		const SLEEP_MS = 2e4;
		const DIALOG_MS = 2600;
		/** 自动音效最小间隔（防 think/working 抖动连响） */
		const SOUND_GAP_MS = 1200;
		const statusDialogs = {
			idle: [
				"小鲸鱼待命中~ 点击我可以戳戳哦 🐳",
				"今天有什么新的代码任务呢？✨",
				"摇摇尾巴，随时准备出发！"
			],
			think: [
				"正在深潜检索知识库... 🌊",
				"认真思考架构逻辑中...",
				"咕噜噜... 正在探索深海答案"
			],
			working: [
				"认真敲代码中！⚡",
				"噼里啪啦码字中，很快就好~ ⌨️",
				"正在调用 Agent 工具执行任务！"
			],
			celebrate: [
				"太棒啦！任务圆满搞定~ 🎉",
				"代码测试全绿，完美交付！✨",
				"冒泡庆祝中，请主人查收~"
			],
			error: [
				"哎呀出错了，正在发抖求救 🥺",
				"捕获到一个异常，正在尝试自愈...",
				"呜呜呜，遇到阻碍了 >_<"
			]
		};
		const pokeDialogs = [
			"咕噜咕噜~ 戳到软软的肚皮啦！",
			"好痒呀~ 哈哈哈 (≧▽≦)",
			"鲸鱼活力 +10！继续加油~",
			"小尾巴拍拍水，心情超棒 ✨"
		];
		const pick = (list) => list[Math.floor(Math.random() * list.length)];
		function apply(ctx) {
			if (typeof document === "undefined") return () => {};
			document.querySelectorAll("[data-dsh-whale]").forEach((el) => el.remove());
			document.getElementById("pet-whale-style")?.remove();
			const style = document.createElement("style");
			style.id = "pet-whale-style";
			style.textContent = WHALE_CSS;
			document.head.appendChild(style);
			const root = document.createElement("div");
			root.setAttribute("data-dsh-whale", "");
			root.innerHTML = `
    <span class="dsh-whale-shadow"></span>
    <div class="dsh-whale-dialog"></div>
    <span class="dsh-whale-snack">🐟</span>
    <span class="dsh-whale-zzz">Zzz...</span>
    <div class="pet-official idle" role="img" aria-label="桌宠小鲸鱼">${WHALE_HTML}</div>
    <div class="dsh-whale-menu" role="menu"></div>
  `;
			const dialog = root.querySelector(".dsh-whale-dialog");
			const snack = root.querySelector(".dsh-whale-snack");
			const pet = root.querySelector(".pet-official");
			const menu = root.querySelector(".dsh-whale-menu");
			const pupil = pet.querySelector(".pupil-highlight");
			const PET_W = 137;
			const PET_H = 101;
			const clampPos = (x, y) => {
				const maxX = Math.max(0, window.innerWidth - PET_W);
				const maxY = Math.max(0, window.innerHeight - PET_H);
				return {
					x: Math.min(Math.max(0, x), maxX),
					y: Math.min(Math.max(0, y), maxY)
				};
			};
			const loadPos = () => {
				try {
					const raw = localStorage.getItem(POS_KEY);
					if (raw !== null) {
						const parsed = JSON.parse(raw);
						if (typeof parsed.x === "number" && typeof parsed.y === "number") return clampPos(parsed.x, parsed.y);
					}
				} catch {}
				return clampPos(window.innerWidth - PET_W - 16, window.innerHeight - PET_H - 96);
			};
			const place = () => {
				const { x, y } = clampPos(parseFloat(root.style.left) || 0, parseFloat(root.style.top) || 0);
				root.style.left = `${x}px`;
				root.style.top = `${y}px`;
				return {
					x,
					y
				};
			};
			const pos = loadPos();
			root.style.left = `${pos.x}px`;
			root.style.top = `${pos.y}px`;
			document.body.appendChild(root);
			applyPalette(root, paletteOf(loadPaletteId()));
			const readTheme = () => {
				const scheme = document.documentElement.style.colorScheme;
				if (scheme === "dark" || scheme === "light") return scheme;
				return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			};
			const applyTheme = () => {
				root.dataset.theme = readTheme();
			};
			const themeObserver = new MutationObserver(applyTheme);
			themeObserver.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["style"]
			});
			applyTheme();
			const savePos = () => {
				try {
					localStorage.setItem(POS_KEY, JSON.stringify(place()));
				} catch {}
			};
			const onResize = () => place();
			let dialogTimer;
			const showDialog = (text) => {
				if (root.classList.contains("hidden")) return;
				dialog.textContent = text;
				dialog.classList.add("show");
				window.clearTimeout(dialogTimer);
				dialogTimer = window.setTimeout(() => dialog.classList.remove("show"), DIALOG_MS);
			};
			const sounds = new WhaleSounds();
			sounds.installGestureUnlock();
			let lastAutoSound = 0;
			const autoSound = (state) => {
				if (root.classList.contains("hidden") || document.hidden) return;
				const now = performance.now();
				if (now - lastAutoSound < SOUND_GAP_MS) return;
				lastAutoSound = now;
				if (state === "think") sounds.play("bubble");
				else if (state === "working") sounds.play("work");
				else if (state === "celebrate") sounds.play("celebrate");
				else if (state === "error") sounds.play("error");
			};
			let visualState = "idle";
			let pretendOn = false;
			try {
				pretendOn = localStorage.getItem(PRETEND_KEY) === "1";
			} catch {}
			let tickerOn = true;
			try {
				tickerOn = localStorage.getItem(THINK_TICKER_KEY) !== "0";
			} catch {}
			let lastErrorText = "";
			const setState = (next, changed) => {
				const effective = pretendOn ? "working" : next;
				if (effective !== "idle") wake();
				for (const s of STATES) pet.classList.toggle(s, s === effective);
				visualState = effective;
				syncMiniState(effective);
				if (effective === "idle") scheduleIdleMicro();
				else clearIdleMicro();
				if (changed) {
					showDialog(pick(statusDialogs[effective]));
					autoSound(effective);
				}
			};
			const popBubble = () => {
				const bubbles = pet.querySelectorAll(".bubble");
				if (bubbles.length === 0) return;
				const b = bubbles[Math.floor(Math.random() * bubbles.length)];
				b.classList.remove("show");
				b.offsetWidth;
				b.classList.add("show");
				window.setTimeout(() => b.classList.remove("show"), 950);
			};
			const triggerSquish = () => {
				markActive();
				popBubble();
				sounds.play("bubble");
				pet.classList.remove("squish");
				pet.offsetWidth;
				pet.classList.add("squish");
				window.setTimeout(() => pet.classList.remove("squish"), 450);
				showDialog(pick(pokeDialogs));
			};
			const triggerRoll = () => {
				markActive();
				sounds.play("trick");
				showDialog("翻个 360° 跟头给你看！(≧∇≦)ﾉ ✨");
				pet.classList.remove("rolling");
				pet.offsetWidth;
				pet.classList.add("rolling");
				popBubble();
				window.setTimeout(() => popBubble(), 200);
				window.setTimeout(() => pet.classList.remove("rolling"), 700);
			};
			const HIDDEN_CLASS = "hidden";
			const MINI_SIZE = 46;
			let mini = null;
			let quitWhale = () => {};
			const syncMiniState = (state) => {
				if (mini === null) return;
				mini.dataset.state = state;
				mini.title = `桌宠小鲸鱼（${state}）· 点我召回，可拖拽移动`;
			};
			const miniClamp = (right, bottom) => {
				const maxRight = Math.max(0, window.innerWidth - MINI_SIZE);
				const maxBottom = Math.max(0, window.innerHeight - MINI_SIZE);
				return {
					right: Math.min(Math.max(0, right), maxRight),
					bottom: Math.min(Math.max(0, bottom), maxBottom)
				};
			};
			const loadMiniPos = () => {
				try {
					const raw = localStorage.getItem(MINI_POS_KEY);
					if (raw !== null) {
						const parsed = JSON.parse(raw);
						if (typeof parsed.right === "number" && typeof parsed.bottom === "number") return miniClamp(parsed.right, parsed.bottom);
					}
				} catch {}
				return {
					right: 14,
					bottom: 14
				};
			};
			const saveMiniPos = () => {
				if (mini === null) return;
				try {
					localStorage.setItem(MINI_POS_KEY, JSON.stringify({
						right: parseFloat(mini.style.right) || 0,
						bottom: parseFloat(mini.style.bottom) || 0
					}));
				} catch {}
			};
			let miniDrag = null;
			let miniDragging = false;
			let miniSuppressClick = false;
			const onMiniPointerDown = (e) => {
				if (e.button !== 0 || mini === null) return;
				miniDrag = {
					x: e.clientX,
					y: e.clientY,
					right: parseFloat(mini.style.right) || 0,
					bottom: parseFloat(mini.style.bottom) || 0
				};
				mini.setPointerCapture(e.pointerId);
			};
			const onMiniPointerMove = (e) => {
				if (miniDrag === null || mini === null) return;
				const dx = e.clientX - miniDrag.x;
				const dy = e.clientY - miniDrag.y;
				if (!miniDragging && Math.abs(dx) + Math.abs(dy) > 4) {
					miniDragging = true;
					miniSuppressClick = true;
					mini.classList.add("dragging");
				}
				if (miniDragging) {
					const p = miniClamp(miniDrag.right - dx, miniDrag.bottom - dy);
					mini.style.right = `${p.right}px`;
					mini.style.bottom = `${p.bottom}px`;
				}
			};
			const onMiniDragEnd = () => {
				if (miniDrag === null) return;
				miniDrag = null;
				if (miniDragging) {
					miniDragging = false;
					mini?.classList.remove("dragging");
					saveMiniPos();
				}
				window.setTimeout(() => {
					miniSuppressClick = false;
				}, 0);
			};
			const removeMini = () => {
				mini?.remove();
				mini = null;
			};
			const createMini = () => {
				if (mini !== null) return;
				mini = document.createElement("button");
				mini.type = "button";
				mini.setAttribute("data-dsh-whale-mini", "");
				mini.setAttribute("aria-label", "显示桌宠小鲸鱼");
				mini.textContent = "🐳";
				const pos = loadMiniPos();
				mini.style.right = `${pos.right}px`;
				mini.style.bottom = `${pos.bottom}px`;
				syncMiniState(visualState);
				mini.addEventListener("click", () => {
					if (miniSuppressClick) return;
					showWhale();
				});
				mini.addEventListener("pointerdown", onMiniPointerDown);
				mini.addEventListener("pointermove", onMiniPointerMove);
				mini.addEventListener("pointerup", onMiniDragEnd);
				mini.addEventListener("pointercancel", onMiniDragEnd);
				document.body.appendChild(mini);
			};
			const showWhale = () => {
				removeMini();
				root.classList.remove(HIDDEN_CLASS);
				try {
					localStorage.removeItem(HIDDEN_KEY);
				} catch {}
				place();
				triggerSquish();
				showDialog("回来啦！想我了没~ 🐳");
			};
			const hideWhale = () => {
				root.classList.add(HIDDEN_CLASS);
				try {
					localStorage.setItem(HIDDEN_KEY, "1");
				} catch {}
				createMini();
			};
			const readAutoHide = () => {
				try {
					const raw = localStorage.getItem(AUTO_HIDE_KEY);
					if (raw === null) return null;
					const parsed = JSON.parse(raw);
					if (typeof parsed.at === "number" && typeof parsed.daily === "boolean") return parsed;
				} catch {}
				return null;
			};
			const saveAutoHide = (plan) => {
				try {
					localStorage.setItem(AUTO_HIDE_KEY, JSON.stringify(plan));
				} catch {}
			};
			const clearAutoHide = () => {
				try {
					localStorage.removeItem(AUTO_HIDE_KEY);
				} catch {}
			};
			const nextDailyAt = (hh, mm) => {
				const d = /* @__PURE__ */ new Date();
				d.setHours(hh, mm, 0, 0);
				if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
				return d.getTime();
			};
			const scheduleOnce = (ms) => {
				saveAutoHide({
					at: Date.now() + ms,
					daily: false,
					hh: 0,
					mm: 0
				});
			};
			const scheduleDaily = (hh, mm) => {
				saveAutoHide({
					at: nextDailyAt(hh, mm),
					daily: true,
					hh,
					mm
				});
			};
			const checkAutoHide = () => {
				const plan = readAutoHide();
				if (plan === null) return;
				if (Date.now() < plan.at) return;
				if (plan.daily) scheduleDaily(plan.hh, plan.mm);
				else clearAutoHide();
				if (!root.classList.contains(HIDDEN_CLASS)) hideWhale();
			};
			let autoHideTimer;
			const startAutoHide = () => {
				checkAutoHide();
				autoHideTimer = window.setInterval(checkAutoHide, AUTO_HIDE_CHECK_MS);
			};
			const THINK_TICKER_WIDTH = 360;
			const ticker = document.createElement("div");
			ticker.setAttribute("data-dsh-whale-think", "");
			ticker.innerHTML = "<span class=\"dsh-whale-think-label\">🧠</span><div class=\"dsh-whale-think-scroll\"><span class=\"dsh-whale-think-text\"></span></div>";
			root.appendChild(ticker);
			const tickerText = ticker.querySelector(".dsh-whale-think-text");
			let tickerOffset = 0;
			let tickerRaf = 0;
			const hideTicker = () => {
				ticker.classList.remove("show");
				if (tickerRaf !== 0) {
					window.cancelAnimationFrame(tickerRaf);
					tickerRaf = 0;
				}
			};
			const tickerTick = () => {
				const max = Math.max(0, tickerText.scrollWidth - ticker.clientWidth);
				tickerOffset += .5;
				if (tickerOffset > max + 40) tickerOffset = 0;
				tickerText.style.transform = `translateX(-${tickerOffset}px)`;
				if (ticker.classList.contains("show")) tickerRaf = window.requestAnimationFrame(tickerTick);
				else tickerRaf = 0;
			};
			const positionTicker = () => {
				const rect = root.getBoundingClientRect();
				const width = Math.min(THINK_TICKER_WIDTH, window.innerWidth - 24);
				const centerX = rect.left + rect.width / 2;
				const left = Math.min(Math.max(centerX, width / 2 + 12), window.innerWidth - width / 2 - 12);
				ticker.style.width = `${width}px`;
				ticker.style.left = `${left}px`;
				ticker.style.top = `${rect.top - 40}px`;
			};
			const updateTicker = (text) => {
				if (text.trim() === "") {
					hideTicker();
					return;
				}
				tickerText.textContent = text.slice(-200);
				tickerOffset = 0;
				positionTicker();
				ticker.classList.add("show");
				if (tickerRaf === 0) tickerRaf = window.requestAnimationFrame(tickerTick);
			};
			const partialTextOf = (partial) => {
				if (partial === null || typeof partial !== "object") return "";
				const blocks = partial.blocks;
				if (!Array.isArray(blocks)) return "";
				const parts = [];
				for (const block of blocks) {
					if (block === null || typeof block !== "object") continue;
					const b = block;
					if ((b.kind === "text" || b.kind === "reasoning") && typeof b.text === "string") parts.push(b.text);
				}
				return parts.join(" ");
			};
			const onVisibility = () => {
				document.hidden;
				root.classList.toggle("paused", document.hidden);
				mini?.classList.toggle("paused", document.hidden);
				if (document.hidden) hideTicker();
			};
			document.addEventListener("visibilitychange", onVisibility);
			onVisibility();
			const buildMenu = (mode = "main") => {
				menu.textContent = "";
				if (mode === "palette") {
					for (const p of PALETTES) {
						const btn = document.createElement("button");
						btn.type = "button";
						const dot = document.createElement("span");
						dot.className = "pw-swatch";
						dot.style.background = `linear-gradient(135deg, ${p.light}, ${p.main}, ${p.dark})`;
						btn.appendChild(dot);
						btn.appendChild(document.createTextNode(p.name));
						btn.addEventListener("click", () => {
							closeMenu();
							applyPalette(root, p);
							savePaletteId(p.id);
							showDialog(`换上新皮肤「${p.name}」~ 🎨`);
							sounds.play("bubble");
						});
						menu.appendChild(btn);
					}
					const back = document.createElement("button");
					back.type = "button";
					back.textContent = "← 返回";
					back.addEventListener("click", () => {
						buildMenu("main");
						positionMenu(lastMenuPos.x, lastMenuPos.y);
					});
					menu.appendChild(back);
					return;
				}
				if (mode === "schedule") {
					const scheduleItems = [
						["🕐 1 小时后隐藏", () => {
							scheduleOnce(36e5);
							showDialog("好~ 1 小时后我会自己藏到右下角 🐳");
						}],
						["🌙 每晚 22:00 隐藏", () => {
							scheduleDaily(22, 0);
							showDialog("记下啦：每天 22:00 自动藏到右下角 🌙");
						}],
						["🚫 取消定时隐藏", () => {
							clearAutoHide();
							showDialog("定时隐藏已取消~");
						}]
					];
					for (const [label, action] of scheduleItems) {
						const btn = document.createElement("button");
						btn.type = "button";
						btn.textContent = label;
						btn.addEventListener("click", () => {
							closeMenu();
							action();
						});
						menu.appendChild(btn);
					}
					const back = document.createElement("button");
					back.type = "button";
					back.textContent = "← 返回";
					back.addEventListener("click", () => {
						buildMenu("main");
						positionMenu(lastMenuPos.x, lastMenuPos.y);
					});
					menu.appendChild(back);
					return;
				}
				const items = [
					["🐟 投喂小鱼干", () => {
						snack.classList.remove("drop");
						snack.offsetWidth;
						snack.classList.add("drop");
						sounds.play("snack");
						showDialog("嚼嚼嚼... 获得小鱼干能量！美味~ 🐟");
						window.setTimeout(() => {
							triggerSquish();
							sounds.play("celebrate");
						}, 600);
					}],
					["✨ 摸摸头", () => {
						triggerSquish();
						showDialog("被摸摸头啦~ 暖洋洋的超开心 🥰");
					}],
					["🎨 换颜色 ▸", () => {
						buildMenu("palette");
						menu.classList.add("open");
						positionMenu(lastMenuPos.x, lastMenuPos.y);
					}],
					[pretendOn ? "💼 假装工作: 开" : "💼 假装工作: 关", () => {
						pretendOn = !pretendOn;
						try {
							localStorage.setItem(PRETEND_KEY, pretendOn ? "1" : "0");
						} catch {}
						updateTicker("");
						setState(pretendOn ? "working" : "idle", true);
						showDialog(pretendOn ? "进入假装工作模式，开始表演敲代码 ⌨️💼" : "下班！恢复真实状态~");
					}],
					[tickerOn ? "🧠 思考链: 开" : "🧠 思考链: 关", () => {
						tickerOn = !tickerOn;
						try {
							localStorage.setItem(THINK_TICKER_KEY, tickerOn ? "1" : "0");
						} catch {}
						updateTicker("");
						showDialog(tickerOn ? "思考链已开启：思考时会在我头顶滚动 🧠" : "思考链已关闭~");
					}],
					["🙈 隐藏到右下角", () => {
						hideWhale();
					}],
					["🕐 定时隐藏 ▸", () => {
						buildMenu("schedule");
						menu.classList.add("open");
						positionMenu(lastMenuPos.x, lastMenuPos.y);
					}],
					["⏹ 关闭桌宠", () => {
						quitWhale();
					}],
					...lastErrorText !== "" ? [["📋 复制错误信息", () => {
						try {
							navigator.clipboard?.writeText(lastErrorText);
						} catch {}
						showDialog("错误信息已复制到剪贴板 📋");
					}]] : [],
					[sounds.isMuted ? "🔇 音效: 关" : "🔊 音效: 开", () => {
						const next = !sounds.isMuted;
						sounds.setMuted(next);
						buildMenu();
						if (next) sounds.play("bubble");
					}]
				];
				for (const [label, action] of items) {
					const btn = document.createElement("button");
					btn.type = "button";
					btn.textContent = label;
					btn.addEventListener("click", () => {
						closeMenu();
						action();
					});
					menu.appendChild(btn);
				}
			};
			let lastMenuPos = {
				x: 0,
				y: 0
			};
			const positionMenu = (clientX, clientY) => {
				const rect = root.getBoundingClientRect();
				const menuW = menu.offsetWidth || 140;
				const menuH = menu.offsetHeight || 130;
				const x = Math.min(Math.max(0, clientX - rect.left), Math.max(0, rect.width - menuW));
				const y = clientY + menuH + 8 > window.innerHeight ? clientY - rect.top - menuH - 10 : clientY - rect.top + 12;
				const minY = -rect.top + 8;
				const maxY = Math.max(minY, window.innerHeight - rect.top - menuH - 8);
				menu.style.left = `${x}px`;
				menu.style.top = `${Math.min(Math.max(minY, y), maxY)}px`;
			};
			const openMenu = (clientX, clientY) => {
				lastMenuPos = {
					x: clientX,
					y: clientY
				};
				buildMenu();
				menu.classList.add("open");
				positionMenu(clientX, clientY);
			};
			const closeMenu = () => menu.classList.remove("open");
			const onDocPointerDown = (e) => {
				if (!menu.contains(e.target)) closeMenu();
			};
			let dragging = false;
			let suppressClick = false;
			let avoidCooldownUntil = 0;
			let avoidTimer;
			const cancelAvoid = () => {
				window.clearTimeout(avoidTimer);
				avoidTimer = void 0;
				root.style.transition = "";
			};
			const maybeAvoid = (e) => {
				if (root.classList.contains("hidden") || dragging || menu.classList.contains("open") || visualState !== "idle") return;
				if (performance.now() < avoidCooldownUntil) return;
				const rect = pet.getBoundingClientRect();
				if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
					cancelAvoid();
					return;
				}
				if (!(e.clientX >= rect.left - AVOID_MARGIN && e.clientX <= rect.right + AVOID_MARGIN && e.clientY >= rect.top - AVOID_MARGIN && e.clientY <= rect.bottom + AVOID_MARGIN)) {
					cancelAvoid();
					return;
				}
				if (avoidTimer !== void 0) return;
				avoidTimer = window.setTimeout(() => {
					avoidTimer = void 0;
					if (root.classList.contains("hidden") || dragging || menu.classList.contains("open") || visualState !== "idle") return;
					if (performance.now() < avoidCooldownUntil) return;
					const r = pet.getBoundingClientRect();
					if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) return;
					const cx = r.left + r.width / 2;
					const cy = r.top + r.height / 2;
					const dx = e.clientX - cx;
					const dy = e.clientY - cy;
					const len = Math.hypot(dx, dy) || 1;
					const next = clampPos(cx - dx / len * AVOID_STEP - PET_W / 2, cy - dy / len * AVOID_STEP - PET_H / 2);
					root.style.transition = "left .35s ease, top .35s ease";
					root.style.left = `${next.x}px`;
					root.style.top = `${next.y}px`;
					window.setTimeout(() => {
						root.style.transition = "";
						savePos();
					}, 380);
					showDialog("让一让~ 这里交给你啦 ✨");
				}, AVOID_DWELL_MS);
			};
			let idleMicroTimer;
			const clearIdleMicro = () => {
				window.clearTimeout(idleMicroTimer);
				idleMicroTimer = void 0;
			};
			const microLook = () => {
				if (pupil === null) return;
				const dx = Math.random() * .4 - .2;
				const dy = Math.random() * .3 - .15;
				pupil.style.transition = "transform .45s ease";
				pupil.style.transform = `translate(${dx}px, ${dy}px)`;
				window.setTimeout(() => {
					pupil.style.transition = "";
					pupil.style.transform = "";
				}, 1500);
			};
			const microBubbles = () => {
				popBubble();
				window.setTimeout(popBubble, 260);
			};
			const microSwim = () => {
				const ox = parseFloat(root.style.left) || 0;
				const oy = parseFloat(root.style.top) || 0;
				const target = clampPos(ox + (Math.random() * 200 - 100), oy + (Math.random() * 140 - 70));
				root.style.transition = "left 1.4s ease-in-out, top 1.4s ease-in-out";
				root.style.left = `${target.x}px`;
				root.style.top = `${target.y}px`;
				window.setTimeout(() => {
					root.style.transition = "";
					savePos();
				}, 1450);
				if (Math.random() < .35) showDialog(pick([
					"游一游，活动一下~ 🐳",
					"换个角度看主人 ✨",
					"咕噜噜... 巡视领地中"
				]));
			};
			const scheduleIdleMicro = () => {
				clearIdleMicro();
				idleMicroTimer = window.setTimeout(() => {
					if (visualState !== "idle" || root.classList.contains("hidden") || dragging || document.hidden || menu.classList.contains("open")) {
						scheduleIdleMicro();
						return;
					}
					const roll = Math.random();
					if (roll < .35) microSwim();
					else if (roll < .7) microLook();
					else microBubbles();
					scheduleIdleMicro();
				}, 9e3 + Math.random() * 8e3);
			};
			let dragStart = null;
			const onPetPointerDown = (e) => {
				if (e.button !== 0) return;
				cancelAvoid();
				avoidCooldownUntil = performance.now() + AVOID_COOLDOWN_MS;
				markActive();
				dragStart = {
					x: e.clientX,
					y: e.clientY,
					ox: parseFloat(root.style.left) || 0,
					oy: parseFloat(root.style.top) || 0
				};
				pet.setPointerCapture(e.pointerId);
			};
			const onPetPointerMove = (e) => {
				if (dragStart === null) return;
				const dx = e.clientX - dragStart.x;
				const dy = e.clientY - dragStart.y;
				if (!dragging && Math.abs(dx) + Math.abs(dy) > 4) {
					dragging = true;
					suppressClick = true;
					root.classList.add("dragging");
				}
				if (dragging) {
					const p = clampPos(dragStart.ox + dx, dragStart.oy + dy);
					root.style.left = `${p.x}px`;
					root.style.top = `${p.y}px`;
				}
			};
			const endDrag = () => {
				if (dragStart === null) return;
				dragStart = null;
				if (dragging) {
					dragging = false;
					root.classList.remove("dragging");
					savePos();
				}
				window.setTimeout(() => {
					suppressClick = false;
				}, 0);
			};
			let sleepTimer;
			let sleeping = false;
			const markActive = () => {
				window.clearTimeout(sleepTimer);
				if (sleeping) {
					sleeping = false;
					root.classList.remove("sleeping");
					showDialog("醒啦！随时准备开工~ ✨");
					sounds.play("bubble");
				}
				sleepTimer = window.setTimeout(() => {
					if (visualState !== "idle" || dragging) {
						markActive();
						return;
					}
					sleeping = true;
					root.classList.add("sleeping");
					showDialog("呼噜噜... 正在做深海美梦 (Zzz) 💤");
				}, SLEEP_MS);
			};
			const wake = () => {
				if (sleeping) {
					sleeping = false;
					root.classList.remove("sleeping");
				}
			};
			let eyeRaf = 0;
			const onMouseMove = (e) => {
				if (root.classList.contains("hidden")) return;
				markActive();
				maybeAvoid(e);
				if (pupil === null || eyeRaf !== 0) return;
				eyeRaf = window.requestAnimationFrame(() => {
					eyeRaf = 0;
					const rect = pet.getBoundingClientRect();
					const cx = rect.left + rect.width / 2;
					const cy = rect.top + rect.height / 2;
					const dx = Math.max(-.18, Math.min(.18, (e.clientX - cx) / 500));
					const dy = Math.max(-.15, Math.min(.15, (e.clientY - cy) / 450));
					pupil.style.transform = `translate(${dx}px, ${dy}px)`;
				});
			};
			pet.addEventListener("click", () => {
				if (suppressClick) return;
				if (visualState === "error" && lastErrorText !== "") {
					try {
						navigator.clipboard?.writeText(lastErrorText);
					} catch {}
					showDialog("错误信息已复制到剪贴板，快去找主人帮忙 📋");
				}
				triggerSquish();
			});
			pet.addEventListener("dblclick", triggerRoll);
			pet.addEventListener("contextmenu", (e) => {
				e.preventDefault();
				cancelAvoid();
				avoidCooldownUntil = performance.now() + AVOID_COOLDOWN_MS;
				openMenu(e.clientX, e.clientY);
			});
			pet.addEventListener("pointerdown", onPetPointerDown);
			pet.addEventListener("pointermove", onPetPointerMove);
			pet.addEventListener("pointerup", endDrag);
			pet.addEventListener("pointercancel", endDrag);
			document.addEventListener("pointerdown", onDocPointerDown);
			document.addEventListener("keydown", markActive);
			document.addEventListener("wheel", markActive, { passive: true });
			window.addEventListener("mousemove", onMouseMove, { passive: true });
			window.addEventListener("resize", onResize);
			const driver = new WhaleDriver();
			const sessions = ctx.sessions;
			let unsubList;
			let unsubSession;
			let face;
			const onSnapshot = () => {
				const snap = face?.getSnapshot();
				if (snap === void 0) {
					lastErrorText = "";
					setState("idle", visualState !== "idle");
					updateTicker("");
					return;
				}
				const snapObj = snap;
				lastErrorText = snapObj.lastAgentError ?? (snapObj.openError !== null ? "open-error" : "");
				const step = driver.step(snapObj, performance.now());
				setState(step.state, step.changed);
				updateTicker(tickerOn && step.state === "think" ? partialTextOf(snap.partial) : "");
			};
			const syncSession = () => {
				unsubSession?.();
				unsubSession = void 0;
				face = void 0;
				const id = sessions.list.getSnapshot().current;
				if (id === void 0) {
					onSnapshot();
					return;
				}
				const binding = sessions.binding(id);
				if (binding === void 0) {
					onSnapshot();
					return;
				}
				face = binding.session;
				unsubSession = face.subscribe(onSnapshot);
				onSnapshot();
			};
			if (sessions !== void 0) {
				unsubList = sessions.list.subscribe(syncSession);
				syncSession();
			}
			markActive();
			try {
				if (localStorage.getItem(HIDDEN_KEY) === "1") {
					root.classList.add("hidden");
					createMini();
				}
			} catch {}
			startAutoHide();
			const dispose = () => {
				window.clearTimeout(sleepTimer);
				window.clearTimeout(dialogTimer);
				if (eyeRaf !== 0) window.cancelAnimationFrame(eyeRaf);
				unsubList?.();
				unsubSession?.();
				document.removeEventListener("pointerdown", onDocPointerDown);
				document.removeEventListener("keydown", markActive);
				document.removeEventListener("wheel", markActive);
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("resize", onResize);
				document.removeEventListener("visibilitychange", onVisibility);
				themeObserver.disconnect();
				clearIdleMicro();
				cancelAvoid();
				if (autoHideTimer !== void 0) window.clearInterval(autoHideTimer);
				hideTicker();
				ticker.remove();
				removeMini();
				root.remove();
				style.remove();
			};
			quitWhale = dispose;
			return dispose;
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
