<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '02 / 看见体温',
  title: '黑暗里，\n温度先亮起来。',
  body: '你还没有触碰它，你已经感觉到了它。',
  lens: '热源 / HEAT SOURCE',
  senses: ['温度', '柔软', '在场'],
} : {
  eyebrow: '02 / Your body answers first',
  title: 'Your body knows\nbefore you do.',
  body: 'You feel it before you name it.',
  lens: 'HEAT SOURCE',
  senses: ['WARMTH', 'SOFTNESS', 'PRESENCE'],
})

/** 热源幕：指针靠近影像，体温光斑跟随（与首页同款的触碰机制） */
const lens = ref<HTMLElement | null>(null)
useTouchField(lens)
</script>

<template>
  <section id="feeling" class="body-touch" data-act="02" aria-labelledby="body-touch-title">
    <div class="touch-copy" data-reveal>
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="body-touch-title" class="art-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h2>
      <p>{{ copy.body }}</p>
    </div>

    <div ref="lens" class="touch-lens" data-reveal>
      <SitePicture
        src="/images/journey/skin-touch-v2.png"
        :alt="language === 'zh' ? '黑暗中，手掌沿着温暖的皮肤与身体曲线停留' : 'A hand resting along warm skin and a curved body in the dark'"
        sizes="(max-width: 700px) 92vw, 54vw"
        parallax="0.08"
        img-class="touch-lens-img"
      />
      <div class="lens-ring" aria-hidden="true"></div>
      <span class="touch-label">{{ copy.lens }}</span>
      <!-- 感官标签：悬停/聚焦时逐个亮起，强化材质联想 -->
      <div class="sensory-labels" aria-hidden="true">
        <span v-for="sense in copy.senses" :key="sense">{{ sense }}</span>
      </div>
    </div>
    <!-- 体温余晕：从影像渗向文案一侧的暖光，让热源从暗部里亮起来 -->
    <div class="touch-halo" aria-hidden="true"></div>
    <!-- 右缘题签：与首屏 DARKNESS / 第六幕 ENTER 同一套题签语言 -->
    <span class="act-meta" aria-hidden="true">{{ language === 'zh' ? '02 / 看见体温 · SEE THE HEAT' : '02 / SEE THE HEAT' }}</span>
  </section>
</template>
