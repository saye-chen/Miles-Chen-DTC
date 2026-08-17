<script setup lang="ts">
import { findJournalEntry } from '~/data/journal'

const route = useRoute()
const entry = findJournalEntry(String(route.params.slug))
const { language } = useSiteLanguage()

if (!entry) {
  throw createError({ statusCode: 404, statusMessage: 'Journal entry not found' })
}

const copy = computed(() => ({
  eyebrow: entry.eyebrow[language.value],
  title: entry.title[language.value],
  body: entry.body[language.value],
  back: language.value === 'zh' ? '返回 Journal' : 'Back to Journal',
}))

usePageMeta(() => ({
  title: entry.title[language.value].replace(/\n/g, ' '),
  description: entry.body[language.value],
  type: 'article',
}))
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="simple-page section-frame article-page">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="art-title page-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h1>
      <div class="article-atmosphere" aria-hidden="true"></div>
      <p class="article-body">{{ copy.body }}</p>
      <NuxtLink class="back-link" to="/journal">← {{ copy.back }}</NuxtLink>
    </main>
    <SiteFooter />
  </div>
</template>
