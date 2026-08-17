<script setup lang="ts">
const { language } = useSiteLanguage()

const copy = computed(() => language.value === 'zh' ? {
  closing: '给欲望留一点空间。',
  note: '为身体、心智与记忆之间而做。',
  shop: '商店',
  journal: '手记',
  support: '支持',
  faq: '常见问题',
  shipping: '配送',
  returns: '退换',
  contact: '联系',
  legal: '法律',
  privacy: '隐私',
  terms: '条款',
  bag: '购物袋',
  back: '回到顶部 ↑',
} : {
  closing: 'Make room for desire.',
  note: 'Objects for the space between body, mind and memory.',
  shop: 'Shop',
  journal: 'Journal',
  support: 'Support',
  faq: 'FAQ',
  shipping: 'Shipping',
  returns: 'Returns',
  contact: 'Contact',
  legal: 'Legal',
  privacy: 'Privacy',
  terms: 'Terms',
  bag: 'Bag',
  back: 'Back to top ↑',
})
</script>

<template>
  <footer class="commerce-footer">
    <div class="footer-inner">
      <!-- 品牌收束句：一屏收住记忆的大衬线标语 -->
      <p class="footer-closing">{{ copy.closing }}</p>

      <div class="footer-brand">
        <div class="wordmark">MILES <span>CHEN</span></div>
        <p>{{ copy.note }}</p>
      </div>

      <div class="footer-columns">
        <div>
          <h2>{{ copy.shop }}</h2>
          <NuxtLink to="/shop">{{ copy.shop }}</NuxtLink>
          <NuxtLink to="/bag">{{ copy.bag }}</NuxtLink>
          <NuxtLink to="/journal">{{ copy.journal }}</NuxtLink>
        </div>
        <div>
          <h2>{{ copy.support }}</h2>
          <NuxtLink to="/faq">{{ copy.faq }}</NuxtLink>
          <NuxtLink to="/shipping">{{ copy.shipping }}</NuxtLink>
          <NuxtLink to="/returns">{{ copy.returns }}</NuxtLink>
          <NuxtLink to="/contact">{{ copy.contact }}</NuxtLink>
        </div>
        <div>
          <h2>{{ copy.legal }}</h2>
          <NuxtLink to="/privacy">{{ copy.privacy }}</NuxtLink>
          <NuxtLink to="/terms">{{ copy.terms }}</NuxtLink>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 Miles Chen · Demo storefront</span>
        <NuxtLink to="/">{{ copy.back }}</NuxtLink>
      </div>
    </div>
  </footer>
</template>
