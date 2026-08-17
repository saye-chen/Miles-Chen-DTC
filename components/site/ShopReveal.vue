<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '06 / 进入',
  title: '让它\n找到你。',
  description: '在黑暗的尽头，有一扇门。它一直在等你。',
  cta: '进入系列',
  cta2: '读一篇手记',
  label: '概念演示 / CONCEPTUAL',
  note: '演示内容 · 商品事实、价格与库存待确认。',
} : {
  eyebrow: '06 / Enter',
  title: 'Take the feeling\nwith you.',
  description: 'You know what comes next.',
  cta: 'Enter the collection',
  cta2: 'Read a note',
  label: 'CONCEPTUAL / 概念演示',
  note: 'Demo content · product facts, price and availability pending confirmation.',
})
</script>

<template>
  <section id="shop" class="shop-reveal" data-act="06" aria-labelledby="shop-title">
    <!-- 左：收束文案 + 双按钮（转化落点），立在暗部，朝向门扉 -->
    <div class="shop-copy" data-reveal>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="shop-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h2>
      <p class="shop-lead">{{ copy.description }}</p>
      <div class="shop-actions">
        <NuxtLink class="primary-button" to="/shop">{{ copy.cta }} <span>→</span></NuxtLink>
        <NuxtLink class="ghost-button" to="/journal">{{ copy.cta2 }} <span>↗</span></NuxtLink>
      </div>
      <small>{{ copy.note }}</small>
    </div>

    <!-- 右：门扉 —— 材质影像作为"黑暗尽头的一扇门"，出血到视口右缘 -->
    <div class="shop-visual" data-reveal>
      <SitePicture
        src="/images/journey/pexels-six-afterglow-v1.png"
        :alt="language === 'zh' ? '暗铜色调下，成年模特的肩背、腰线与蕾丝身体轮廓' : 'An adult fashion model’s shoulders, waist and lace silhouette in dark copper light'"
        sizes="(max-width: 700px) 92vw, 52vw"
        parallax="0.06"
        img-class="shop-material-img"
      />
      <div class="shop-visual-scrim" aria-hidden="true"></div>
      <span class="shop-visual-label">{{ copy.label }}</span>
    </div>

    <!-- 门下光池：门扉底部渗进房间的光（"它一直在等你"） -->
    <div class="shop-doorlight" aria-hidden="true"></div>
    <!-- 等待的微光：文案与门扉之间的暖光 + 右缘题签 -->
    <span class="shop-waiting-light" aria-hidden="true"></span>
    <span class="act-meta" aria-hidden="true">{{ language === 'zh' ? '06 / 进入 · ENTER' : '06 / ENTER' }}</span>
  </section>
</template>
