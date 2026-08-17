<script setup lang="ts">
/**
 * 信息页（faq / shipping / returns / contact / privacy / terms）。
 * 仅接受白名单 slug；未知路径抛出真实 404（不再回退到 FAQ 内容）。
 * 正式上线前替换为经审核的客服与法律内容。
 */
const INFO_SLUGS = ['faq', 'shipping', 'returns', 'contact', 'privacy', 'terms'] as const

const route = useRoute()
const slug = String(route.params.slug)
const { language } = useSiteLanguage()

if (!(INFO_SLUGS as readonly string[]).includes(slug)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const zh: Record<string, [string, string]> = {
  faq: ['常见问题', '这里集中放置产品使用、隐私包装、护理和购买流程的演示说明。正式上线前替换为经过审核的客服内容。'],
  shipping: ['配送', '配送时效、包装方式和可追踪信息将在真实履约方案确认后更新。当前为演示页面。'],
  returns: ['退换', '退换规则需要依据真实商品性质、国家和平台要求确认。当前页面只作为本地演示。'],
  contact: ['联系', 'hello@mileschen.demo · 演示联系地址，正式上线前替换。'],
  privacy: ['隐私', '本地演示不会处理真实订单或支付信息。正式上线前接入正式隐私政策。'],
  terms: ['条款', '本地演示条款。正式上线前由业务与法律团队确认。'],
}
const en: Record<string, [string, string]> = {
  faq: ['Frequently asked questions', 'A place for product use, private packaging, care and purchase guidance. Replace with approved support content before launch.'],
  shipping: ['Shipping', 'Delivery timing, packaging and tracking will be updated after the fulfilment plan is confirmed.'],
  returns: ['Returns', 'Return rules must be confirmed against the actual product, market and platform requirements.'],
  contact: ['Contact', 'hello@mileschen.demo · demo contact only, replace before launch.'],
  privacy: ['Privacy', 'This local demo does not process real orders or payment information.'],
  terms: ['Terms', 'Demo terms only. Confirm with the business and legal teams before launch.'],
}

const content = computed(() => language.value === 'zh' ? zh[slug] : en[slug])

usePageMeta(() => ({
  title: content.value[0],
  description: content.value[1],
}))
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="simple-page section-frame info-page">
      <p class="eyebrow">{{ route.params.slug }}</p>
      <h1 class="art-title page-title">{{ content[0] }}</h1>
      <p class="article-body">{{ content[1] }}</p>
      <NuxtLink class="back-link" to="/">← {{ language === 'zh' ? '返回首页' : 'Back home' }}</NuxtLink>
    </main>
    <SiteFooter />
  </div>
</template>
