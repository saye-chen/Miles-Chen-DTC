/**
 * 漂浮光点粒子系统：暗夜氛围层。
 * - 微光点缓慢漂移 + 各自呼吸（透明度随相位起伏）
 * - 响应触碰机制：指针靠近时被轻微吸引并变亮（读取宿主的 --pointer-x/y）
 * - 移动端（无指针）粒子保持自然漂移
 * - 低端机降级：减少粒子数、关闭 shadowBlur（昂贵的光晕）
 * - 离开视口自动暂停（首屏不可见时省电）
 * - reduced-motion 用户不启动
 */
export function useDustParticles(canvas: Ref<HTMLCanvasElement | null>, host: Ref<HTMLElement | null>, count = 26) {
  type Dust = { x: number; y: number; vx: number; vy: number; r: number; base: number; phase: number; speed: number }
  let raf = 0
  let particles: Dust[] = []
  let w = 0
  let h = 0
  let ctx: CanvasRenderingContext2D | null = null
  let observer: IntersectionObserver | undefined
  let visible = true

  /** 低端机判定：内存 ≤4GB 或 CPU 核数 ≤4 → 减粒、去光晕（SSR 下无 navigator，跳过） */
  const memory = typeof navigator !== 'undefined'
    ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    : undefined
  const lowEnd = (memory !== undefined && memory <= 4)
    || (typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4)

  function spawn(): Dust {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.08 - 0.02,
      r: 0.6 + Math.random() * 1.7,
      base: 0.08 + Math.random() * 0.24,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
    }
  }

  function resize() {
    const el = canvas.value
    if (!el) return
    const ratio = window.devicePixelRatio || 1
    const rect = el.getBoundingClientRect()
    w = rect.width
    h = rect.height
    el.width = w * ratio
    el.height = h * ratio
    ctx = el.getContext('2d')
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  function pointerPos(): { x: number; y: number } | null {
    const el = host.value
    if (!el) return null
    const px = parseFloat(el.style.getPropertyValue('--pointer-x')) || 50
    const py = parseFloat(el.style.getPropertyValue('--pointer-y')) || 50
    return { x: (px / 100) * w, y: (py / 100) * h }
  }

  function draw(time: number) {
    if (!visible) return
    const t = time / 1000
    ctx?.clearRect(0, 0, w, h)
    if (!ctx) return
    const pointer = pointerPos()
    for (const p of particles) {
      // 自然漂移
      p.x += p.vx
      p.y += p.vy
      // 指针吸引：靠近 160px 时被拉向指针并变亮
      let pull = 0
      if (pointer) {
        const dx = pointer.x - p.x
        const dy = pointer.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 170) {
          pull = (1 - dist / 170) * 0.35
          p.x += dx * pull * 0.04
          p.y += dy * pull * 0.04
        }
      }
      // 环绕边界
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10

      const breathe = (Math.sin(t * p.speed + p.phase) + 1) / 2
      const alpha = Math.min(0.55, p.base * (0.35 + breathe) + pull)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * (1 + breathe * 0.5), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(232, 196, 178, ${alpha.toFixed(3)})`
      if (!lowEnd) {
        ctx.shadowColor = 'rgba(230, 170, 150, .9)'
        ctx.shadowBlur = 6 + breathe * 8
      }
      ctx.fill()
    }
    raf = requestAnimationFrame(draw)
  }

  function start() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(draw)
  }

  function stop() {
    cancelAnimationFrame(raf)
  }

  onMounted(() => {
    const el = canvas.value
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    resize()
    particles = Array.from({ length: lowEnd ? Math.min(count, 12) : count }, spawn)
    window.addEventListener('resize', resize)
    start()
    // 离开视口暂停，回到视口恢复（首屏滚动到下面后省电）
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    observer.observe(el)
  })
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    observer?.disconnect()
  })
}
