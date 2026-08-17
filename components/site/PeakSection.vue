<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '04 / 感到律动',
  title: '慢下来，\n身体会跟上。',
  body: '律动会自己找到节奏。',
  hint: '左右移动，拨动节奏',
  hold: '按住，感受温热',
} : {
  eyebrow: '04 / Stay with the feeling',
  title: 'Slow is not soft.',
  body: 'Pressure. Release. Again.',
  hint: 'Move across the rhythm',
  hold: 'Don’t stop now',
})

/** 对称声波：21 根，中间最高、向两侧渐低（--wave-index 越大越高） */
const bars = Array.from({ length: 21 }, (_, i) => 21 - Math.abs(10 - i))

const stage = ref<HTMLElement | null>(null)
const holding = ref(false)
let raf = 0

/**
 * 节奏互动（简化版）：
 * - 指针/手指横向移动 → 一道波峰跟随 x 位置掠过波形（每根柱按高斯包络抬升）
 * - 按下/触摸 → 波形区域升温（--wave-heat），引导文案切换为"按住"
 * - reduced-motion 不绑定，保持静态呼吸
 */
function applyWave(xRatio: number) {
  const el = stage.value
  if (!el) return
  const barsEl = el.querySelectorAll<HTMLElement>('i')
  for (let i = 0; i < barsEl.length; i++) {
    const center = i / (barsEl.length - 1)
    const d = center - xRatio
    const lift = 0.45 + 0.75 * Math.exp(-(d * d) * 90)
    barsEl[i].style.setProperty('--wave-lift', lift.toFixed(3))
  }
  el.style.setProperty('--wave-x', `${(xRatio * 100).toFixed(1)}%`)
}

function onMove(event: PointerEvent) {
  const el = stage.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => applyWave(Math.min(1, Math.max(0, x))))
}

function onDown() {
  holding.value = true
  stage.value?.style.setProperty('--wave-heat', '1')
}

function onUp() {
  holding.value = false
  stage.value?.style.setProperty('--wave-heat', '0')
}

onMounted(() => {
  const el = stage.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerdown', onDown)
  el.addEventListener('pointerup', onUp)
  el.addEventListener('pointerleave', onUp)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  const el = stage.value
  el?.removeEventListener('pointermove', onMove)
  el?.removeEventListener('pointerdown', onDown)
  el?.removeEventListener('pointerup', onUp)
  el?.removeEventListener('pointerleave', onUp)
})
</script>

<template>
  <section class="peak-section" data-act="04" aria-labelledby="peak-title">
    <div class="peak-visual" aria-hidden="true">
      <SitePicture
        src="/images/journey/skin-rhythm-v1.png"
        alt=""
        sizes="100vw"
        img-class="peak-visual-img"
      />
    </div>
    <div class="peak-copy" data-reveal>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="peak-title" class="art-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h2>
      <p class="peak-body">{{ copy.body }}</p>
    </div>
    <div class="wave-stage" ref="stage" aria-hidden="true">
      <i v-for="(h, index) in bars" :key="index" :style="{ '--wave-index': h }"></i>
    </div>
    <p class="wave-hint" :class="{ 'is-holding': holding }">{{ holding ? copy.hold : copy.hint }}</p>
  </section>
</template>
