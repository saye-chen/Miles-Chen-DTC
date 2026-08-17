<script setup lang="ts">
import { findDemoProduct } from '~/data/catalog'
import { SITE_URL } from '~/composables/usePageMeta'

const route = useRoute()
const product = findDemoProduct(String(route.params.slug))
const { language } = useSiteLanguage()
const { add } = useDemoCart()
const added = ref(false)

if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

const copy = computed(() => language.value === 'zh' ? {
  label: '演示商品',
  price: '演示价格',
  add: '加入购物袋',
  bag: '查看购物袋',
  back: '返回商店',
  facts: '产品信息',
  note: '商品名称、价格、材质、功能、库存、配送和安全信息均为本地演示字段，正式上线前必须替换或核验。',
} : {
  label: 'Illustrative demo',
  price: 'Demo price',
  add: 'Add to bag',
  bag: 'View bag',
  back: 'Back to shop',
  facts: 'Product information',
  note: 'Name, price, material, function, availability, shipping and safety fields are local demo data and must be replaced or verified before launch.',
})

const categoryLabel = computed(() => language.value === 'zh'
  ? ({ alone: '独处', together: '两人', remote: '远程' } as Record<string, string>)[product.category]
  : product.category)

usePageMeta(() => ({
  title: product.name,
  description: product.description,
  image: `${SITE_URL}${product.image}`,
  type: 'article',
}))

function addToBag() {
  add({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image,
  })
  added.value = true
}
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="product-page section-frame">
      <div class="product-detail-visual">
        <SitePicture :src="product.image" :alt="product.name" sizes="(max-width: 960px) 92vw, 52vw" />
      </div>
      <div class="product-detail-copy">
        <p class="eyebrow">{{ categoryLabel }} / {{ product.id }}</p>
        <h1 class="art-title">{{ product.name }}</h1>
        <p class="product-intro">{{ product.description }}</p>
        <div class="product-facts">
          <strong>{{ copy.facts }}</strong>
          <span v-for="feature in product.features" :key="feature">{{ feature }}</span>
          <span>{{ copy.price }} · ${{ product.price }} USD</span>
        </div>
        <NuxtLink v-if="added" class="primary-button" to="/bag">{{ copy.bag }} <span>↗</span></NuxtLink>
        <button v-else class="primary-button" type="button" @click="addToBag">{{ copy.add }} <span>↗</span></button>
        <p class="demo-note">{{ copy.note }}</p>
        <NuxtLink class="back-link" to="/shop">← {{ copy.back }}</NuxtLink>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
