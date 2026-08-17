import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

/**
 * 自然滚动吸附：滚动停止后，让页面"滑行"到最近的完整一幕。
 * - 滚动停止后，自动选择最近的一幕顶部归位，不把用户卡在幕间
 * - 缓动用 power3.out：快速起步、末端平滑减速，无回弹、不突兀，像被磁铁轻轻吸住
 * - 滚动速度还高（带惯性）时不判定，等真正停稳再归位，避免"刚停就被拽"
 * - 吸附动画可被任何滚动立即打断；reduced-motion 跳过；非首页自动失效
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollToPlugin)

  const SNAP_SELECTOR = '.desire-hero, .body-touch, .scenes, .peak-section, .want-section, .shop-reveal'
  const ALIGN_OFFSET = 10
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

    // 已经进入页脚区域时不强行拉回第六幕，保证页脚仍然可以自然阅读。
    const lastBound = bounds[bounds.length - 1]
    if (y > lastBound + vh * .72) return

    const nearest = bounds.reduce((best, bound, index) => {
      return Math.abs(bound - y) < Math.abs(bounds[best] - y) ? index : best
    }, 0)
    const target = Math.max(0, bounds[nearest] - ALIGN_OFFSET)
    const d = Math.abs(target - y)
    if (d < 18) return
    // 距离越近越快，距离较远时给出完整的减速段，避免突然被拽走。
    const duration = Math.min(1.05, Math.max(.42, .34 + (d / vh) * .48))
    gsap.to(window, {
      scrollTo: { y: target, autoKill: true },
      duration,
      ease: 'power3.out',
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
    // 等一小段惯性结束再归位；连续滚动时不会每一帧介入。
    timeout = window.setTimeout(snap, velocity > 0.5 ? 360 : 220)
  }

  nuxtApp.hook('app:mounted', () => {
    collect()
    lastY = window.scrollY
    lastT = performance.now()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', collect)
  })
})
