<script setup lang="ts">
import { demoProducts } from '~/data/catalog'

const { language } = useSiteLanguage()
const active = ref('all')

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: 'Shop / 选择你的空间',
  title: '从感受，\n进入选择。',
  description: '按你的关系、距离和时间，找到更接近自己的对象。',
  all: '全部',
  alone: '独处',
  together: '两人',
  remote: '远程',
  meta: '从感受进入选择。按关系、距离与时间，找到更接近自己的对象。演示商品，正式上线前替换。',
} : {
  eyebrow: 'Shop / Choose your space',
  title: 'From feeling,\ninto choice.',
  description: 'Choose by relationship, distance and time. Find the object that comes closer to you.',
  all: 'All',
  alone: 'Alone',
  together: 'Together',
  remote: 'Remote',
  meta: 'From feeling, into choice. Find the object that comes closer to you by relationship, distance and time. Demo products pending confirmation.',
})

const filtered = computed(() => active.value === 'all'
  ? demoProducts
  : demoProducts.filter((product) => product.category === active.value))

const categoryLabel = (category: string) => language.value === 'zh'
  ? ({ alone: '独处', together: '两人', remote: '远程' } as Record<string, string>)[category]
  : category

usePageMeta(() => ({
  title: language.value === 'zh' ? 'Shop · 选择你的空间' : 'Shop — choose your space',
  description: copy.value.meta,
}))
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="commerce-page section-frame">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="art-title page-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h1>
      <p class="page-lead">{{ copy.description }}</p>

      <nav class="filter-nav" aria-label="Product filters">
        <button
          v-for="filter in [['all', copy.all], ['alone', copy.alone], ['together', copy.together], ['remote', copy.remote]]"
          :key="filter[0]"
          type="button"
          :class="{ 'is-active': active === filter[0] }"
          @click="active = filter[0] as string"
        >
          {{ filter[1] }}
        </button>
      </nav>

      <div class="catalog-grid">
        <article v-for="product in filtered" :key="product.id" class="catalog-card">
          <NuxtLink :to="`/product/${product.slug}`">
            <div class="catalog-image">
              <SitePicture
                :src="product.image"
                :alt="product.name"
                sizes="(max-width: 700px) 92vw, (max-width: 960px) 46vw, 30vw"
              />
            </div>
            <div class="catalog-meta">
              <span>{{ categoryLabel(product.category) }}</span>
              <h2>{{ product.name }}</h2>
              <p>{{ product.description }}</p>
              <strong>${{ product.price }} <small>demo</small></strong>
            </div>
          </NuxtLink>
        </article>
      </div>

      <SiteRelationshipSection />
      <SiteTrustSection />
      <SiteAfterDarkJournal />
    </main>
    <SiteFooter />
  </div>
</template>
