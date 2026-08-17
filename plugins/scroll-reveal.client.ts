import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * 全站滚动叙事动效（仅客户端）：
 * - [data-reveal]：单元素滚动淡入 + 上浮（触发后保持可见，快速滚动不丢文案）
 * - [data-reveal-group] / [data-reveal-item]：一组元素交错显现
 * - [data-parallax]：影像滚动视差（配合 scale 防露底）
 * - .scene-visual img：第三幕滚动进入"模糊→清晰" + 极慢缩放（1.06→1.03）
 * - .want-section：第五幕欲望之核随滚动生长（进入扩散 / 离开收回），标题延迟 250ms
 * prefers-reduced-motion 用户完全不初始化，元素保持默认可见。
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  // 全局滚动进度 → --scroll-progress (0..1)：驱动贯穿六幕的"光线旅程"光罩
  ScrollTrigger.create({
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    onUpdate: (self) => {
      document.documentElement.style.setProperty('--scroll-progress', self.progress.toFixed(4))
    },
  })

  // 单元素揭示：触发后保持可见（避免快速滚动时文案被反向隐藏）
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { autoAlpha: 0, y: 36 }, {
      autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
    })
  })

  // 分组交错揭示
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]')
    if (!items.length) return
    gsap.fromTo(items, { autoAlpha: 0, y: 28 }, {
      autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none none' },
    })
  })

  // 影像视差：放大 1.2（每边约 10% 出血 ≥ 行程 16%）后随滚动缓慢移动，保证铺满不露底
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.12')
    gsap.set(el, { scale: 1.2 })
    gsap.fromTo(el, { yPercent: -speed * 100 }, {
      yPercent: speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })

  // 第三幕：影像滚动进入"模糊 → 清晰"，并伴随极慢的 1.06 → 1.03 收缩
  // （该影像不再参与 data-parallax，避免 transform 冲突）
  gsap.utils.toArray<HTMLElement>('.scene-visual img').forEach((img) => {
    gsap.fromTo(img, { filter: 'blur(14px) saturate(.82)', scale: 1.06 }, {
      filter: 'blur(0px) saturate(.95)', scale: 1.03,
      ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'center center', scrub: true },
    })
  })

  // 第五幕：文案延迟 250ms 上浮（影像为静态全幅背景，心核由 CSS 呼吸动画驱动）
  gsap.utils.toArray<HTMLElement>('.want-section').forEach((section) => {
    const copy = section.querySelector('.want-copy')
    if (copy) {
      gsap.fromTo(copy, { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 1, delay: 0.25, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 58%', toggleActions: 'play none none reverse' },
      })
    }
  })

  // 文字动效（字符/行 span 由组件 SSR 渲染，此处只驱动动画）：
  // A. Hero 标题逐字点亮（首屏自动；每行内逐字，第二行稍晚，像灯光逐盏亮起）
  const heroLines = document.querySelectorAll<HTMLElement>('.hero-copy h1 .hero-line')
  heroLines.forEach((line, li) => {
    const chars = line.querySelectorAll<HTMLElement>('.t-char')
    gsap.fromTo(chars, { opacity: 0.08, filter: 'brightness(0.5)' }, {
      opacity: 1, filter: 'brightness(1)',
      duration: 0.5, stagger: 0.045, ease: 'power2.out',
      delay: 0.5 + li * 0.4,
    })
  })

  // B. 章节标题两行错位进入（滚动触发；Act5 渐变标题未拆行，保持渐变质感）
  gsap.utils.toArray<HTMLElement>('.body-touch h2, .scenes h2, .peak-copy h2, .shop-copy h2, .relationship h2, .trust-section h2, .journal h2, .page-title').forEach((h2) => {
    const lines = h2.querySelectorAll<HTMLElement>('.t-line')
    if (!lines.length) return
    gsap.fromTo(lines, { autoAlpha: 0, y: 22 }, {
      autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'power3.out',
      scrollTrigger: { trigger: h2, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })
})
