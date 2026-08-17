<script setup lang="ts">
const { language } = useSiteLanguage()
const active = ref(0)
const expanded = ref(false)
const zoneHover = ref(false)
const navHover = ref(false)

/**
 * 触发式浮现：鼠标靠近右缘热区 / 悬停导航 / 键盘聚焦任一条件满足时显示。
 * 静止态完全透明且不拦截指针，不遮挡任何背景、不挤压任何空间（纯 fixed 悬浮）。
 */
const visible = computed(() => zoneHover.value || navHover.value || expanded.value)

const moods = computed(() => language.value === 'zh' ? ['暗', '热', '触', '律', '渴', '入'] : ['Dark', 'Warm', 'Touch', 'Pulse', 'Want', 'Enter'])
const labels = computed(() => language.value === 'zh'
  ? ['暗下来', '看见体温', '发生触碰', '感到律动', '产生渴望', '进入 Shop']
  : ['Dark falls', 'See the heat', 'Touch begins', 'Feel the rhythm', 'Desire rises', 'Enter'])

const sections = [
  '.desire-hero', '.body-touch', '.scenes', '.peak-section', '.want-section', '.shop-reveal',
] as const

function go(index: number) {
  const el = document.querySelector(sections[index])
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sections.findIndex((sel) => entry.target.matches(sel))
          if (idx !== -1) active.value = idx
        }
      })
    },
    { rootMargin: '-42% 0px -52% 0px' },
  )
  sections.forEach((sel) => {
    const el = document.querySelector(sel)
    if (el) observer.observe(el)
  })
})
</script>

<template>
  <!-- 触发热区：右缘 36px 隐形竖条，鼠标靠近才让导航浮现 -->
  <div
    class="chapter-nav-zone"
    aria-hidden="true"
    @mouseenter="zoneHover = true"
    @mouseleave="zoneHover = false"
  ></div>

  <!--
    章节导航（触发式）：静止态完全透明、不拦截指针；
    鼠标靠近右缘 / 悬停 / 键盘聚焦时浮现，展开列表悬浮于内容之上。
  -->
  <nav
    class="chapter-nav"
    :class="{ 'is-visible': visible }"
    aria-label="章节导航"
    @mouseenter="navHover = true; expanded = true"
    @mouseleave="navHover = false; expanded = false"
    @focusin="expanded = true"
    @focusout="expanded = false"
  >
    <!-- 进度轨：六幕光点，当前幕高亮发光 -->
    <div class="chapter-nav__rail" aria-hidden="true">
      <span class="chapter-nav__rail-line"></span>
      <span
        v-for="(mood, index) in moods"
        :key="mood"
        class="chapter-nav__rail-dot"
        :class="{ 'is-active': active === index }"
        :style="{ '--rail-i': index }"
      ></span>
    </div>

    <!-- 悬浮展开态：完整章节列表 -->
    <div class="chapter-nav__list" :class="{ 'is-open': expanded }">
      <button
        v-for="(mood, index) in moods"
        :key="mood"
        type="button"
        :class="{ 'is-active': active === index }"
        :aria-label="`${labels[index]} · ${index + 1}`"
        @click="go(index)"
      >
        <span class="chapter-nav__num">0{{ index + 1 }}</span>
        <span class="chapter-nav__name">{{ labels[index] }}</span>
      </button>
    </div>
  </nav>

  <!-- 移动端：底部细线进度 + 当前章节痕迹 -->
  <div class="mobile-progress" aria-hidden="true">
    <span class="mobile-progress__fill"></span>
    <span class="mobile-progress__tag">0{{ active + 1 }} · {{ moods[active] }}</span>
  </div>
</template>
