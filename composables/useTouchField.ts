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

  const setVar = (name: string, value: string) => el?.style.setProperty(name, value)

  const tick = () => {
    current.x += (target.x - current.x) * 0.1
    current.y += (target.y - current.y) * 0.1
    // 悬停持续升温；移开后余温缓慢衰减（比脉冲更持久）
    heat = hovered ? Math.min(1, heat + 0.008) : Math.max(0, heat - 0.004)
    setVar('--pointer-x', `${current.x}%`)
    setVar('--pointer-y', `${current.y}%`)
    setVar('--heat', heat.toFixed(3))
    raf = requestAnimationFrame(tick)
  }

  function handleMove(event: PointerEvent) {
    const rect = el?.getBoundingClientRect()
    if (!rect) return
    target.x = ((event.clientX - rect.left) / rect.width) * 100
    target.y = ((event.clientY - rect.top) / rect.height) * 100
    hovered = true
  }
  function handleLeave() { hovered = false }
  function handleDown() { heat = Math.min(1, heat + 0.5) }
  function handleTouch() { heat = Math.min(1, heat + 0.42) }

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
    el.addEventListener('pointermove', handleMove)
    el.addEventListener('pointerdown', handleDown)
    el.addEventListener('pointerleave', handleLeave)
    el.addEventListener('touchstart', handleTouch, { passive: true })
    raf = requestAnimationFrame(tick)
  })
  onBeforeUnmount(() => cancelAnimationFrame(raf))
}
