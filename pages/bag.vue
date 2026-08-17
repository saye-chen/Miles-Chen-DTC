<script setup lang="ts">
const { language } = useSiteLanguage()
const { lines, total, remove } = useDemoCart()

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: 'Bag / 购物袋',
  title: '你的对象。',
  empty: '购物袋还是空的。',
  browse: '浏览商店',
  checkout: '进入演示结账',
  subtotal: '小计',
  remove: '移除',
  note: '本页面为本地演示，不会创建真实订单。',
} : {
  eyebrow: 'Bag',
  title: 'Your objects.',
  empty: 'Your bag is empty.',
  browse: 'Browse the shop',
  checkout: 'Enter demo checkout',
  subtotal: 'Subtotal',
  remove: 'Remove',
  note: 'This local demo does not create a real order.',
})

usePageMeta(() => ({
  title: language.value === 'zh' ? '购物袋' : 'Bag',
  description: copy.value.note,
}))
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="simple-page section-frame">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="art-title page-title">{{ copy.title }}</h1>

      <div v-if="lines.length" class="bag-lines">
        <div v-for="line in lines" :key="line.productId" class="bag-row">
          <div>
            <strong>{{ line.name }}</strong>
            <span>× {{ line.quantity }}</span>
          </div>
          <div>
            <span>${{ line.price * line.quantity }} USD</span>
            <button type="button" @click="remove(line.productId)">{{ copy.remove }}</button>
          </div>
        </div>
        <div class="bag-total">
          <span>{{ copy.subtotal }}</span>
          <strong>${{ total }} USD</strong>
        </div>
        <NuxtLink class="primary-button" to="/checkout">{{ copy.checkout }} <span>↗</span></NuxtLink>
      </div>

      <div v-else class="empty-bag">
        <div class="empty-bag__atmosphere" aria-hidden="true"></div>
        <p>{{ copy.empty }}</p>
        <NuxtLink class="primary-button" to="/shop">{{ copy.browse }} <span>↗</span></NuxtLink>
      </div>

      <p class="demo-note">{{ copy.note }}</p>
    </main>
    <SiteFooter />
  </div>
</template>
