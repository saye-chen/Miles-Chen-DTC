<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '独处 · 两人',
  title: '靠近，\n不必解释。',
  alone: '独处',
  together: '两人',
  hint: '拖动光线，改变距离。',
} : {
  eyebrow: 'Alone · Together',
  title: 'Closer,\nwithout words.',
  alone: 'Alone',
  together: 'Together',
  hint: 'Move through the distance.',
})
</script>

<template>
  <section class="relationship section-frame" aria-labelledby="relationship-title">
    <div class="relationship-heading">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="relationship-title" class="art-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h2>
      <p>{{ copy.hint }}</p>
    </div>
    <div class="relationship-stage">
      <div class="relationship-half relationship-half--alone"><span>{{ copy.alone }}</span></div>
      <div class="relationship-half relationship-half--together"><span>{{ copy.together }}</span></div>
      <div class="relationship-beam" aria-hidden="true"></div>
    </div>
  </section>
</template>
