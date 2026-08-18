<script setup lang="ts">
const { language } = useSiteLanguage()
const active = ref(0)
const expanded = ref(false)
const mobileOpen = ref(false)
let observer: IntersectionObserver | undefined

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
  mobileOpen.value = false
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') mobileOpen.value = false
}

onMounted(() => {
  observer = new IntersectionObserver(
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
  window.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('keydown', closeOnEscape)
})
</script>

<template>
  <!-- 桌面端：进度轨始终可见，悬停或键盘聚焦时向左展开完整章节。 -->
  <nav
    class="chapter-nav"
    aria-label="章节导航"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
    @focusin="expanded = true"
    @focusout="expanded = false"
  >
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

  </nav>

  <!-- 移动端：当前章节是可操作入口，点击后打开六幕快捷跳转。 -->
  <button
    class="mobile-progress"
    type="button"
    :aria-expanded="mobileOpen"
    aria-controls="mobile-chapters"
    @click="mobileOpen = !mobileOpen"
  >
    <span class="mobile-progress__fill"></span>
    <span class="mobile-progress__tag">0{{ active + 1 }} · {{ moods[active] }}</span>
    <span class="mobile-progress__mark" aria-hidden="true">{{ mobileOpen ? '×' : '⌃' }}</span>
  </button>
  <Transition name="chapter-sheet">
    <nav v-if="mobileOpen" id="mobile-chapters" class="mobile-chapter-sheet" aria-label="章节导航">
      <button
        v-for="(mood, index) in moods"
        :key="mood"
        type="button"
        :class="{ 'is-active': active === index }"
        @click="go(index)"
      >
        <span>0{{ index + 1 }}</span>
        {{ labels[index] }}
      </button>
    </nav>
  </Transition>
</template>
