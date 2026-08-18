/**
 * 品牌触碰机制：让"光线被吸引"，而不是简单跟随。
 * - 指针靠近：目标位置 lerp 平滑跟随（光的惰性，像被吸引）
 * - 悬停期间：--heat 持续缓慢升温（触碰区域变暖）
 * - 指针按下：热感突增（柔软的扩散）
 * - 指针移开：--heat 缓慢衰减，留下更持久的余温
 * - 移动端触摸：同样产生热感脉冲
 * 状态写入宿主元素的 CSS 变量：--pointer-x / --pointer-y / --heat (0..1)
 */
export function useTouchField(host: Ref<HTMLElement | null>) {
  const target = { x: 50, y: 50 }
  const current = { x: 50, y: 50 }
  let heat = 0
  let hovered = false
  let raf = 0
  let el: HTMLElement | null = null
  let visible = true
  let observer: IntersectionObserver | undefined

  const setVar = (name: string, value: string) => el?.style.setProperty(name, value)

  const tick = () => {
    current.x += (target.x - current.x) * 0.1
    current.y += (target.y - current.y) * 0.1
    // 悬停持续升温；移开后余温缓慢衰减（比脉冲更持久）
    heat = hovered ? Math.min(1, heat + 0.008) : Math.max(0, heat - 0.004)
    setVar('--pointer-x', `${current.x}%`)
    setVar('--pointer-y', `${current.y}%`)
    setVar('--heat', heat.toFixed(3))
    const moving = Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05
    const changingHeat = hovered ? heat < 0.999 : heat > 0.001
    raf = moving || changingHeat ? requestAnimationFrame(tick) : 0
  }

  const start = () => {
    if (!visible || raf) return
    raf = requestAnimationFrame(tick)
  }

  function handleMove(event: PointerEvent) {
    const rect = el?.getBoundingClientRect()
    if (!rect) return
    target.x = ((event.clientX - rect.left) / rect.width) * 100
    target.y = ((event.clientY - rect.top) / rect.height) * 100
    hovered = true
    start()
  }
  function handleEnter() { hovered = true; start() }
  function handleLeave() { hovered = false; start() }
  function handleDown() { heat = Math.min(1, heat + 0.5); start() }
  function handleTouch() { heat = Math.min(1, heat + 0.42); start() }

  onMounted(() => {
    el = host.value
    if (!el) return
    // reduced-motion：只保留静态弱光，不启动时间线
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVar('--heat', '0')
      setVar('--pointer-x', '50%')
      setVar('--pointer-y', '60%')
      return
    }
    el.addEventListener('pointerenter', handleEnter)
    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerdown', handleDown)
    el.addEventListener('pointerleave', handleLeave)
    el.addEventListener('touchstart', handleTouch, { passive: true })
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else {
        hovered = false
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    observer.observe(el)
  })
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    observer?.disconnect()
    el?.removeEventListener('pointerenter', handleEnter)
    el?.removeEventListener('pointermove', handleMove)
    el?.removeEventListener('pointerdown', handleDown)
    el?.removeEventListener('pointerleave', handleLeave)
    el?.removeEventListener('touchstart', handleTouch)
  })
}
