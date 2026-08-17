<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  title: '承认吧，\n你想要。',
  description: '欲望不需要理由。靠近它，让它进来。',
  footer: '为身体、心智与记忆之间而做。',
  back: '回到顶部 ↑',
  meta: '承认吧，你想要。给欲望留一点空间——为身体、心智与记忆之间而做。',
} : {
  title: 'Admit it.\nYou want.',
  description: 'You came here for a reason.',
  footer: 'Objects for the space between body, mind and memory.',
  back: 'Back to top ↑',
  meta: 'Admit it. You want. Make room for what your body already knows.',
})

usePageMeta(() => ({
  title: language.value === 'zh' ? '给欲望留一点空间' : 'Make room for desire',
  description: copy.value.meta,
}))
</script>

<template>
  <div class="site-shell">
    <SiteHeader />
    <ChapterNav />
    <main id="main-content">
      <SiteDesireHero :copy="copy" />
      <SiteBodyTouch />
      <SiteDesireScenes />
      <SitePeakSection />
      <SiteWantSection />
      <SiteShopReveal />
      <SiteFooter />
    </main>
  </div>
</template>
