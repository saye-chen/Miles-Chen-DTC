<script setup lang="ts">
const props = defineProps<{ copy: { title: string; description: string } }>()
const { language } = useSiteLanguage()

const label = computed(() => language.value === 'zh' ? {
  eyebrow: '01 / 暗下来',
  cta: '向下，进入黑暗',
  cta2: '探索物件',
  scroll: '继续向下',
} : {
  eyebrow: '01 / Let the dark fall',
  cta: 'Descend into the dark',
  cta2: 'Explore the objects',
  scroll: 'Keep going',
})

const visual = ref<HTMLElement | null>(null)
const dust = ref<HTMLCanvasElement | null>(null)
const pulse = ref<HTMLCanvasElement | null>(null)
useTouchField(visual)
usePulseCanvas(pulse)
useDustParticles(dust, visual)

/** 标题拆成"行 > 视觉单元"：中文逐字、英文逐词（含空格占位），SSR 直接渲染 */
const units = computed(() => props.copy.title.split('\n').map(line =>
  /[\u4e00-\u9fff]/.test(line) ? [...line] : line.split(/(\s+)/).filter(Boolean),
))

/**
 * 第一幕「暗下来」：全屏沉浸首屏 —— 影像作为整屏背景从黑暗中浮现，
 * 超大斜体标题偏左中央"题签式"落下；漂浮光点随触碰被吸引（氛围与交互一体）。
 * 双 CTA：向下进入叙事 + 直达商品（透明描边按钮，承接转化）。
 */
</script>

<template>
  <section class="desire-hero" data-act="01" aria-labelledby="hero-title">
    <div ref="visual" class="hero-visual" role="img" aria-label="黑暗中隐约可见的柔软曲面与体温">
      <SitePicture
        src="/images/journey/hero-touch-film.png"
        alt="黑暗里，暖铜光线下柔软曲面与光影的影像"
        sizes="100vw"
        loading="eager"
        fetchpriority="high"
        parallax="0.08"
        img-class="hero-bg"
      />
      <div class="hero-scrim" aria-hidden="true"></div>
      <canvas ref="dust" class="hero-dust" aria-hidden="true"></canvas>
      <canvas ref="pulse" class="hero-pulse" aria-hidden="true"></canvas>
      <span class="hero-label">黑暗 / DARKNESS</span>
    </div>
    <div class="hero-copy">
      <p class="eyebrow">{{ label.eyebrow }}</p>
      <h1 id="hero-title">
        <span class="hero-line" v-for="(line, li) in units" :key="li">
          <span class="t-char" v-for="(ch, ci) in line" :key="ci">{{ ch }}</span>
        </span>
      </h1>
      <p class="hero-lead">{{ props.copy.description }}</p>
      <div class="hero-actions">
        <a class="primary-button" href="#feeling">{{ label.cta }} <span>↓</span></a>
        <NuxtLink class="ghost-button" to="/shop">{{ label.cta2 }} <span>→</span></NuxtLink>
      </div>
    </div>
    <p class="scroll-note">{{ label.scroll }} <span>↓</span></p>
  </section>
</template>
