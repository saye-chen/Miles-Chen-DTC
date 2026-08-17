<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '03 / 发生触碰',
  title: '手比语言\n更诚实。',
  body: '让触碰代替回答。',
  lens: '触碰 / TOUCH',
} : {
  eyebrow: '03 / Touch begins',
  title: 'Hands are\nmore honest.',
  body: 'Let touch answer instead.',
  lens: 'TOUCH',
})
</script>

<template>
  <section id="touch" class="scenes" data-act="03" aria-labelledby="touch-title">
    <div class="scene-visual">
      <SitePicture
        src="/images/journey/scene-touch-v2.png"
        :alt="language === 'zh' ? '手轻触柔软材质，铜色光线扫过' : 'A hand resting on a soft material as copper light sweeps across'"
        sizes="100vw"
        img-class="scene-img"
      />
      <div class="scene-light" aria-hidden="true"></div>
      <span>{{ copy.lens }}</span>
    </div>
    <div class="scene-copy" data-reveal>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="touch-title" class="art-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h2>
      <p>{{ copy.body }}</p>
    </div>
  </section>
</template>
