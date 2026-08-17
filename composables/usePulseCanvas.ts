/** Lightweight visual fallback for touch/video surfaces. */
export function usePulseCanvas(canvas: Ref<HTMLCanvasElement | null>) {
  let frame = 0
  let observer: ResizeObserver | undefined

  const draw = (time: number) => {
    const element = canvas.value
    const context = element?.getContext('2d')
    if (!element || !context) return
    const size = element.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    if (element.width !== size.width * ratio || element.height !== size.height * ratio) {
      element.width = size.width * ratio
      element.height = size.height * ratio
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    const pulse = (Math.sin(time / 1000 * 1.6) + 1) / 2
    context.clearRect(0, 0, size.width, size.height)
    const glow = context.createRadialGradient(size.width * .56, size.height * .54, 8, size.width * .56, size.height * .54, size.width * (.18 + pulse * .12))
    glow.addColorStop(0, `rgba(230, 176, 168, ${.18 + pulse * .16})`)
    glow.addColorStop(1, 'rgba(143, 42, 38, 0)')
    context.fillStyle = glow
    context.fillRect(0, 0, size.width, size.height)
    frame = requestAnimationFrame(draw)
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    frame = requestAnimationFrame(draw)
    observer = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw) })
    if (canvas.value) observer.observe(canvas.value)
  })
  onBeforeUnmount(() => { cancelAnimationFrame(frame); observer?.disconnect() })
}
