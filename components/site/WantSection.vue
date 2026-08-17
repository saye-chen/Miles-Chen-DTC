<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '05 / 产生渴望',
  title: '现在，\n你开始想要。',
  body: '渴望不需要理由。它只需要被承认。',
} : {
  eyebrow: '05 / You want more',
  title: 'You want\nmore.',
  body: 'The wanting is the point.',
})
</script>

<template>
  <section class="want-section section-frame" data-act="05" aria-labelledby="want-title">
    <div class="want-visual" aria-hidden="true">
      <SitePicture
        src="/images/journey/pexels-act05-black-lingerie-v1.png"
        alt=""
        sizes="100vw"
        parallax="0.08"
        img-class="want-visual-img"
      />
    </div>
    <div class="want-copy">
      <!-- 心核：标题背后的小型暖光光源（"欲望之核"降级为光点，不抢影像焦点） -->
      <div class="want-core" aria-hidden="true"></div>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="want-title" class="art-title">{{ copy.title }}</h2>
      <p>{{ copy.body }}</p>
    </div>
    <!-- 上升余烬：高潮幕的"活着感"，与首屏漂浮光点呼应 -->
    <div class="want-embers" aria-hidden="true">
      <span v-for="i in 7" :key="i" :style="{ '--ember-i': i }"></span>
    </div>
  </section>
</template>
