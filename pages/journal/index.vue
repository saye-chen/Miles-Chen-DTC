<script setup lang="ts">
import { journalEntries } from '~/data/journal'

const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: 'Journal / 夜后手记',
  title: '让感受，\n继续发生。',
  read: '阅读这篇手记 ↗',
  meta: '夜后手记：关于靠近、等待，和只属于我们的时间。',
} : {
  eyebrow: 'Journal / After dark',
  title: 'Let the feeling\ncontinue.',
  read: 'Read the note ↗',
  meta: 'After dark journal: on closeness, waiting, and time that belongs to us.',
})

usePageMeta(() => ({
  title: language.value === 'zh' ? 'Journal · 夜后手记' : 'Journal — after dark',
  description: copy.value.meta,
}))
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="journal-page section-frame">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="art-title page-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h1>

      <div class="journal-grid">
        <article
          v-for="(entry, index) in journalEntries"
          :key="entry.slug"
          class="journal-entry"
          :class="`journal-entry--${index + 1}`"
        >
          <div class="journal-entry__visual" aria-hidden="true"></div>
          <p>0{{ index + 1 }}</p>
          <h2>{{ entry.title[language] }}</h2>
          <span>{{ entry.tagline[language] }}</span>
          <NuxtLink :to="`/journal/${entry.slug}`">{{ copy.read }}</NuxtLink>
        </article>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
