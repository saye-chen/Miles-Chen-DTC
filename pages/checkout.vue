<script setup lang="ts">
const { language } = useSiteLanguage()
const submitted = ref(false)

const copy = computed(() => language.value === 'zh' ? {
  eyebrow: 'Checkout / 演示结账',
  title: '先说清楚，\n再确认。',
  note: '这是本地演示结账，不会产生真实订单或支付。',
  name: '姓名',
  email: '邮箱',
  submit: '提交演示订单',
  back: '返回购物袋',
} : {
  eyebrow: 'Checkout / Demo',
  title: 'Clear first,\nthen confirm.',
  note: 'This local demo checkout does not create a real order or payment.',
  name: 'Name',
  email: 'Email',
  submit: 'Submit demo order',
  back: 'Back to bag',
})

usePageMeta(() => ({
  title: language.value === 'zh' ? '演示结账' : 'Demo checkout',
  description: copy.value.note,
}))
</script>

<template>
  <div class="inner-page">
    <SiteHeader />
    <main class="simple-page section-frame">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="art-title page-title">
        <span class="t-line" v-for="(ln, i) in copy.title.split('\n')" :key="i">{{ ln }}</span>
      </h1>
      <p class="page-lead">{{ copy.note }}</p>
      <div class="checkout-atmosphere" aria-hidden="true"></div>

      <form v-if="!submitted" class="demo-form" @submit.prevent="submitted = true">
        <label>{{ copy.name }}
          <input required autocomplete="name" />
        </label>
        <label>{{ copy.email }}
          <input required type="email" autocomplete="email" />
        </label>
        <button class="primary-button" type="submit">{{ copy.submit }} <span>↗</span></button>
      </form>

      <div v-else class="success-state">
        <h2>{{ language === 'zh' ? '演示订单已提交' : 'Demo order submitted' }}</h2>
        <p>{{ language === 'zh' ? '订单编号：DEMO-2026-001' : 'Order number: DEMO-2026-001' }}</p>
        <NuxtLink class="primary-button" to="/shop">{{ language === 'zh' ? '继续浏览' : 'Continue shopping' }} <span>↗</span></NuxtLink>
      </div>

      <NuxtLink class="back-link" to="/bag">← {{ copy.back }}</NuxtLink>
    </main>
    <SiteFooter />
  </div>
</template>
