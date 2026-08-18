import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * 首页滚动叙事只保留一套受控时间线：
 * - 文案进入、桌面端轻视差、首屏离场
 * - 一个全局进度源，同时驱动背景旅程与章节导航
 * - 路由切换前完整回收 ScrollTrigger、事件与计时器
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  gsap.registerPlugin(ScrollTrigger)

  let context: gsap.Context | null = null
  let setupFrame = 0
  let disposers: Array<() => void> = []

  function cleanup() {
    cancelAnimationFrame(setupFrame)
    setupFrame = 0
    disposers.forEach(dispose => dispose())
    disposers = []
    context?.revert()
    context = null
    document.documentElement.style.removeProperty('--scroll-progress')
  }

  function setup() {
    cleanup()
    if (!document.querySelector('.desire-hero')) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--scroll-progress', '0')
      return
    }

    context = gsap.context(() => {
      const chapterRail = document.querySelector<HTMLElement>('.chapter-nav__rail')
      ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          const progress = self.progress.toFixed(4)
          document.documentElement.style.setProperty('--scroll-progress', progress)
          chapterRail?.style.setProperty('--rail-progress', progress)
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]')
        if (!items.length) return
        gsap.fromTo(items, { autoAlpha: 0, y: 22 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        })
      })

      if (window.matchMedia('(min-width: 701px) and (hover: hover)').matches) {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const speed = Math.min(0.08, Math.abs(parseFloat(el.dataset.parallax || '0.06')))
          gsap.set(el, { scale: 1.08 })
          gsap.fromTo(el, { yPercent: -speed * 100 }, {
            yPercent: speed * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          })
        })
      }

      document.querySelectorAll<HTMLElement>('.hero-copy h1 .hero-line').forEach((line, lineIndex) => {
        const chars = line.querySelectorAll<HTMLElement>('.t-char')
        gsap.fromTo(chars, { opacity: 0, y: 10 }, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.035,
          delay: 0.28 + lineIndex * 0.24,
          ease: 'power2.out',
        })
      })

      gsap.utils.toArray<HTMLElement>('.body-touch h2, .scenes h2, .peak-copy h2, .shop-copy h2, .relationship h2, .trust-section h2, .journal h2, .page-title').forEach((heading) => {
        const lines = heading.querySelectorAll<HTMLElement>('.t-line')
        if (!lines.length) return
        gsap.fromTo(lines, { autoAlpha: 0, y: 18 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: heading, start: 'top 90%', once: true },
        })
      })

      const wantCopy = document.querySelector<HTMLElement>('.want-copy')
      if (wantCopy) {
        gsap.fromTo(wantCopy, { autoAlpha: 0, y: 26 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: wantCopy, start: 'top 82%', once: true },
        })
      }

      const hero = document.querySelector<HTMLElement>('.desire-hero')
      const heroCopy = hero?.querySelector<HTMLElement>('.hero-copy')
      if (hero && heroCopy) {
        gsap.to(heroCopy, {
          yPercent: -12,
          autoAlpha: 0.28,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4 },
        })
      }

      document.querySelectorAll<HTMLElement>('.scene-visual').forEach((visual) => {
        let pulseTimer = 0
        const pulse = (event: PointerEvent) => {
          const rect = visual.getBoundingClientRect()
          visual.style.setProperty('--touch-x', `${((event.clientX - rect.left) / rect.width) * 100}%`)
          visual.style.setProperty('--touch-y', `${((event.clientY - rect.top) / rect.height) * 100}%`)
          visual.classList.add('is-pulsing')
          window.clearTimeout(pulseTimer)
          pulseTimer = window.setTimeout(() => visual.classList.remove('is-pulsing'), 620)
        }
        visual.addEventListener('pointerdown', pulse)
        disposers.push(() => {
          window.clearTimeout(pulseTimer)
          visual.removeEventListener('pointerdown', pulse)
          visual.classList.remove('is-pulsing')
        })
      })
    })

    ScrollTrigger.refresh()
  }

  function scheduleSetup() {
    cancelAnimationFrame(setupFrame)
    setupFrame = requestAnimationFrame(setup)
  }

  nuxtApp.hook('app:mounted', scheduleSetup)
  nuxtApp.hook('page:start', cleanup)
  nuxtApp.hook('page:finish', scheduleSetup)
  window.addEventListener('pagehide', cleanup)
})
