<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: '02 / 看见体温',
  title: '身体知道，\n先于语言。',
  body: '你还没有触碰它，\n身体已经感觉到了温度。\n\n那是一点停顿，\n也是一个正在靠近的答案。',
  lens: '热源 / HEAT SOURCE',
  senses: ['温度', '柔软', '在场'],
} : {
  eyebrow: '02 / Your body answers first',
  title: 'Your body knows\nbefore you do.',
  body: 'You feel it before you name it.\n\nA warmth. A pause.\nA quiet answer waiting beneath the skin.\n\nBefore thought arrives, the body has already moved closer.',
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
      <p class="touch-body-copy">
        <template v-for="(line, i) in copy.body.split('\n')" :key="i">
          <br v-if="i > 0 && line === ''" aria-hidden="true" />
          <span v-else>{{ line }}</span>
          <br v-if="line !== ''" aria-hidden="true" />
        </template>
      </p>
    </div>

    <div ref="lens" class="touch-lens" data-reveal>
      <SitePicture
        src="/images/journey/originals/unsplash-hand-waist-original.jpg"
        :alt="language === 'zh' ? '黑暗中，手掌沿着温暖的皮肤与身体曲线停留' : 'A hand resting along warm skin and a curved body in the dark'"
        sizes="(max-width: 700px) 92vw, 54vw"
        img-class="touch-lens-img touch-waist-img"
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
