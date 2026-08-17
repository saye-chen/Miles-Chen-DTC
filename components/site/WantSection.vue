<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '05 / 产生渴望',
  title: '现在，\n你开始想要。',
  body: '渴望不需要理由。它只需要被承认。',
  lens: '渴望 / DESIRE',
} : {
  eyebrow: '05 / You want more',
  title: 'You want\nmore.',
  body: 'The wanting is the point.',
  lens: 'DESIRE',
})
</script>

<template>
  <section class="want-section section-frame" data-act="05" aria-labelledby="want-title">
    <div class="want-visual" aria-hidden="true">
      <SitePicture
        src="/images/journey/pexels-act05-black-lingerie-v1.png"
        alt=""
        sizes="100vw"
        img-class="want-visual-img"
      />
    </div>
    <div class="want-object">
      <div class="object-halo" aria-hidden="true"></div>
      <div class="object-glow" aria-hidden="true"></div>
      <span>{{ copy.lens }}</span>
    </div>
    <!-- 上升余烬：高潮幕的"活着感"，与首屏漂浮光点呼应 -->
    <div class="want-embers" aria-hidden="true">
      <span v-for="i in 7" :key="i" :style="{ '--ember-i': i }"></span>
    </div>
    <div class="want-copy">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="want-title" class="art-title">{{ copy.title }}</h2>
      <p>{{ copy.body }}</p>
    </div>
  </section>
</template>
