<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '夜后手记',
  title: '留在这份\n感受里。',
  link: '阅读这篇手记 ↗',
  body: '关于靠近、等待，\n和只属于我们的时间。',
} : {
  eyebrow: 'After dark journal',
  title: 'Stay with\nthe feeling.',
  link: 'Read the note ↗',
  body: 'On closeness, waiting,\nand time that belongs to us.',
})
</script>

<template>
  <section id="journal" class="journal section-frame" aria-labelledby="journal-title">
    <div>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="journal-title">{{ copy.title }}</h2>
    </div>
    <NuxtLink class="journal-card" to="/journal/1">
      <span>{{ copy.link }}</span>
      <strong>
        <span class="t-line" v-for="(ln, i) in copy.body.split('\n')" :key="i">{{ ln }}</span>
      </strong>
    </NuxtLink>
  </section>
</template>
