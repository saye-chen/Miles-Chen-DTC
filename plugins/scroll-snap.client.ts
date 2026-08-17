import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

/**
 * 自然滚动吸附：滚动停止后，让页面"滑行"到最近的完整一幕。
 * - 只在画面被两幕真正均分（幕边界落在视口中部 40%–60%）时归位，其余完全自由
 * - 缓动用 power4.out：快速起步、末端平滑减速，无回弹、不突兀，像被磁铁轻轻吸住
 * - 滚动速度还高（带惯性）时不判定，等真正停稳再归位，避免"刚停就被拽"
 * - 吸附动画可被任何滚动立即打断；reduced-motion 跳过；非首页自动失效
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollToPlugin)

  const SNAP_SELECTOR = '.desire-hero, .body-touch, .scenes, .peak-section, .want-section, .shop-reveal'
  const HEADER_OFFSET = 84
  let timeout = 0
  let bounds: number[] = []
  let lastY = 0
  let lastT = 0

  function collect() {
    bounds = [...document.querySelectorAll<HTMLElement>(SNAP_SELECTOR)]
      .map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
  }

  function snap() {
    const y = window.scrollY
    const vh = window.innerHeight
    if (bounds.length < 2) return

    // 幕边界出现在视口中部（40%–60%）＝ 画面被两幕真正均分，才需要归位
    const midTop = y + vh * 0.4
    const midBottom = y + vh * 0.6
    let target: number | null = null
    for (let i = 0; i < bounds.length; i++) {
      const b = bounds[i]
      if (b <= midTop || b >= midBottom) continue
      const center = y + vh / 2
      target = center < b
        ? Math.max(0, (bounds[i - 1] ?? 0) - HEADER_OFFSET)
        : Math.max(0, b - HEADER_OFFSET)
      break
    }
    if (target === null) return

    const d = Math.abs(target - y)
    if (d < 2) return
    // 近吸快、远吸慢；power4.out 让归位像滑行停住，而不是被切换
    const duration = Math.min(1, 0.35 + (d / vh) * 0.6)
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration,
      ease: 'power4.out',
      overwrite: true,
    })
  }

  function onScroll() {
    const now = performance.now()
    const dy = window.scrollY - lastY
    const dt = now - lastT
    const velocity = dt > 0 ? Math.abs(dy / dt) : 0
    lastY = window.scrollY
    lastT = now
    window.clearTimeout(timeout)
    // 还有滚动惯性时等更久，停稳后才判定，避免"刚停就被拽"
    timeout = window.setTimeout(snap, velocity > 0.5 ? 420 : 180)
  }

  nuxtApp.hook('app:mounted', () => {
    collect()
    lastY = window.scrollY
    lastT = performance.now()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', collect)
  })
})
