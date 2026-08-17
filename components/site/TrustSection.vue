<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '安心拥有',
  title: '不打断欲望的\n信任。',
  items: [
    ['隐私包装', '不留下多余信息。'],
    ['材质与护理', '清楚知道如何相处。'],
    ['配送与售后', '每一步都可预期。'],
  ],
} : {
  eyebrow: 'Trust without killing desire',
  title: 'Trust that\ndoes not interrupt.',
  items: [
    ['Private packaging', 'Nothing extra left behind.'],
    ['Materials & care', 'Know how to live with it.'],
    ['Shipping & support', 'Every step stays clear.'],
  ],
})
</script>

<template>
  <section class="trust-section section-frame" aria-labelledby="trust-title">
    <div>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="trust-title" class="art-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h2>
    </div>
    <div class="trust-list">
      <div v-for="item in copy.items" :key="item[0]" class="trust-item">
        <span>+</span>
        <div>
          <h3>{{ item[0] }}</h3>
          <p>{{ item[1] }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
